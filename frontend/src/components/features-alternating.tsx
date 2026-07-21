import * as React from 'react'
import { useState, useEffect } from 'react'
import { Stethoscope, BookOpenText, ArrowRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrowserMockup } from '@/components/ui/browser-mockup'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { motion } from 'motion/react'

const CheckItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 text-sm text-muted md:text-base">
    <div className="mt-0.5 size-5 shrink-0 rounded-full bg-teal flex items-center justify-center">
      <svg className="size-3 text-white" viewBox="0 0 20 20" fill="none">
        <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <span>{text}</span>
  </li>
)

const severityData = [
  { name: 'Self-care', value: 442, color: '#28C840' },
  { name: 'Consult', value: 254, color: '#F59E0B' },
  { name: 'Emergency', value: 151, color: '#EF4444' },
]

const total = severityData.reduce((sum, d) => sum + d.value, 0)

/* ── Triage Mockup ─────────────────────────────────────────── */
/* ── Triage Mockup ─────────────────────────────────────────── */
const chatMessages = [
  { role: 'bot' as const, text: "Hello! I'm MedBot. What symptoms are you experiencing today?", delay: 4.0 },
  { role: 'user' as const, text: "I've had a fever and headache for 3 days", delay: 6.0 },
  { role: 'bot' as const, text: "I'm sorry to hear that. Is the fever above 38°C? Any chills, body aches, or stiff neck?", delay: 8.0 },
]

const TriageMockup = () => {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showTyping, setShowTyping] = useState(false)

  useEffect(() => {
    let loopTimer: ReturnType<typeof setInterval>
    function runCycle() {
      setVisibleCount(0)
      setShowTyping(false)
      setTimeout(() => setShowTyping(true), 1000)
      chatMessages.forEach((msg, i) => {
        if (msg.role === 'bot') {
          setTimeout(() => { setShowTyping(false); setVisibleCount(i + 1) }, msg.delay * 1000)
          if (i + 1 < chatMessages.length) {
            setTimeout(() => setShowTyping(true), msg.delay * 1000 + 600)
          }
        } else {
          setTimeout(() => { setVisibleCount(i + 1) }, msg.delay * 1000)
        }
      })
    }
    runCycle()
    loopTimer = setInterval(runCycle, 14000)
    return () => clearInterval(loopTimer)
  }, [])

  return (
  <div className="flex h-80 md:h-96">
    <div className="hidden md:flex w-56 flex-col border-r border-ink/[0.06] bg-ink/[0.02] p-3">
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-teal/10 text-teal text-xs font-semibold mb-3">
        <Stethoscope className="size-3.5" /> New Assessment
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="px-2 py-2 rounded-lg mb-1 relative overflow-hidden bg-ink/[0.04]"
        >
          <div className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.8s_linear_infinite]" />
          <div className="h-2 bg-ink/[0.12] rounded w-3/4 mb-1.5" />
          <div className="h-2 bg-ink/[0.07] rounded w-1/2" />
        </div>
      ))}
    </div>
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-hidden min-h-[240px]">
        <div className="flex flex-col gap-3 justify-end h-full">
        {chatMessages.map((msg, i) => {
          const visible = i < visibleCount
          const showTypingHere = showTyping && i === visibleCount && msg.role === 'bot'
          return (
            <div
              key={i}
              style={{ opacity: (visible || showTypingHere) ? 1 : 0, transition: 'opacity 0.25s ease-out' }}
              className={msg.role === 'user' ? 'flex justify-end' : 'flex gap-2 max-w-[85%]'}
            >
              {msg.role === 'bot' && (
                <div className="size-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Stethoscope className="size-3 text-teal" />
                </div>
              )}
              {showTypingHere ? (
                <div className="px-3 py-2.5 rounded-2xl rounded-tl-md bg-ink/[0.03] flex gap-1">
                  <span className="size-1.5 rounded-full bg-ink/20 animate-bounce [animation-delay:0ms]" />
                  <span className="size-1.5 rounded-full bg-ink/20 animate-bounce [animation-delay:150ms]" />
                  <span className="size-1.5 rounded-full bg-ink/20 animate-bounce [animation-delay:300ms]" />
                </div>
              ) : (
                <div className={`px-3 py-2 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-2xl rounded-tr-md bg-teal text-white max-w-[70%]'
                    : 'rounded-2xl rounded-tl-md bg-ink/[0.03] text-ink/70'
                }`}>
                  {msg.text}
                </div>
              )}
            </div>
          )
        })}
        </div>
      </div>
      <div className="p-3 border-t border-ink/[0.06]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink/[0.03] border border-ink/[0.06]">
          <span className="text-xs text-ink/30 flex-1">Describe your symptoms...</span>
          <div className="size-6 rounded-full bg-teal flex items-center justify-center">
            <ArrowRight className="size-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

