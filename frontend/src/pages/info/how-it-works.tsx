import { InfoPage } from './info-page'
import { MessageSquare, Activity, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Patient Interview',
    description: 'The patient describes their symptoms in a conversational format. MedBot asks targeted follow-up questions to gather relevant clinical information — just like a triage nurse would on the phone.',
    details: [
      'Natural language symptom input',
      'Intelligent follow-up questions',
      'Medical history context',
      'Multi-language support',
    ],
  },
  {
    icon: Activity,
    number: '02',
    title: 'AI Triage Assessment',
    description: 'MedBot analyzes the responses against clinical protocols and assigns an urgency level. The assessment is backed by evidence-based guidelines and improves over time with each interaction.',
    details: [
      'Evidence-based urgency levels',
      'Clinical protocol matching',
      'Risk factor analysis',
      'Continuous model improvement',
    ],
  },
  {
    icon: Stethoscope,
    number: '03',
    title: 'Handoff to Care',
    description: 'The triage result is sent to the hospital dashboard in real time. Staff review the assessment, prioritize based on urgency, and direct the patient to the appropriate care pathway.',
    details: [
      'Real-time dashboard updates',
      'Urgency-based prioritization',
      'Care pathway routing',
      'Staff notification system',
    ],
  },
]

const outcomes = [
  { value: '40%', label: 'Faster triage' },
  { value: '24/7', label: 'Availability' },
  { value: '95%', label: 'Accuracy rate' },
  { value: '60s', label: 'Avg. assessment' },
]

export const HowItWorksPage = () => (
  <InfoPage
    title="How It Works"
    subtitle="From patient symptoms to care pathway in three simple steps."
    badge="How It Works"
  >
    {/* Outcomes */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {outcomes.map((item) => (
        <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl md:text-3xl font-bold text-[#00A8A8] font-display">{item.value}</p>
          <p className="text-sm text-gray-500 mt-1">{item.label}</p>
        </div>
      ))}
    </div>

    {/* Steps */}
    <div className="space-y-6 mb-10">
      {steps.map((step, i) => {
        const Icon = step.icon
        return (
          <div key={step.number} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            {/* Step number */}
            <span className="absolute top-6 right-6 text-6xl font-bold text-gray-100 font-display select-none">
              {step.number}
            </span>

            <div className="relative">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#073B4C] to-[#00A8A8] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{step.description}</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {step.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00A8A8] flex-shrink-0" />
                        <span className="text-sm text-gray-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="absolute bottom-0 left-14 w-px h-6 bg-gradient-to-b from-gray-200 to-transparent translate-y-full" />
            )}
          </div>
        )
      })}
    </div>

    {/* CTA */}
    <div className="bg-gradient-to-r from-[#073B4C] to-[#0A202A] rounded-2xl p-8 md:p-10 text-center">
      <h2 className="text-xl font-bold text-white mb-2 font-display">See it in action</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Experience a live triage assessment and see how MedBot transforms patient intake.
      </p>
      <a
        href="/support"
        className="inline-flex items-center gap-2 bg-[#00A8A8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#00A8A8]/90 transition-colors"
      >
        Request a Demo <ArrowRight size={16} />
      </a>
    </div>
  </InfoPage>
)
