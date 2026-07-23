import { InfoPage } from './info-page'
import { Shield, AlertTriangle, Clock, CheckCircle2, ArrowRight } from 'lucide-react'

const protocols = [
  {
    title: 'Triage Assessment Protocol',
    description: 'Standardized methodology for evaluating patient symptoms and determining urgency levels based on severity, risk factors, and clinical indicators.',
    icon: Shield,
    color: 'bg-blue-50 text-blue-600',
    items: ['Symptom analysis', 'Risk factor evaluation', 'Urgency classification', 'Care pathway routing'],
  },
  {
    title: 'Emergency Classification',
    description: 'Framework for identifying and categorizing emergency cases requiring immediate clinical attention or ambulance dispatch.',
    icon: AlertTriangle,
    color: 'bg-red-50 text-red-600',
    items: ['Life-threatening detection', 'Ambulance prioritization', 'ER readiness alerts', 'Real-time escalation'],
  },
  {
    title: 'Follow-up Guidelines',
    description: 'Protocols for post-assessment follow-up, patient monitoring recommendations, and ongoing care coordination.',
    icon: Clock,
    color: 'bg-amber-50 text-amber-600',
    items: ['Post-assessment check-ins', 'Symptom tracking', 'Care adherence monitoring', 'Outcome reporting'],
  },
  {
    title: 'Continuous Improvement',
    description: 'How our protocols are regularly reviewed and updated based on clinical outcomes data and latest research.',
    icon: CheckCircle2,
    color: 'bg-emerald-50 text-emerald-600',
    items: ['Outcome data analysis', 'Clinical review board', 'Protocol versioning', 'Evidence-based updates'],
  },
]

export const ClinicalProtocolsPage = () => (
  <InfoPage
    title="Clinical Protocols"
    subtitle="Evidence-based protocols powering our AI triage system, continuously updated with the latest medical research."
    badge="Clinical"
  >
    {/* Protocol cards */}
    <div className="space-y-5 mb-10">
      {protocols.map((protocol) => {
        const Icon = protocol.icon
        return (
          <div
            key={protocol.title}
            className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-5">
              <div className={`w-12 h-12 ${protocol.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{protocol.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{protocol.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {protocol.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A8A8] flex-shrink-0" />
                      <span className="text-xs text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>

    {/* Urgency Levels */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-6 font-display">Urgency Levels</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { level: 'Urgent', color: 'bg-red-500', desc: 'Immediate care required', bg: 'bg-red-50' },
          { level: 'Semi-Urgent', color: 'bg-amber-500', desc: 'Within 1 hour', bg: 'bg-amber-50' },
          { level: 'Non-Urgent', color: 'bg-emerald-500', desc: 'Within 24 hours', bg: 'bg-emerald-50' },
          { level: 'Emergency', color: 'bg-red-700', desc: 'Call ambulance', bg: 'bg-red-100' },
        ].map((item) => (
          <div key={item.level} className={`${item.bg} rounded-xl p-4 text-center`}>
            <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-2`} />
            <p className="font-semibold text-gray-900 text-sm">{item.level}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="bg-gradient-to-r from-[#073B4C] to-[#0A202A] rounded-2xl p-8 md:p-10 text-center">
      <h2 className="text-xl font-bold text-white mb-2 font-display">Custom protocols?</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        We can tailor triage protocols to match your hospital's specific workflows and guidelines.
      </p>
      <a
        href="/support"
        className="inline-flex items-center gap-2 bg-[#00A8A8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#00A8A8]/90 transition-colors"
      >
        Contact Us <ArrowRight size={16} />
      </a>
    </div>
  </InfoPage>
)