/* ── Intersection Observer Hook ──────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

/* ── Severity Mockup ────────────────────────────────────────── */
const SeverityMockup = ({ visible = false }: { visible?: boolean }) => {
  return (
    <div className="flex h-80 md:h-96 flex-col p-5 bg-gradient-to-b from-ink/[0.01] to-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold text-ink/80">Severity Breakdown</div>
          <div className="text-[10px] text-ink/40 mt-0.5">Last 30 days · {total.toLocaleString()} assessments</div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-ink/[0.03] text-[10px] text-ink/40">
          <Clock className="size-2.5" /> Real-time
        </div>
      </div>

      {/* Chart + Legend */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative size-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart key={visible ? 'active' : 'idle'}>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={58}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={visible}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {severityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-bold text-ink/80">{total}</span>
            <span className="text-[9px] text-ink/40">total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1">
          {severityData.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5">
              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-ink/60 flex-1">{item.name}</span>
              <span className="text-xs font-semibold text-ink/80">{item.value}</span>
              <span className="text-[10px] text-ink/40 w-8 text-right">{Math.round((item.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar breakdown */}
      <div className="space-y-3 flex-1">
        {severityData.map((item, i) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-ink/60">{item.name}</span>
              <span className="text-[10px] text-ink/40">{item.value} patients · {Math.round((item.value / total) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-ink/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  backgroundColor: item.color,
                  transitionDelay: visible ? `${300 + i * 100}ms` : '0ms',
                  width: visible ? `${(item.value / total) * 100}%` : '0%',
                }}
              />
            </div>
          </div>
        ))}
        <div className="text-[9px] text-ink/30 mt-1">
          Self-care: Common cold, mild headache · Consult: Persistent fever, malaria · Emergency: Chest pain, severe bleeding
        </div>
      </div>
    </div>
  )
}

/* ── Evidence Mockup ───────────────────────────────────────── */
const EvidenceMockup = () => (
  <div className="flex h-80 md:h-96">
    <div className="hidden md:flex w-52 flex-col border-r border-ink/[0.06] bg-ink/[0.02] p-3">
      <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-ink/60 mb-2">
        <BookOpenText className="size-3.5" /> Protocols
      </div>
      {['Malaria Assessment', 'Typhoid Screening', 'Respiratory Triage', 'Pediatric Fever'].map((p, i) => (
        <div key={i} className={cn(
          "px-2 py-2 rounded-lg text-xs mb-1 cursor-pointer transition",
          i === 0 ? "bg-teal/10 text-teal font-medium" : "text-ink/50 hover:bg-ink/[0.03]"
        )}>
          {p}
        </div>
      ))}
    </div>
    <div className="flex-1 p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-semibold text-teal bg-teal/10 px-2 py-0.5 rounded-full">WHO Guidelines</span>
        <span className="text-[10px] text-ink/30">Updated Jan 2025</span>
      </div>
      <h4 className="text-sm font-semibold text-ink/80 mb-2">Malaria Assessment Protocol</h4>
      <div className="space-y-2">
        <div className="px-3 py-2 rounded-lg bg-ink/[0.03] text-xs text-ink/60">
          <span className="font-medium text-ink/70">Step 1:</span> Ask about fever duration, travel history, and mosquito exposure
        </div>
        <div className="px-3 py-2 rounded-lg bg-ink/[0.03] text-xs text-ink/60">
          <span className="font-medium text-ink/70">Step 2:</span> Check for danger signs — convulsions, prostration, severe anaemia
        </div>
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700">
          <span className="font-semibold">Decision Point:</span> If danger signs present → refer immediately. If not → RDT test.
        </div>
        <div className="px-3 py-2 rounded-lg bg-ink/[0.03] text-xs text-ink/60">
          <span className="font-medium text-ink/70">Step 3:</span> Confirm treatment pathway based on RDT result and severity score
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-ink/30">
        <BookOpenText className="size-3" /> Evidence from 12 clinical sources
      </div>
    </div>
  </div>
)

/* ── Features Data ─────────────────────────────────────────── */
const features: Array<{
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  description: string
  bullets: string[]
  Mockup: React.FC<{ visible?: boolean }>
  url: string
  reverse: boolean
}> = [
  {
    icon: Stethoscope,
    title: 'Symptom Triage',
    description: 'Guided chat conversations ask the right clinical questions, every time. No more missed symptoms or incomplete assessments.',
    bullets: [
      'AI-powered symptom assessment in under 2 minutes',
      'Natural conversation flow in English and local languages',
      'Automatic severity scoring from self-care to emergency',
    ],
    Mockup: TriageMockup,
    url: 'medbot.app/dashboard',
    reverse: false,
  },
  {
    icon: Stethoscope,
    title: 'Severity Scoring',
    description: 'Every assessment is automatically scored and categorized — so your team knows exactly who needs attention first, and who can safely self-manage.',
    bullets: [
      'Three-tier severity: self-care, consult, and emergency',
      'Real-time breakdown across all patient assessments',
      'Evidence-based scoring from WHO clinical protocols',
    ],
    Mockup: SeverityMockup,
    url: 'medbot.app/analytics',
    reverse: true,
  },
  {
    icon: BookOpenText,
    title: 'Evidence-Based Protocols',
    description: 'Built with clinical protocols and always improving from real-world outcomes. Every recommendation is backed by medical evidence.',
    bullets: [
      'Protocols built from WHO and Nigerian clinical guidelines',
      'Continuous learning from anonymized outcome data',
      'Full audit trail for compliance and quality assurance',
    ],
    Mockup: EvidenceMockup,
    url: 'medbot.app/protocols',
    reverse: false,
  },
]

export const FeaturesAlternating = () => {
  const { ref: severityRef, inView: severityVisible } = useInView(0.3)

  return (
    <section className="flex flex-col gap-12 overflow-hidden bg-white py-16 sm:gap-16 md:gap-20 md:py-24 lg:gap-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <span className="text-sm font-semibold text-teal md:text-base">Features</span>
          <h2 className="mt-3 text-4xl font-semibold text-ink md:text-5xl lg:text-6xl">
            Clinical intelligence,<br />built for your team
          </h2>
          <p className="mt-4 text-base text-muted md:mt-5 md:text-lg">
            Powerful, AI-driven triage and assessment tools to help you evaluate faster, prioritize better, and care for more patients.
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:gap-16 md:gap-20 md:px-8 lg:gap-24">
        {features.map((feature, i) => {
          const Icon = feature.icon
          const blobRadii = ['30% 70% 70% 30% / 30% 30% 70% 70%', '70% 30% 30% 70% / 60% 40% 60% 40%', '40% 60% 30% 70% / 50% 40% 60% 50%']
          return (
            <div key={feature.title} className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24">
              <div className={cn("max-w-xl flex-1 self-center", feature.reverse && "lg:order-last")}>
                <div className="flex items-center justify-center size-12 bg-teal/10 text-teal md:size-14" style={{ borderRadius: blobRadii[i] }}>
                  <Icon className="size-6 md:size-7" strokeWidth={1.5} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-ink md:text-3xl">{feature.title}</h2>
                <p className="mt-2 text-base text-muted md:mt-4 md:text-lg">{feature.description}</p>
                <ul className="mt-8 flex flex-col gap-4 pl-2 md:gap-5 md:pl-4">
                  {feature.bullets.map((bullet) => (
                    <CheckItem key={bullet} text={bullet} />
                  ))}
                </ul>
              </div>

              <div ref={feature.title === 'Severity Scoring' ? severityRef : undefined} className="relative w-full flex-1 lg:h-[32rem]">
                <BrowserMockup
                  url={feature.url}
                  fade
                  className={cn(
                    "lg:absolute lg:w-auto lg:max-w-none",
                    feature.reverse ? "lg:right-0" : "lg:left-0",
                  )}
                >
                  <feature.Mockup visible={feature.title === 'Severity Scoring' ? severityVisible : undefined} />
                </BrowserMockup>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
