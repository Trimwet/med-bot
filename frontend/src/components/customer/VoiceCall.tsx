import { useState, useRef, useCallback, useEffect } from 'react'
import { Phone, PhoneOff, Mic, Loader2, ArrowLeft } from 'lucide-react'
import { sendChatMessage } from '@/lib/api'
import { DitheredWaves } from 'ditherwave'
import { DashboardOrb } from './DashboardOrb'

const WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:5001`

interface CallMessage {
  role: 'user' | 'assistant'
  text: string
}

interface VoiceCallProps {
  sessionId: string
  onClose: () => void
  onMessage?: (msg: CallMessage) => void
}

type CallPhase = 'idle' | 'listening' | 'processing' | 'speaking'

export default function VoiceCall({ sessionId, onClose, onMessage }: VoiceCallProps) {
  const [phase, setPhase] = useState<CallPhase>('idle')
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState<CallMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)

  // ── Refs ────────────────────────────────────────────────────────────────────
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const recognitionActiveRef = useRef(false)   // prevent duplicate instances
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  // Mic stream acquired ONCE per call and held until endCall
  const micStreamRef = useRef<MediaStream | null>(null)
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  // phaseRef mirrors phase state so callbacks always read current value
  const phaseRef = useRef<CallPhase>('idle')
  // reactivityRef: written by rAF loop, read by orb — zero React re-renders
  const reactivityRef = useRef(0)
  // waveAmplitude: written by a throttled rAF, read by DitheredWaves via state
  // updated at most 15fps to avoid expensive canvas redraws at 60fps
  const [waveAmplitude, setWaveAmplitude] = useState(0.3)
  const waveThrottleRef = useRef(0)

  // Pipelined audio: two queues — raw ArrayBuffers and pre-decoded AudioBuffers
  const rawQueueRef = useRef<ArrayBuffer[]>([])
  const decodedQueueRef = useRef<AudioBuffer[]>([])
  const isPlayingRef = useRef(false)
  const isDecodingRef = useRef(false)

  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const analysisRafRef = useRef(0)

  // Keep phaseRef in sync whenever phase state changes
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Duration timer — only run when not idle
  useEffect(() => {
    if (phase !== 'idle') {
      durationIntervalRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    }
    return () => {
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)
    }
  }, [phase])

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // ── Mic setup — acquired ONCE on startCall, released on endCall ─────────────
  const setupMic = useCallback(async () => {
    if (micStreamRef.current) return // already acquired
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream

      // Build AudioContext + AnalyserNode once
      const ctx = new AudioContext()
      audioContextRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      micSourceRef.current = source
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.6
      source.connect(analyser)
      analyserRef.current = analyser
    } catch {
      // Mic denied — reactivity stays at 0
    }
  }, [])

  // ── rAF loop for audio analysis — runs while call is active ─────────────────
  // Writes reactivityRef (for the orb) and throttled waveAmplitude (for DitheredWaves)
  const startAnalysisLoop = useCallback(() => {
    if (!analyserRef.current) return
    const analyser = analyserRef.current
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    const WAVE_INTERVAL = 1000 / 15 // ~15fps for DitheredWaves updates

    const tick = () => {
      analyser.getByteFrequencyData(dataArray)
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]
      const avg = sum / dataArray.length / 255
      const level = Math.min(1, avg * 2.5)

      // Update reactivity ref — zero React re-renders
      reactivityRef.current = level

      // Update DitheredWaves amplitude at ~15fps max
      const now = performance.now()
      if (now - waveThrottleRef.current >= WAVE_INTERVAL) {
        waveThrottleRef.current = now
        setWaveAmplitude(0.3 + level * 1.2)
      }

      analysisRafRef.current = requestAnimationFrame(tick)
    }

    analysisRafRef.current = requestAnimationFrame(tick)
  }, [])

  const stopAnalysisLoop = useCallback(() => {
    cancelAnimationFrame(analysisRafRef.current)
    analysisRafRef.current = 0
    reactivityRef.current = 0
    setWaveAmplitude(0.3)
  }, [])

  // ── Pipelined audio decode ───────────────────────────────────────────────────
  // Decode next chunk in background while current chunk plays
  const decodeNext = useCallback(async () => {
    if (isDecodingRef.current) return
    const chunk = rawQueueRef.current.shift()
    if (!chunk) return
    isDecodingRef.current = true
    try {
      if (!audioContextRef.current) audioContextRef.current = new AudioContext()
      const decoded = await audioContextRef.current.decodeAudioData(chunk)
      decodedQueueRef.current.push(decoded)
    } catch {
      // Skip undecodable chunk
    }
    isDecodingRef.current = false
    // Decode further chunks that arrived while we were decoding
    if (rawQueueRef.current.length > 0) decodeNext()
  }, [])

  const playAudioQueue = useCallback(async () => {
    if (isPlayingRef.current) return
    isPlayingRef.current = true

    while (decodedQueueRef.current.length > 0) {
      const audioBuffer = decodedQueueRef.current.shift()!
      // Start decoding the next chunk while this one plays
      if (rawQueueRef.current.length > 0) decodeNext()

      try {
        if (!audioContextRef.current) audioContextRef.current = new AudioContext()
        const source = audioContextRef.current.createBufferSource()
        source.buffer = audioBuffer
        source.connect(audioContextRef.current.destination)
        await new Promise<void>((resolve) => {
          source.onended = () => resolve()
          source.start()
        })
      } catch {
        // Skip unplayable chunks
      }
    }

    isPlayingRef.current = false
  }, [decodeNext])

  // ── WebSocket — connect eagerly, wait via onopen promise ────────────────────
  const connectWebSocket = useCallback(() => {
    // Reuse if already open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return wsRef.current
    }

    const ws = new WebSocket(`${WS_URL}/api/voice/tts-stream`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'audio' && msg.audio) {
          const binary = atob(msg.audio)
          const bytes = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
          rawQueueRef.current.push(bytes.buffer)
          // Kick off decode immediately (pipeline)
          decodeNext()
          // Start playback once first chunk is decoded
          if (!isPlayingRef.current) {
            // Small delay to let decode finish on first chunk
            setTimeout(() => playAudioQueue(), 0)
          }
        } else if (msg.type === 'finish') {
          // Drain any remaining decoded audio, then resume listening
          playAudioQueue().then(() => {
            if (phaseRef.current !== 'idle') {
              setPhase('listening')
              startListening()
            }
          })
        } else if (msg.type === 'error') {
          setError(msg.message)
          setPhase('idle')
          phaseRef.current = 'idle'
        }
      } catch {}
    }

    ws.onerror = () => {
      setError('Voice connection failed')
      setPhase('idle')
      phaseRef.current = 'idle'
    }

    ws.onclose = () => {
      if (wsRef.current === ws) wsRef.current = null
    }

    return ws
  }, [decodeNext, playAudioQueue]) // startListening added below via ref

  // forward-ref so connectWebSocket can call startListening without circular dep
  const startListeningRef = useRef<() => void>(() => {})

  // ── Send text for TTS — wait for WS via onopen event, not setInterval ───────
  const processUtterance = useCallback(async (text: string) => {
    if (!text.trim()) {
      setPhase('listening')
      phaseRef.current = 'listening'
      startListeningRef.current()
      return
    }

    setPhase('processing')
    phaseRef.current = 'processing'
    const userMsg: CallMessage = { role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    onMessage?.(userMsg)

    try {
      const res = await sendChatMessage(sessionId, text)
      const assistantMsg: CallMessage = { role: 'assistant', text: res.reply }
      setMessages((prev) => [...prev, assistantMsg])
      onMessage?.(assistantMsg)

      // Get or create WebSocket
      const ws = connectWebSocket()

      // Wait for open using event, not polling
      if (ws.readyState !== WebSocket.OPEN) {
        await new Promise<void>((resolve, reject) => {
          ws.addEventListener('open', () => resolve(), { once: true })
          ws.addEventListener('error', () => reject(new Error('WS error')), { once: true })
        })
      }

      setPhase('speaking')
      phaseRef.current = 'speaking'
      ws.send(JSON.stringify({ type: 'text', text: res.reply }))
      ws.send(JSON.stringify({ type: 'stop' }))
    } catch {
      setError('Failed to process message')
      setPhase('listening')
      phaseRef.current = 'listening'
      startListeningRef.current()
    }
  }, [sessionId, connectWebSocket, onMessage])

  // ── Speech recognition — uses phaseRef to avoid stale closures ──────────────
  const startListening = useCallback(() => {
    // Prevent duplicate instances
    if (recognitionActiveRef.current) return

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported in this browser')
      return
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionActiveRef.current = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += t
        } else {
          interimTranscript += t
        }
      }
      setTranscript(interimTranscript || finalTranscript)
      if (finalTranscript) {
        recognitionActiveRef.current = false
        processUtterance(finalTranscript)
      }
    }

    recognition.onerror = (event) => {
      recognitionActiveRef.current = false
      const err = (event as any).error
      if (err !== 'aborted' && phaseRef.current !== 'idle' && phaseRef.current !== 'processing') {
        setTimeout(() => startListeningRef.current(), 500)
      }
    }

    recognition.onend = () => {
      recognitionActiveRef.current = false
      // Auto-restart only if still in listening phase
      if (phaseRef.current === 'listening') {
        setTimeout(() => startListeningRef.current(), 200)
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    setPhase('listening')
    phaseRef.current = 'listening'
  }, [processUtterance])

  // Keep the forward-ref up to date
  useEffect(() => {
    startListeningRef.current = startListening
  }, [startListening])

  const stopListening = useCallback(() => {
    recognitionActiveRef.current = false
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }
  }, [])

  // ── Start call ───────────────────────────────────────────────────────────────
  const startCall = useCallback(async () => {
    setError(null)
    setDuration(0)
    setMessages([])
    setTranscript('')
    phaseRef.current = 'listening'

    // Acquire mic + build audio graph once for the whole call
    await setupMic()
    startAnalysisLoop()

    // Connect WS eagerly so it's ready when first utterance arrives
    connectWebSocket()
    startListening()
  }, [setupMic, startAnalysisLoop, connectWebSocket, startListening])

  // ── End call ─────────────────────────────────────────────────────────────────
  const endCall = useCallback(() => {
    stopListening()
    stopAnalysisLoop()

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop())
      micStreamRef.current = null
    }
    micSourceRef.current = null
    analyserRef.current = null
    rawQueueRef.current = []
    decodedQueueRef.current = []
    isPlayingRef.current = false
    isDecodingRef.current = false
    phaseRef.current = 'idle'
    setPhase('idle')
    onClose()
  }, [stopListening, stopAnalysisLoop, onClose])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening()
      stopAnalysisLoop()
      if (wsRef.current) wsRef.current.close()
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close()
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach((t) => t.stop())
    }
  }, [stopListening, stopAnalysisLoop])

  const phaseLabel: Record<CallPhase, string> = {
    idle: 'Tap to start',
    listening: 'Listening...',
    processing: 'Thinking...',
    speaking: 'Speaking...',
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Dithered wave background — amplitude throttled to ~15fps */}
      <div className="absolute inset-0">
        <DitheredWaves
          waveColor="#00A8A8"
          baseColor="#073B4C"
          pixelSize={6}
          colorNum={7}
          matrixSize={8}
          waveSpeed={0.02}
          waveFrequency={3}
          waveAmplitude={waveAmplitude}
          enableMouseInteraction={false}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-md">
        <button onClick={endCall} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-white/40 text-sm tabular-nums">{formatDuration(duration)}</div>
      </div>

      {/* Center: Status */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Orb receives reactivityRef — never re-renders from audio level changes */}
        <DashboardOrb
          state={phase === 'processing' ? 'thinking' : phase}
          reactivityRef={reactivityRef}
          size={200}
        />

        <div className="text-white text-lg font-medium">{phaseLabel[phase]}</div>

        {transcript && (
          <div className="max-w-sm bg-white/10 rounded-2xl px-4 py-2 text-white/80 text-sm text-center">
            {transcript}
          </div>
        )}

        {error && (
          <div className="max-w-sm bg-red-500/20 rounded-2xl px-4 py-2 text-red-300 text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {/* Messages scroll area */}
      {messages.length > 0 && (
        <div className="relative z-10 w-full max-w-md max-h-40 overflow-y-auto space-y-2 mb-4 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`text-xs px-3 py-1.5 rounded-xl max-w-[85%] ${
              msg.role === 'user'
                ? 'bg-white/10 text-white/70 ml-auto text-right'
                : 'bg-white/5 text-white/50'
            }`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Bottom controls */}
      <div className="relative z-10 flex items-center gap-6">
        {phase === 'idle' ? (
          <button
            onClick={startCall}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-lg"
          >
            <Phone className="w-5 h-5 text-[#073B4C]" />
          </button>
        ) : (
          <>
            <button
              onClick={endCall}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg shadow-red-500/30"
            >
              <PhoneOff className="w-5 h-5 text-white" />
            </button>

            {phase === 'listening' && (
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Mic className="w-4 h-4 text-white animate-pulse" />
              </div>
            )}

            {phase === 'processing' && (
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            )}

            {phase === 'speaking' && (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-white/40 rounded-full animate-pulse"
                    style={{
                      height: `${12 + (i * 4)}px`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '0.6s',
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
