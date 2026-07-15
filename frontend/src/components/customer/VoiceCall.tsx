import { useState, useRef, useCallback, useEffect } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Loader2, ArrowLeft } from 'lucide-react'
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

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const audioQueueRef = useRef<ArrayBuffer[]>([])
  const isPlayingRef = useRef(false)
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [reactivity, setReactivity] = useState(0)

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Duration timer
  useEffect(() => {
    if (phase !== 'idle') {
      durationIntervalRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    }
    return () => {
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)
    }
  }, [phase])

  // Mic audio analysis → drives ditherwave reactivity
  useEffect(() => {
    if (phase !== 'listening' && phase !== 'speaking') {
      setReactivity(0)
      return
    }

    let animId = 0
    let ctx: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let stream: MediaStream | null = null

    const startAnalysis = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        micStreamRef.current = stream
        ctx = new AudioContext()
        audioContextRef.current = ctx
        const source = ctx.createMediaStreamSource(stream)
        analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.6
        source.connect(analyser)
        analyserRef.current = analyser

        const dataArray = new Uint8Array(analyser.frequencyBinCount)

        const tick = () => {
          analyser!.getByteFrequencyData(dataArray)
          // Average volume (0-255) → normalized (0-1)
          let sum = 0
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]
          const avg = sum / dataArray.length / 255
          // Boost and smooth
          const level = Math.min(1, avg * 2.5)
          setReactivity(level)
          animId = requestAnimationFrame(tick)
        }
        animId = requestAnimationFrame(tick)
      } catch {
        // Mic access denied — no reactivity
      }
    }

    startAnalysis()

    return () => {
      cancelAnimationFrame(animId)
      if (stream) stream.getTracks().forEach((t) => t.stop())
      if (ctx && ctx.state !== 'closed') ctx.close()
      analyserRef.current = null
      micStreamRef.current = null
    }
  }, [phase])

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // Audio playback queue — plays chunks as they arrive
  const playAudioQueue = useCallback(async () => {
    if (isPlayingRef.current) return
    isPlayingRef.current = true

    while (audioQueueRef.current.length > 0) {
      const chunk = audioQueueRef.current.shift()!
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
        }
        const audioBuffer = await audioContextRef.current.decodeAudioData(chunk)
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
  }, [])

  // Connect to backend WebSocket
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(`${WS_URL}/api/voice/tts-stream`)

    ws.onopen = () => {
      wsRef.current = ws
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'audio' && msg.audio) {
          // Decode base64 audio to ArrayBuffer and queue for playback
          const binary = atob(msg.audio)
          const bytes = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
          audioQueueRef.current.push(bytes.buffer)
          playAudioQueue()
        } else if (msg.type === 'finish') {
          setPhase('listening')
          startListening()
        } else if (msg.type === 'error') {
          setError(msg.message)
          setPhase('idle')
        }
      } catch {}
    }

    ws.onerror = () => {
      setError('Voice connection failed')
      setPhase('idle')
    }

    ws.onclose = () => {
      wsRef.current = null
    }

    return ws
  }, [playAudioQueue])

  // Send text to LLM and stream response through Fish Audio
  const processUtterance = useCallback(async (text: string) => {
    if (!text.trim()) {
      setPhase('listening')
      startListening()
      return
    }

    setPhase('processing')
    const userMsg: CallMessage = { role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    onMessage?.(userMsg)

    try {
      const res = await sendChatMessage(sessionId, text)
      const assistantMsg: CallMessage = { role: 'assistant', text: res.reply }
      setMessages((prev) => [...prev, assistantMsg])
      onMessage?.(assistantMsg)

      // Stream response through Fish Audio WebSocket
      const ws = wsRef.current || connectWebSocket()
      // Wait for connection
      if (ws.readyState !== WebSocket.OPEN) {
        await new Promise<void>((resolve) => {
          const check = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              clearInterval(check)
              resolve()
            }
          }, 50)
        })
      }

      setPhase('speaking')
      // Send text for streaming TTS
      ws.send(JSON.stringify({ type: 'text', text: res.reply }))
      // Signal end of text — Fish Audio will stream back and send finish
      ws.send(JSON.stringify({ type: 'stop' }))
    } catch (err) {
      setError('Failed to process message')
      setPhase('listening')
      startListening()
    }
  }, [sessionId, connectWebSocket, onMessage])

  // Speech recognition
  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported in this browser')
      return
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

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
        processUtterance(finalTranscript)
      }
    }

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        // Restart listening on error
        setTimeout(() => {
          if (phase !== 'idle' && phase !== 'processing') startListening()
        }, 500)
      }
    }

    recognition.onend = () => {
      // Auto-restart if we're still in listening phase
      if (phase === 'listening') {
        setTimeout(() => startListening(), 200)
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    setPhase('listening')
  }, [processUtterance, phase])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      recognitionRef.current = null
    }
  }, [])

  // Start call
  const startCall = useCallback(() => {
    setError(null)
    setDuration(0)
    setMessages([])
    setTranscript('')
    connectWebSocket()
    startListening()
  }, [connectWebSocket, startListening])

  // End call
  const endCall = useCallback(() => {
    stopListening()
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
    audioQueueRef.current = []
    isPlayingRef.current = false
    setReactivity(0)
    setPhase('idle')
    onClose()
  }, [stopListening, onClose])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening()
      if (wsRef.current) wsRef.current.close()
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close()
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const phaseLabel: Record<CallPhase, string> = {
    idle: 'Tap to start',
    listening: 'Listening...',
    processing: 'Thinking...',
    speaking: 'Speaking...',
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Dithered wave background */}
      <div className="absolute inset-0">
        <DitheredWaves
          waveColor="#00A8A8"
          baseColor="#073B4C"
          pixelSize={3}
          colorNum={7}
          matrixSize={8}
          waveSpeed={0.02}
          waveFrequency={3}
          waveAmplitude={0.3 + reactivity * 1.2}
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
        {/* Phase indicator — liquid glass orb */}
        <DashboardOrb
          state={phase === 'processing' ? 'thinking' : phase}
          reactivity={reactivity}
          size={200}
        />

        {/* Phase label */}
        <div className="text-white text-lg font-medium">{phaseLabel[phase]}</div>

        {/* Transcript bubble */}
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
                      height: `${12 + Math.random() * 16}px`,
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
