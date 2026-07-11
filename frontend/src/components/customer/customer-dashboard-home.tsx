import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from 'react'
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
} from 'lucide-react'

const MAX_TEXTAREA_HEIGHT = 160

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

export const CustomerDashboardHome = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [visibleThinking, setVisibleThinking] = useState('')
  const [visibleResponse, setVisibleResponse] = useState('')
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'responding'>('idle')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

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

  const handleSend = useCallback(() => {
    if (!input.trim() || phase !== 'idle') return
    const text = input.trim()
    setMessages((prev) => [...prev, { sender: 'user', text }])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    setPhase('thinking')
    setVisibleThinking('')

    streamTokens(
      THINKING_TEXT,
      (chunk) => setVisibleThinking((p) => p + chunk),
      () => {
        setPhase('responding')
        setVisibleResponse('')
        streamTokens(
          RESPONSE_TEXT,
          (chunk) => setVisibleResponse((p) => p + chunk),
          () => {
            setMessages((prev) => [
              ...prev,
              { sender: 'assistant', text: RESPONSE_TEXT, reasoning: THINKING_TEXT },
            ])
            setVisibleThinking('')
            setVisibleResponse('')
            setPhase('idle')
          },
          25
        )
      },
      35
    )
  }, [input, phase])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
      <div className="flex items-center justify-between px-3 sm:px-6 h-14 border-b border-gray-100 shrink-0 bg-white">
        <div className="min-w-0 flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900 truncate">New Assessment</h1>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#073B4C] bg-[#073B4C]/5 px-2 py-0.5 rounded-full shrink-0">
            <Zap className="w-3 h-3" />
            Instant Triage
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => { setMessages([]); setInput(''); stopGeneration() }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 h-8 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Start new assessment"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Share conversation"
          >
            <Share2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
        {messages.length === 0 && !isBusy ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-sm mx-auto px-4">
              <div className="w-12 h-12 rounded-xl bg-[#073B4C]/5 flex items-center justify-center mx-auto mb-4">
                <img src="/assets/Logo.jpeg" alt="" className="w-8 h-8 rounded-lg" />
              </div>
              <h2 className="text-gray-900 text-base font-semibold mb-1.5">
                Hi, I&rsquo;m MedBot 👋
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tell me what you&rsquo;re feeling or ask a health question, and I&rsquo;ll help you figure out the next step.
              </p>
            </div>
          </div>
        ) : (
          <div className="min-h-full flex flex-col justify-end">
            <div className="max-w-3xl mx-auto w-full space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Reasoning for assistant messages */}
                  {msg.sender === 'assistant' && msg.reasoning && (
                    <details className="w-full mb-2 group">
                      <summary className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors list-none">
                        <Brain className="w-3.5 h-3.5" />
                        <span>Thought process</span>
                        <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-2 text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                        {msg.reasoning}
                      </div>
                    </details>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                      msg.sender === 'user'
                        ? 'bg-[#073B4C] text-white rounded-br-md'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
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
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Edit and resend"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
                              ? 'text-[#073B4C] bg-[#073B4C]/5'
                              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
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
                              ? 'text-red-600 bg-red-50'
                              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                          aria-label="Poor response"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
                  <div className="w-full">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Brain className="w-3.5 h-3.5 animate-pulse" />
                      <span className="animate-pulse">Thinking...</span>
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                      {visibleThinking}
                      <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 align-text-bottom animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Live response */}
              {phase === 'responding' && (
                <div className="flex flex-col items-start">
                  <div className="max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md text-sm leading-relaxed break-words bg-white border border-gray-200 text-gray-800 shadow-sm">
                    {visibleResponse}
                    <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 align-text-bottom animate-pulse" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div
        className="bg-white px-3 sm:px-6 pt-3 shrink-0"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-md focus-within:shadow-[0_0_0_4px_rgba(7,59,76,0.08),0_0_18px_rgba(7,59,76,0.10)] focus-within:border-[#073B4C]/30 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message MedBot..."
              rows={1}
              disabled={isBusy}
              className="w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-base sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
            />

            <div className="flex items-center justify-between px-2 pb-2 pt-1">
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={isBusy}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-[18px] h-[18px]" />
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                  aria-label="Voice input"
                >
                  <Mic className="w-[18px] h-[18px]" />
                </button>
              </div>

              {isBusy ? (
                <button
                  onClick={stopGeneration}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors shrink-0"
                  aria-label="Stop generating"
                >
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#073B4C] text-white hover:bg-[#0A202A] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-2 pb-1">
            MedBot provides health information, not medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
