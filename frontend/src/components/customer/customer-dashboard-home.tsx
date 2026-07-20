// @ts-nocheck -- interactive dashboard is being migrated from mock data to the API.
import { useState, useCallback, useRef, useEffect } from 'react'

import {
  ArrowUp,
  Paperclip,
  Mic,
  Plus,
  Share2,
  Copy,
  Check,
  Pencil,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Brain,
  ChevronDown,
  Search,
  FileText,
  ShieldCheck,
  CircleDot,
  Volume2,
  VolumeX,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
  Cloud,
  Monitor,
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ApiError, sendChatMessage, fetchTtsAudio, fetchSupertonicAudio } from '@/lib/api'
import { cn } from '@/lib/utils'
import SplitText from '@/components/ui/SplitText'
import { Select } from '@/components/ui/select'

const GREETING_MESSAGES = [
  "Tell me what's going on and I'll help you figure out the next step.",
  "Describe how you're feeling and I'll point you in the right direction.",
  "What's on your mind today? I'm here to help you make sense of your symptoms.",
  "Feeling unwell? Describe your symptoms and I'll help you decide what to do next.",
  "Let me help you figure out what's going on. What are you experiencing?",
  "Tell me what you're feeling or ask a health question, and I'll help you figure out the next step.",
]

const SUPERTONIC_VOICES = [
  { label: 'Adewale', value: 'M1' },
  { label: 'Chidi', value: 'M2' },
  { label: 'Emeka', value: 'M3' },
  { label: 'Ibrahim', value: 'M4' },
  { label: 'Kunle', value: 'M5' },
  { label: 'Adaeze', value: 'F1' },
  { label: 'Chioma', value: 'F2' },
  { label: 'Nneka', value: 'F3' },
  { label: 'Fatima', value: 'F4' },
  { label: 'Funke', value: 'F5' },
]

const MAX_TEXTAREA_HEIGHT = 160

function stripEmotionTag(text: string): string {
  return text.replace(/^\[(?:calm|warm|empathetic|serious|laugh|chuckling|concerned|reassuring|urgent|neutral|confident|gentle)\]\s*/i, '')
}

const THINKING_STEPS = [
  { icon: Search, label: 'Searching medical sources', keyword: 'analyz' },
  { icon: FileText, label: 'Reviewing clinical guidelines', keyword: 'symptom' },
  { icon: ShieldCheck, label: 'Assessing severity level', keyword: 'cause' },
  { icon: Brain, label: 'Formulating response', keyword: 'formulate' },
]

const THINKING_TEXT = [
  "Let me analyze this carefully.",
  "First, I need to understand the symptoms and context described.",
  "Looking at the information provided, I'll consider possible causes and relevant medical guidelines.",
  "Now I'll formulate a clear, helpful response with actionable next steps.",
].join('\n\n')

const RESPONSE_TEXT =
  "Based on my analysis, here's what I'd recommend:\n\n" +
  "1. **Monitor your symptoms** — keep track of when they occur and any triggers.\n" +
  "2. **Consider scheduling a visit** with your primary care physician if symptoms persist.\n" +
  "3. **In the meantime**, stay hydrated and rest as needed.\n\n" +
  "Would you like me to help you prepare questions for a doctor's visit?"

type Message = {
  sender: 'user' | 'assistant'
  text: string
  reasoning?: string
  feedback?: 'up' | 'down' | null
}

type UsageStats = {
  messagesSent: number
  messagesReceived: number
  inputTokens: number
  outputTokens: number
}

// Streams text chunk by chunk, calling onUpdate with the full accumulated text each tick.
// Passing full text (not deltas) means React can safely drop intermediate renders
// without losing content — critical for stable markdown rendering.
const streamTokens = (text: string, onUpdate: (full: string) => void, onDone: () => void, delay = 20) => {
  const chunks = text.match(/.{1,8}/g) || [text]
  let i = 0
  let acc = ''
  const timer = setInterval(() => {
    if (i < chunks.length) {
      acc += chunks[i]
      onUpdate(acc)
      i++
    } else {
      clearInterval(timer)
      onDone()
    }
  }, delay)
  return () => clearInterval(timer)
}

