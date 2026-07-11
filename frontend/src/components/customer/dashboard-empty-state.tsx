import { Activity, Pill, FlaskConical, ClipboardList } from 'lucide-react'

const capabilities = [
  {
    icon: Activity,
    title: 'Analyze Symptoms',
    description: 'Describe what you\u2019re feeling and get guided next steps.',
    color: 'text-teal',
    bg: 'bg-teal/10',
  },
  {
    icon: Pill,
    title: 'Check Medications',
    description: 'Review drug interactions and medication guidance.',
    color: 'text-navy',
    bg: 'bg-navy/10',
  },
  {
    icon: FlaskConical,
    title: 'Understand Lab Results',
    description: 'Upload or describe lab values for clear explanations.',
    color: 'text-green',
    bg: 'bg-green/10',
  },
  {
    icon: ClipboardList,
    title: 'Prepare for a Visit',
    description: 'Generate questions and a summary for your doctor.',
    color: 'text-navy-mid',
    bg: 'bg-navy-mid/10',
  },
]

interface DashboardEmptyStateProps {
  onSelectCapability: (title: string) => void
}

export const DashboardEmptyState = ({ onSelectCapability }: DashboardEmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* Greeting */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-navy/5 flex items-center justify-center mx-auto mb-5">
          <img src="/assets/Logo.jpeg" alt="" className="w-10 h-10 rounded-xl" />
        </div>
        <h1 className="text-3xl font-display font-bold text-ink mb-2">
          Hello, JD
        </h1>
        <p className="text-muted text-base max-w-md mx-auto">
          How can I help you today? Choose a capability below or type your question.
        </p>
      </div>

      {/* Capability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {capabilities.map((cap) => (
          <button
            key={cap.title}
            onClick={() => onSelectCapability(cap.title)}
            className="group flex items-start gap-4 p-5 bg-white border border-line rounded-2xl text-left hover:border-teal/30 hover:shadow-md hover:shadow-teal/5 transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-xl ${cap.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <cap.icon className={`w-5 h-5 ${cap.color}`} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-ink mb-1 group-hover:text-teal transition-colors">
                {cap.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {cap.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Trust Footer */}
      <p className="text-[11px] text-muted/50 mt-8 text-center max-w-sm">
        MedBot provides health information only. Always consult a qualified healthcare professional for medical advice.
      </p>
    </div>
  )
}
