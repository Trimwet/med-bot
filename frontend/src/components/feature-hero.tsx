import { MessageSquare, Activity, ClipboardList, Brain, Shield } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: MessageSquare,
    title: 'Symptom Triage',
    desc: 'Guided chat or voice conversation asks the right clinical questions, every time',
  },
  {
    icon: Activity,
    title: 'Urgency Scoring',
    desc: 'Sorts patients by acuity level so your team knows who needs attention first',
    highlight: true,
  },
  {
    icon: ClipboardList,
    title: 'Clinical Handoff',
    desc: 'Every conversation lands in your queue as a summary, an acuity tag, and actionable flags',
  },
  {
    icon: Brain,
    title: 'Evidence-Based Logic',
    desc: 'Built with clinical protocols and always improving from real-world outcomes',
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    desc: 'Privacy-first architecture with end-to-end encryption and audit trails',
  },
]

export const FeatureHero = () => {
  return (
    <section className="py-24 px-6 relative min-h-screen overflow-hidden bg-[#0A202A]">
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,#073B4C_0%,#0A202A_100%)]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-[#0A202A] pointer-events-none"></div>

      <div className="py-24 px-6 max-w-7xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="will-change-transform"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 text-balance">
            Turn intake into a <br /> sorted queue
          </h1>
          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto mb-20 text-pretty">
            MedBot interviews patients by chat or phone, sorts them by clinical
            urgency, and hands your team a ready queue — not another inbox to sift through.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.slice(0, 3).map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}

          <div className="md:col-span-3 flex flex-col md:flex-row justify-center gap-6">
            {features.slice(3).map((f, i) => (
              <div key={i} className="md:w-1/3">
                <FeatureCard {...f} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const FeatureCard = ({ icon: Icon, title, desc, highlight }: any) => (
  <div
    className={cn(
      'relative flex flex-col items-start text-left p-6 rounded-xl transition-all duration-300 group overflow-hidden',
      'bg-[rgba(255,255,255,0.04)] backdrop-blur-md',
      'border border-[rgba(255,255,255,0.06)]',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.04)]',
      'hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]',
      highlight && 'md:scale-105 bg-teal/10 border-teal/30 shadow-xl shadow-black/30'
    )}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
      <div className="absolute -inset-20 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
    </div>
    <div
      className={cn(
        'relative z-10 size-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300',
        highlight
          ? 'bg-teal text-white shadow-lg shadow-teal/20'
          : 'bg-white/8 text-on-navy group-hover:bg-teal/20 group-hover:text-teal'
      )}
    >
      <Icon className="size-6" />
    </div>
    <h3 className="relative z-10 text-xl font-bold mb-2 text-white tracking-tight">
      {title}
    </h3>
    <p className="relative z-10 text-[#9CA3AF] leading-relaxed text-sm text-pretty group-hover:text-white/80 transition-colors duration-300">
      {desc}
    </p>
  </div>
)