const formatNumber = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n)

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const SessionUsage = ({ stats }: { stats: UsageStats }) => {
  const [open, setOpen] = useState(false)
  const inputPct = Math.min((stats.inputTokens / 128_000) * 100, 100)
  const outputPct = Math.min((stats.outputTokens / 128_000) * 100, 100)
  const totalTokens = stats.inputTokens + stats.outputTokens
  const totalPct = Math.min((totalTokens / 128_000) * 100, 100)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
        <div className="flex items-center gap-2">
          <CircleDot className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          <span>Session usage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-gray-400 dark:text-gray-500">{formatNumber(totalTokens)} tokens</span>
          <ChevronDown className="w-3 h-3 transition-transform group-data-[state=open]:rotate-180" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 px-3 pb-2 space-y-3">
        {/* Overall progress */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-gray-500 dark:text-gray-400">Overall usage</span>
            <span className="font-mono text-gray-400 dark:text-gray-500">{totalPct.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#073B4C] dark:bg-teal rounded-full transition-all duration-500"
              style={{ width: `${totalPct}%` }}
            />
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
            {formatNumber(totalTokens)} / 128K tokens
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-gray-500 dark:text-gray-400">Input tokens</span>
              <span className="font-mono text-gray-400 dark:text-gray-500">{formatNumber(stats.inputTokens)}</span>
            </div>
            <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00A8A8] rounded-full transition-all duration-500"
                style={{ width: `${inputPct}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-gray-500 dark:text-gray-400">Output tokens</span>
              <span className="font-mono text-gray-400 dark:text-gray-500">{formatNumber(stats.outputTokens)}</span>
            </div>
            <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4C8C5B] rounded-full transition-all duration-500"
                style={{ width: `${outputPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Message counts */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-400">Messages</span>
          <span className="font-mono text-gray-400 dark:text-gray-500">
            {stats.messagesSent} sent · {stats.messagesReceived} received
          </span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const ReasoningDisplay = ({ reasoning }: { reasoning: string }) => {
  const steps = reasoning.split('\n\n').filter(Boolean)

  return (
    <div className="space-y-3">
      {steps.map((step, si) => {
        const Icon = THINKING_STEPS[si % THINKING_STEPS.length]?.icon || Brain
        return (
          <div key={si} className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="relative mt-0.5">
              <Icon className="w-4 h-4" />
              {si < steps.length - 1 && (
                <div className="absolute top-6 bottom-0 left-1/2 -mx-px w-px bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
            <div className="flex-1 text-xs leading-relaxed whitespace-pre-wrap">
              {step}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Markdown({ text }: { text: string }) {
  const renderInline = (str: string, key: number) => {
    const parts = str.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g)
    return (
      <span key={key}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
            return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
          if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
            return <em key={i}>{part.slice(1, -1)}</em>
          if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
            return <code key={i} className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-[0.85em] font-mono">{part.slice(1, -1)}</code>
          return part
        })}
      </span>
    )
  }
  const blocks = text.split(/\n\n+/)
  return (
    <div className="space-y-2 [&>*:last-child]:mb-0">
      {blocks.map((block, bi) => {
        const lines = block.split('\n')
        if (lines[0]?.match(/^\d+\.\s/)) {
          return (
            <ol key={bi} className="list-decimal list-outside ml-4 space-y-1">
              {lines.filter(l => l.match(/^\d+\.\s/)).map((line, li) => (
                <li key={li}>{renderInline(line.replace(/^\d+\.\s+/, ''), li)}</li>
              ))}
            </ol>
          )
        }
        if (lines[0]?.match(/^[-*]\s/)) {
          return (
            <ul key={bi} className="list-disc list-outside ml-4 space-y-1">
              {lines.filter(l => l.match(/^[-*]\s/)).map((line, li) => (
                <li key={li}>{renderInline(line.replace(/^[-*]\s+/, ''), li)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={bi} className="leading-relaxed">
            {lines.map((line, li) => (
              <span key={li}>
                {renderInline(line, li)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

function StreamingBubble({ visibleText }: { visibleText: string }) {
  return (
    <div className="max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md text-sm leading-relaxed break-words bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 shadow-sm transition-[min-height] duration-300 ease-out">
      <Markdown text={stripEmotionTag(visibleText)} />
      <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 align-text-bottom animate-pulse" />
    </div>
  )
}

export const CustomerDashboardHome = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [visibleThinking, setVisibleThinking] = useState('')
  const [visibleResponse, setVisibleResponse] = useState('')
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'responding'>('idle')
  const fullResponseRef = useRef('')
  const [usage, setUsage] = useState<UsageStats>({
    messagesSent: 0,
    messagesReceived: 0,
    inputTokens: 0,
    outputTokens: 0,
  })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef(crypto.randomUUID())
  const [greetingIndex, setGreetingIndex] = useState(() => Math.floor(Math.random() * GREETING_MESSAGES.length))
  const [wave, setWave] = useState(false)
  const waveRef = useRef<HTMLSpanElement>(null)
  const [audioState, setAudioState] = useState<{
    messageIndex: number | null
    playing: boolean
    currentTime: number
    duration: number
    speed: number
    loading: boolean
  }>({ messageIndex: null, playing: false, currentTime: 0, duration: 0, speed: 1, loading: false })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioTimeRef = useRef<number>(0)
  const [ttsEngine, setTtsEngine] = useState<'fishAudio' | 'supertonic'>('fishAudio')
  const [supertonicVoice, setSupertonicVoice] = useState('M1')
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const thinkingStartRef = useRef<number | null>(null)
  const [thinkingDuration, setThinkingDuration] = useState<number | null>(null)
  const [thinkingOpen, setThinkingOpen] = useState(false)

  useEffect(() => {
    if (!wave || !waveRef.current) return
    const el = waveRef.current
    const animate = () => {
      if (!document.contains(el)) return
      el.animate(
        [
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(14deg)' },
          { transform: 'rotate(-8deg)' },
          { transform: 'rotate(14deg)' },
          { transform: 'rotate(-4deg)' },
          { transform: 'rotate(10deg)' },
          { transform: 'rotate(0deg)' }
        ],
        { duration: 800, easing: 'ease-in-out', iterations: 1 }
      )
    }
    animate()
    const interval = setInterval(animate, 6000)
    return () => clearInterval(interval)
  }, [wave, messages.length === 0])

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT) + 'px'
  }, [])

  useEffect(() => { adjustHeight() }, [input, adjustHeight])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, visibleThinking, visibleResponse, phase])

  useEffect(() => {
    if (phase === 'thinking') {
      thinkingStartRef.current = Date.now()
      setThinkingDuration(null)
      setThinkingOpen(true)
    } else if (thinkingStartRef.current !== null) {
      setThinkingDuration(Math.ceil((Date.now() - thinkingStartRef.current) / 1000))
      thinkingStartRef.current = null
      setTimeout(() => setThinkingOpen(false), 1000)
    }
  }, [phase])

  // Rotate greeting messages every 6 seconds while no messages are present
  useEffect(() => {
    if (messages.length > 0 || phase !== 'idle') return
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETING_MESSAGES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [messages.length, phase])

  // Audio time ticker
  useEffect(() => {
    if (!audioState.playing || !audioRef.current) return
    const ticker = setInterval(() => {
      if (audioRef.current) {
        audioTimeRef.current = audioRef.current.currentTime
        setAudioState((s) => ({ ...s, currentTime: audioRef.current!.currentTime }))
      }
    }, 250)
    return () => clearInterval(ticker)
  }, [audioState.playing])

  const prepareAudio = useCallback((msgIndex: number) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setAudioState({ messageIndex: msgIndex, playing: false, currentTime: 0, duration: 0, speed: audioState.speed, loading: false })
  }, [audioState.speed])

  const triggerAudio = useCallback(async (msgIndex: number, text: string) => {
    if (audioState.messageIndex === msgIndex && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
        setAudioState((s) => ({ ...s, playing: true }))
      } else {
        audioRef.current.pause()
        setAudioState((s) => ({ ...s, playing: false }))
      }
      return
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setAudioState({ messageIndex: msgIndex, playing: false, currentTime: 0, duration: 0, speed: audioState.speed, loading: true })
    try {
      const blob = ttsEngine === 'supertonic' ? await fetchSupertonicAudio(text, supertonicVoice) : await fetchTtsAudio(text)
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.playbackRate = audioState.speed
      audioRef.current = audio
      audio.onloadedmetadata = () => {
        setAudioState((s) => ({ ...s, duration: audio.duration, loading: false }))
      }
      audio.onended = () => {
        setAudioState((s) => ({ ...s, playing: false, currentTime: 0 }))
        audioRef.current = null
      }
      audio.onerror = () => {
        setAudioState({ messageIndex: null, playing: false, currentTime: 0, duration: 0, speed: 1, loading: false })
        audioRef.current = null
      }
      await audio.play()
      setAudioState((s) => ({ ...s, playing: true }))
    } catch {
      setAudioState({ messageIndex: null, playing: false, currentTime: 0, duration: 0, speed: 1, loading: false })
    }
  }, [audioState.messageIndex, ttsEngine])

  const closeAudio = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null
    setAudioState({ messageIndex: null, playing: false, currentTime: 0, duration: 0, speed: 1, loading: false })
  }, [])

  const seekAudio = useCallback((seconds: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds))
  }, [])

  const cycleSpeed = useCallback(() => {
    const speeds = [0.75, 1, 1.25, 1.5]
    const next = speeds[(speeds.indexOf(audioState.speed) + 1) % speeds.length]
    if (audioRef.current) audioRef.current.playbackRate = next
    setAudioState((s) => ({ ...s, speed: next }))
  }, [audioState.speed])

  const handleToggleEngine = useCallback(() => {
    const newEngine = ttsEngine === 'fishAudio' ? 'supertonic' : 'fishAudio'
    setTtsEngine(newEngine)
    const wasPlaying = audioState.playing && audioState.messageIndex !== null
    const currentText = wasPlaying ? messages[audioState.messageIndex]?.text : null
    if (wasPlaying && currentText) {
      audioRef.current?.pause()
      audioRef.current = null
      setAudioState((s) => ({ ...s, playing: false, currentTime: 0, duration: 0, loading: true }))
      const fetchFn = newEngine === 'supertonic' ? (t: string) => fetchSupertonicAudio(t, supertonicVoice) : fetchTtsAudio
      fetchFn(currentText)
        .then((blob) => {
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audio.playbackRate = audioState.speed
          audioRef.current = audio
          audio.onloadedmetadata = () => {
            setAudioState((s) => ({ ...s, duration: audio.duration, loading: false }))
          }
          audio.onended = () => {
            setAudioState((s) => ({ ...s, playing: false, currentTime: 0 }))
            audioRef.current = null
          }
          audio.onerror = () => {
            setAudioState({ messageIndex: null, playing: false, currentTime: 0, duration: 0, speed: audioState.speed, loading: false })
            audioRef.current = null
          }
          audio.play().then(() => {
            setAudioState((s) => ({ ...s, playing: true }))
          })
        })
        .catch(() => {
          setAudioState({ messageIndex: null, playing: false, currentTime: 0, duration: 0, speed: audioState.speed, loading: false })
        })
    }
  }, [ttsEngine, supertonicVoice, audioState.playing, audioState.messageIndex, audioState.speed, messages])

  const estimateTokens = (text: string) => Math.ceil(text.length / 4)

  const toggleVoiceInput = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) return

    if (recording && recognitionRef.current) {
      recognitionRef.current.stop()
      setRecording(false)
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript
      if (transcript) {
        setInput((prev) => (prev ? prev + ' ' + transcript : transcript))
        requestAnimationFrame(() => { textareaRef.current?.focus(); adjustHeight() })
      }
      setRecording(false)
    }

    recognition.onerror = () => setRecording(false)
    recognition.onend = () => setRecording(false)

    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }, [recording])

  const handleSend = useCallback(async () => {
    if (!input.trim() || phase !== 'idle') return
    const text = input.trim()
    setMessages((prev) => [...prev, { sender: 'user', text }])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    setUsage((prev) => ({
      ...prev,
      messagesSent: prev.messagesSent + 1,
      inputTokens: prev.inputTokens + estimateTokens(text) + estimateTokens(THINKING_TEXT),
    }))

    setPhase('thinking')
    setVisibleThinking('')
    fullResponseRef.current = ''

    setVisibleThinking('Reviewing your message and checking for urgent symptoms.')
    try {
      const result = await sendChatMessage(sessionIdRef.current, text)
      fullResponseRef.current = result.reply
      setPhase('responding')
      setVisibleResponse('')
      streamTokens(
        result.reply,
        (full) => setVisibleResponse(full),
        () => {
          // Brief delay so the streaming bubble fades into the permanent message
          setTimeout(() => {
            setMessages((prev) => [...prev, { sender: 'assistant', text: result.reply }])
            setUsage((prev) => ({
              ...prev,
              messagesReceived: prev.messagesReceived + 1,
              outputTokens: prev.outputTokens + estimateTokens(result.reply),
            }))
            setVisibleThinking('')
            setVisibleResponse('')
            setPhase('idle')
          }, 80)
        },
        // default delay 20ms
      )
    } catch (err) {
      const reply = err instanceof ApiError && err.status === 401
        ? 'Your session has expired. Please sign in again to continue.'
        : 'I could not reach MedBot right now. If you have urgent symptoms, call 112 or go to the nearest emergency department.'
      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }])
      setVisibleThinking('')
      setPhase('idle')
    }
  }, [input, phase])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const stopGeneration = () => {
    setPhase('idle')
    setVisibleThinking('')
    setVisibleResponse('')
  }

  const isBusy = phase !== 'idle'

  return (
    <div className="flex flex-col h-full">
      {/* Session header */}
      <div className="flex items-center justify-between px-3 sm:px-6 h-14 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-[#0f1117]">
        <div className="min-w-0 flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">New Assessment</h1>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => { sessionIdRef.current = crypto.randomUUID(); setMessages([]); setInput(''); stopGeneration() }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 h-8 rounded-lg text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Start new assessment"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Share conversation"
          >
            <Share2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 [scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {messages.length === 0 && !isBusy ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-sm mx-auto px-4">
              <div className="w-12 h-12 rounded-xl bg-[#073B4C]/5 dark:bg-teal/10 flex items-center justify-center mx-auto mb-4">
                <img src="/assets/Logo.jpeg" alt="" className="w-8 h-8 rounded-lg" />
              </div>
              <h2
                className="text-gray-900 dark:text-gray-100 text-base font-semibold mb-1.5 transition-opacity duration-500"
                style={{ opacity: wave ? 1 : 0, transform: wave ? 'translateY(0)' : 'translateY(8px)' }}
              >
                Hi, I&rsquo;m MedBot <span ref={waveRef} className="inline-block">👋</span>
              </h2>
              <SplitText
                key={greetingIndex}
                text={GREETING_MESSAGES[greetingIndex]}
                className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed"
                tag="p"
                delay={15}
                duration={0.5}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 10 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-50px"
                textAlign="center"
                onStart={() => setWave(true)}
              />
            </div>
          </div>
        ) : (
          <div className="min-h-full flex flex-col justify-end">
            <div className="max-w-3xl mx-auto w-full space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Reasoning for assistant messages */}
                  {msg.sender === 'assistant' && msg.reasoning && (
                    <Collapsible defaultOpen={false} className="w-full mb-2">
                      <CollapsibleTrigger className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors group cursor-pointer">
                        <Brain className="w-3.5 h-3.5" />
                        <span>Reasoning</span>
                        <ChevronDown className="w-3 h-3 transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 pl-1">
                        <ReasoningDisplay reasoning={msg.reasoning} />
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                      msg.sender === 'user'
                        ? 'bg-[#073B4C] text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm animate-[fade-in_0.3s_ease-out]'
                    }`}
                  >
                    {msg.sender === 'assistant'
                      ? <Markdown text={stripEmotionTag(msg.text)} />
                      : msg.text}
                  </div>

                  {/* Message actions */}
                  <div className={`flex items-center gap-0.5 mt-1 ${msg.sender === 'user' ? 'pr-1' : 'pl-1'}`}>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(stripEmotionTag(msg.text))
                          setCopiedIndex(i)
                          setTimeout(() => setCopiedIndex((cur) => (cur === i ? null : cur)), 1500)
                        } catch {}
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Copy message"
                    >
                      {copiedIndex === i ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {msg.sender === 'user' ? (
                      <button
                        onClick={() => {
                          setInput(stripEmotionTag(msg.text))
                          requestAnimationFrame(() => { textareaRef.current?.focus(); adjustHeight() })
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Edit and resend"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => prepareAudio(i)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Listen to response"
                        >
                          {audioState.messageIndex === i && audioState.playing ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Regenerate response"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setMessages((prev) =>
                              prev.map((m, j) =>
                                j === i ? { ...m, feedback: m.feedback === 'up' ? null : 'up' } : m
                              )
                            )
                          }
                          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                            msg.feedback === 'up'
                              ? 'text-[#073B4C] dark:text-teal bg-[#073B4C]/5 dark:bg-teal/10'
                              : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          aria-label="Good response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setMessages((prev) =>
                              prev.map((m, j) =>
                                j === i ? { ...m, feedback: m.feedback === 'down' ? null : 'down' } : m
                              )
                            )
                          }
                          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                            msg.feedback === 'down'
                              ? 'text-red-600 bg-red-50 dark:bg-red-950/30'
                              : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          aria-label="Poor response"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Share response"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Live thinking */}
              {phase === 'thinking' && (
                <Collapsible open={thinkingOpen} onOpenChange={setThinkingOpen}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <span className="inline-block w-2 h-2 rounded-full bg-teal animate-[dot-bounce_0.6s_ease-in-out_infinite]" />
                    <span className="text-sm bg-[length:200%_100%] bg-clip-text text-transparent [background-image:linear-gradient(90deg,transparent_0%,#374151_50%,transparent_100%)] dark:[background-image:linear-gradient(90deg,transparent_0%,#d1d5db_50%,transparent_100%)] animate-[shimmer-text_2s_ease-in-out_infinite]">Thinking...</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", thinkingOpen && "rotate-180")} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Analyzing your message and checking medical protocols...</p>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Live response */}
              {phase === 'responding' && visibleResponse && (
                <div className="flex flex-col items-start animate-[fade-in_0.2s_ease-out]">
                  <StreamingBubble visibleText={visibleResponse} />
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        )}
      </div>

      {/* Session Usage — fixed above composer */}
      {(usage.messagesSent > 0 || usage.messagesReceived > 0) && (
        <div className="bg-white dark:bg-[#0f1117] border-t border-gray-100 dark:border-gray-800 px-3 sm:px-6 shrink-0">
          <SessionUsage stats={usage} />
        </div>
      )}

      {/* Audio Player */}
      {audioState.messageIndex !== null && (
        <div className="bg-white dark:bg-[#0f1117] border-t border-gray-100 dark:border-gray-800 px-3 sm:px-6 pt-3 pb-2 shrink-0 relative z-50">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl px-3 sm:px-4 py-2.5 shadow-sm">
              {/* Play / Pause */}
              <button
                onClick={() => {
                  if (audioState.messageIndex === null) return
                  if (!audioRef.current) {
                    triggerAudio(audioState.messageIndex, messages[audioState.messageIndex]?.text || '')
                    return
                  }
                  if (audioRef.current.paused) {
                    audioRef.current.play()
                    setAudioState((s) => ({ ...s, playing: true }))
                  } else {
                    audioRef.current.pause()
                    setAudioState((s) => ({ ...s, playing: false }))
                  }
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#073B4C] dark:bg-teal text-white hover:bg-[#0A202A] dark:hover:bg-teal/80 transition-colors shrink-0"
                aria-label={audioState.playing ? 'Pause' : 'Play'}
              >
                {audioState.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : audioState.playing ? (
                  <Pause className="w-4 h-4" fill="currentColor" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                )}
              </button>

              {/* Rewind 15s */}
              <button
                onClick={() => seekAudio(-15)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
                aria-label="Rewind 15 seconds"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              {/* Progress bar */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 tabular-nums shrink-0 w-8 text-right">
                  {formatTime(audioState.currentTime)}
                </span>
                <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer group relative"
                  onClick={(e) => {
                    if (!audioRef.current || !audioRef.current.duration) return
                    const rect = e.currentTarget.getBoundingClientRect()
                    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                    audioRef.current.currentTime = pct * audioRef.current.duration
                  }}
                >
                  <div
                    className="h-full bg-[#073B4C] dark:bg-teal rounded-full transition-[width] duration-100"
                    style={{ width: audioState.duration ? `${(audioState.currentTime / audioState.duration) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 tabular-nums shrink-0 w-8">
                  {formatTime(audioState.duration)}
                </span>
              </div>

              {/* Forward 15s */}
              <button
                onClick={() => seekAudio(15)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
                aria-label="Forward 15 seconds"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Speed */}
              <button
                onClick={cycleSpeed}
                className="min-w-[36px] h-8 flex items-center justify-center rounded-full text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0 tabular-nums"
                aria-label="Playback speed"
              >
                {audioState.speed}x
              </button>

              {/* TTS Engine toggle */}
              <button
                onClick={handleToggleEngine}
                className={`h-8 flex items-center gap-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 px-2.5 ${
                  ttsEngine === 'fishAudio'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-teal dark:text-teal bg-teal/10 dark:bg-teal/10'
                }`}
                aria-label="Toggle TTS engine"
                title={ttsEngine === 'fishAudio' ? 'Fish Audio (cloud) - click for Supertonic (local)' : 'Supertonic (local) - click for Fish Audio (cloud)'}
              >
                {ttsEngine === 'fishAudio' ? <Cloud className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
              </button>

              {/* Supertonic voice selector */}
              {ttsEngine === 'supertonic' && (
                <Select
                  value={supertonicVoice}
                  onValueChange={setSupertonicVoice}
                  options={SUPERTONIC_VOICES}
                  className="w-28 shrink-0"
                  dropUp
                />
              )}

              {/* Close */}
              <button
                onClick={closeAudio}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
                aria-label="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Composer */}
      <div
        className="bg-white dark:bg-[#0f1117] px-3 sm:px-6 pt-3 shrink-0"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md focus-within:shadow-[0_0_0_4px_rgba(7,59,76,0.08),0_0_18px_rgba(7,59,76,0.10)] focus-within:border-[#073B4C]/30 dark:focus-within:border-teal/30 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message MedBot..."
              rows={1}
              disabled={isBusy}
              className="w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-base sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none leading-relaxed disabled:opacity-50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
            />

            <div className="flex items-center justify-between px-2 pb-2 pt-1">
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={isBusy}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-[18px] h-[18px]" />
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={toggleVoiceInput}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:opacity-40 ${
                    recording
                      ? 'text-red-500 bg-red-50 dark:bg-red-950/30 animate-pulse'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-label={recording ? 'Stop recording' : 'Voice input'}
                >
                  <Mic className="w-[18px] h-[18px]" />
                </button>
              </div>

              {isBusy ? (
                <button
                  onClick={stopGeneration}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors shrink-0"
                  aria-label="Stop generating"
                >
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#073B4C] dark:bg-teal text-white hover:bg-[#0A202A] dark:hover:bg-teal/80 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-2 pb-1">
            MedBot provides health information, not medical advice.
          </p>
        </div>
      </div>

    </div>
  )
}
