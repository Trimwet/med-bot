import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import NumberFlow from '@number-flow/react'
import { prepareWithSegments, measureNaturalWidth } from '@chenglou/pretext'

interface AnimatedStatProps {
  value: number
  suffix?: string
  decimals?: number
  label: string
  labelWidth: number
  valueWidth: number
  delay?: number
}

function AnimatedStat({ value, suffix = '', decimals = 0, label, labelWidth, valueWidth, delay = 0 }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [target, setTarget] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const timer = setTimeout(() => setTarget(value), delay)
    return () => clearTimeout(timer)
  }, [isInView, value, delay])

  return (
    <div ref={ref}>
      <div className="text-3xl font-semibold mb-1 tracking-tighter flex items-baseline" style={{ minWidth: valueWidth }}>
        <NumberFlow
          value={target}
          decimals={decimals}
          className="text-3xl font-semibold tracking-tighter tabular-nums"
        />
        {suffix && <span>{suffix}</span>}
      </div>
      <div className="text-xs font-medium text-[#9CA3AF] uppercase tracking-widest" style={{ minWidth: labelWidth }}>
        {label}
      </div>
    </div>
  )
}

const stats = [
  { value: 500, suffix: '+', decimals: 0, label: 'Patients triaged' },
  { value: 62, suffix: '%', decimals: 0, label: 'Avg wait reduction' },
  { value: 99.9, suffix: '%', decimals: 1, label: 'Uptime' },
  { value: 120, suffix: '+', decimals: 0, label: 'Hospital partners' },
]

export const StatsSection = () => {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-50px' })

  const measurements = useMemo(() => {
    try {
      const statValues = stats.map(s => `${s.value}${s.suffix}`)
      const fullLabels = stats.map(s => s.label)
      const valueWidths = statValues.map(t => Math.ceil(measureNaturalWidth(prepareWithSegments(t, '600 30px Inter, sans-serif')) + 4))
      const labelWidths = fullLabels.map(t => Math.ceil(measureNaturalWidth(prepareWithSegments(t, '500 12px Inter, sans-serif'))))
      return {
        valueWidths,
        labelWidths,
        maxValueWidth: Math.max(...valueWidths),
        maxLabelWidth: Math.max(...labelWidths),
      }
    } catch {
      return { valueWidths: stats.map(() => 0), labelWidths: stats.map(() => 0), maxValueWidth: 0, maxLabelWidth: 0 }
    }
  }, [])

  return (
    <section className="pb-16 px-6 bg-[#0A202A] text-white relative overflow-hidden">
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,168,168,0.06)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <span className="inline-flex px-4 py-1.5 text-xs font-semibold border border-teal/40 rounded-full text-teal uppercase tracking-[0.2em] bg-teal/10">
              Impact
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-balance leading-none">
              Real results, <br />
              <span className="text-[#9CA3AF]">real hospitals.</span>
            </h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-12 pt-10">
              {stats.map((stat, i) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  label={stat.label}
                  labelWidth={measurements.maxLabelWidth}
                  valueWidth={measurements.maxValueWidth}
                  delay={i * 150}
                />
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-20 bg-linear-to-tr from-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <p className="text-lg md:text-xl text-[#9CA3AF] leading-relaxed text-pretty font-medium">
                MedBot interviews patients by chat or phone, sorts them by
                clinical urgency, and hands your team a ready queue — not
                another inbox to sift through.
              </p>
              <div className="h-px w-20 bg-[#9CA3AF]/30" />
              <p className="text-base text-[#9CA3AF]/70 leading-relaxed text-pretty">
                Every patient gets asked the same clinically grounded questions,
                every time. Your clinicians always make the final call — MedBot
                just makes sure nothing falls through the cracks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}