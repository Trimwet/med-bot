// @ts-nocheck -- interactive dashboard is being migrated from mock data to the API.
import { useState, useCallback, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { prepare, layout } from '@chenglou/pretext'
import {
  ArrowUp,
  Paperclip,
  Mic,
  Phone,
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
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ApiError, sendChatMessage, fetchTtsAudio } from '@/lib/api'
import VoiceCall from './VoiceCall'
import SplitText from '@/components/ui/SplitText'

const GREETING_MESSAGES = [
  "Tell me what's going on and I'll help you figure out the next step.",
  "Describe how you're feeling and I'll point you in the right direction.",
  "What's on your mind today? I'm here to help you make sense of your symptoms.",
  "Feeling unwell? Describe your symptoms and I'll help you decide what to do next.",
  "Let me help you figure out what's going on. What are you experiencing?",
  "Tell me what you're feeling or ask a health question, and I'll help you figure out the next step.",
]

const MAX_TEXTAREA_HEIGHT = 160

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

const streamTokens = (text: string, onToken: (chunk: string) => void, onDone: () => void, delay = 30) => {
  const chunks = text.match(/.{1,5}/g) || [text]
  let i = 0
  const timer = setInterval(() => {
    if (i < chunks.length) {
      onToken(chunks[i])
      i++
    } else {
      clearInterval(timer)
      onDone()
    }
  }, delay)
  return () => clearInterval(timer)
}

const formatNumber = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n)

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

const ThinkingDisplay = ({ visibleThinking }: { visibleThinking: string }) => {
  return (
    <div className="w-full">
      {THINKING_STEPS.map((step, si) => {
        const textLower = visibleThinking.toLowerCase()
        const isComplete = textLower.includes(step.keyword)
        const isPending = si > 0 && !THINKING_STEPS.slice(0, si).some(s => textLower.includes(s.keyword))
        const status: 'complete' | 'active' | 'pending' = isComplete ? 'complete' : isPending ? 'pending' : 'active'
        const Icon = step.icon

        return (
          <div key={si} className={`flex gap-2 text-sm ${
            status === 'active' ? 'text-gray-800 dark:text-gray-100' : status === 'complete' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600'
          }`}>
            <div className="relative mt-0.5">
              <Icon className={`w-4 h-4 ${status === 'active' ? 'animate-pulse' : ''}`} />
              {si < THINKING_STEPS.length - 1 && (
                <div className="absolute top-6 bottom-0 left-1/2 -mx-px w-px bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="text-xs font-medium">{step.label}</div>
              {status === 'active' && (
                <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap mt-1">
                  {visibleThinking}
                  <span className="inline-block w-1.5 h-3.5 bg-gray-400 dark:bg-gray-500 ml-0.5 align-text-bottom animate-pulse" />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
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

function StreamingBubble({ fullText, visibleText }: { fullText: string; visibleText: string }) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [minHeight, setMinHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (!bubbleRef.current || minHeight !== null) return
    const width = bubbleRef.current.offsetWidth
    if (width <= 0) return
    const contentWidth = width - 32
    try {
      const prepared = prepare(fullText, '400 14px Inter, sans-serif')
      const { height } = layout(prepared, contentWidth, 1.625)
      setMinHeight(Math.ceil(height) + 24)
    } catch {}
  }, [fullText, minHeight])

  return (
    <div
      ref={bubbleRef}
      className="max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md text-sm leading-relaxed break-words bg-white border border-gray-200 text-gray-800 shadow-sm"
      style={minHeight ? { minHeight: `${minHeight}px` } : undefined}
    >
      {visibleText}
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
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [callActive, setCallActive] = useState(false)

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

  // Rotate greeting messages every 6 seconds while no messages are present
  useEffect(() => {
    if (messages.length > 0 || phase !== 'idle') return
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETING_MESSAGES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [messages.length, phase])

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
        (chunk) => setVisibleResponse((p) => p + chunk),
        () => {
          setMessages((prev) => [...prev, { sender: 'assistant', text: result.reply }])
          setUsage((prev) => ({
            ...prev,
            messagesReceived: prev.messagesReceived + 1,
            outputTokens: prev.outputTokens + estimateTokens(result.reply),
          }))
          setVisibleThinking('')
          setVisibleResponse('')
          setPhase('idle')
        },
        15
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
            onClick={() => setCallActive(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#073B4C] dark:text-teal hover:bg-[#073B4C]/5 dark:hover:bg-teal/10 transition-colors"
            aria-label="Start voice call"
          >
            <Phone className="w-[18px] h-[18px]" />
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
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Message actions */}
                  <div className={`flex items-center gap-0.5 mt-1 ${msg.sender === 'user' ? 'pr-1' : 'pl-1'}`}>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(msg.text)
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
                          setInput(msg.text)
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
                          onClick={async () => {
                            if (playingIndex === i) {
                              audioRef.current?.pause()
                              audioRef.current = null
                              setPlayingIndex(null)
                              return
                            }
                            if (audioRef.current) {
                              audioRef.current.pause()
                            }
                            setPlayingIndex(i)
                            try {
                              const blob = await fetchTtsAudio(msg.text)
                              const url = URL.createObjectURL(blob)
                              const audio = new Audio(url)
                              audioRef.current = audio
                              audio.onended = () => { setPlayingIndex(null); audioRef.current = null }
                              audio.onerror = () => { setPlayingIndex(null); audioRef.current = null }
                              await audio.play()
                            } catch {
                              setPlayingIndex(null)
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Listen to response"
                        >
                          {playingIndex === i ? (
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
                <div className="flex flex-col items-start w-full">
                  <div className="w-full pl-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
                      <Brain className="w-3.5 h-3.5 animate-pulse" />
                      <span className="font-medium">Thinking…</span>
                    </div>
                    <ThinkingDisplay visibleThinking={visibleThinking} />
                  </div>
                </div>
              )}

              {/* Live response */}
              {phase === 'responding' && (
                <div className="flex flex-col items-start">
                  <StreamingBubble fullText={fullResponseRef.current} visibleText={visibleResponse} />
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

      {/* Voice Call overlay */}
      {callActive && (
        <VoiceCall
          sessionId={sessionIdRef.current}
          onClose={() => setCallActive(false)}
          onMessage={(msg) => {
            setMessages((prev) => [...prev, { sender: msg.role === 'user' ? 'user' : 'assistant', text: msg.text }])
          }}
        />
      )}
    </div>
  )
}
