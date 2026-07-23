import { InfoPage } from './info-page'
import { Target, Users, Globe, Heart, ArrowRight, CheckCircle2 } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Precision',
    description: 'Evidence-based algorithms that prioritize accuracy in every assessment.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Making quality triage available to hospitals of all sizes.',
  },
  {
    icon: Globe,
    title: 'Scalability',
    description: 'Built to handle thousands of concurrent assessments without compromising speed.',
  },
  {
    icon: Heart,
    title: 'Patient-Centered',
    description: 'Every feature designed with patient outcomes as the north star.',
  },
]

const stats = [
  { value: '120+', label: 'Hospitals' },
  { value: '50K+', label: 'Patients triaged' },
  { value: '40%', label: 'Wait time reduction' },
  { value: '99.9%', label: 'Uptime' },
]

export const AboutUsPage = () => (
  <InfoPage
    title="About MedBot"
    subtitle="We're on a mission to transform patient triage through artificial intelligence."
    badge="About Us"
  >
    {/* Mission statement */}
    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">Our Mission</h2>
      <p className="text-gray-600 leading-relaxed text-base">
        Emergency rooms are overwhelmed, and patients often wait too long to receive critical care.
        MedBot was founded to solve this problem. By leveraging artificial intelligence, we help
        hospitals prioritize patients based on severity and direct them to the right care pathway
        faster — reducing wait times, improving outcomes, and saving lives.
      </p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl md:text-3xl font-bold text-[#00A8A8] font-display">{stat.value}</p>
          <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Values */}
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Our Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {values.map((value) => {
          const Icon = value.icon
          return (
            <div
              key={value.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#00A8A8]/30 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-[#00A8A8]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#00A8A8]/20 transition-colors">
                <Icon className="w-5 h-5 text-[#00A8A8]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
            </div>
          )
        })}
      </div>
    </div>

    {/* Story */}
    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">Our Story</h2>
      <div className="space-y-4 text-gray-600 leading-relaxed text-base">
        <p>
          We started with a simple observation: the gap between a patient's arrival at the ER
          and receiving initial assessment is one of the most critical — and most variable —
          moments in healthcare.
        </p>
        <p>
          Traditional triage relies on overworked staff making rapid decisions under pressure.
          We built MedBot to assist them — not replace them — by providing a consistent, evidence-based
          first layer of assessment that works 24/7 without fatigue.
        </p>
        <p>
          Today, MedBot is used across 120+ hospitals, helping clinicians make faster, more informed
          decisions while improving the patient experience from the moment they seek care.
        </p>
      </div>
    </div>
  </InfoPage>
)
