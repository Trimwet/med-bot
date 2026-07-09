import React from 'react'
import { motion } from 'motion/react'

const stats = [
  { label: 'Patients triaged', value: '50K+' },
  { label: 'Avg wait reduction', value: '62%' },
  { label: 'Uptime', value: '99.9%' },
  { label: 'Hospital partners', value: '120+' },
]

export const StatsSection = () => {
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
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: 'easeOut',
                  }}
                >
                  <div className="text-3xl font-semibold mb-1 tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-[#9CA3AF] uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
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
