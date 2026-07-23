import { InfoPage } from './info-page'
import { BookOpen, Code2, ShieldCheck, Lightbulb, ArrowRight, ExternalLink } from 'lucide-react'

const sections = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Quick start guide for new users. Set up your account and run your first triage in minutes.',
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'hover:border-blue-200',
  },
  {
    icon: Code2,
    title: 'Integration Guide',
    description: 'How to integrate MedBot into your existing EHR and hospital management systems.',
    color: 'bg-emerald-50 text-emerald-600',
    borderColor: 'hover:border-emerald-200',
  },
  {
    icon: ShieldCheck,
    title: 'Triage Protocols',
    description: 'Understand our AI triage algorithms, urgency levels, and clinical decision logic.',
    color: 'bg-violet-50 text-violet-600',
    borderColor: 'hover:border-violet-200',
  },
  {
    icon: Lightbulb,
    title: 'Best Practices',
    description: 'Tips for optimizing configuration, staff training, and maximizing the value of MedBot.',
    color: 'bg-amber-50 text-amber-600',
    borderColor: 'hover:border-amber-200',
  },
]

const quickLinks = [
  { label: 'API Reference', href: '/api' },
  { label: 'Clinical Protocols', href: '/clinical-protocols' },
  { label: 'Security', href: '/security' },
  { label: 'HIPAA Compliance', href: '/hipaa' },
]

export const DocumentationPage = () => (
  <InfoPage
    title="Documentation"
    subtitle="Everything you need to integrate, configure, and get the most out of MedBot."
    badge="Documentation"
  >
    {/* Main sections */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
      {sections.map((section) => {
        const Icon = section.icon
        return (
          <div
            key={section.title}
            className={`bg-white rounded-2xl p-7 shadow-sm border border-gray-100 ${section.borderColor} hover:shadow-md transition-all group cursor-pointer`}
          >
            <div className={`w-11 h-11 ${section.color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#00A8A8] transition-colors">{section.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{section.description}</p>
          </div>
        )
      })}
    </div>

    {/* Quick Links */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-4 font-display">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <span className="text-sm text-gray-700 group-hover:text-[#00A8A8] transition-colors">{link.label}</span>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#00A8A8] group-hover:translate-x-0.5 transition-all" />
          </a>
        ))}
      </div>
    </div>

    {/* Code Example */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
      <div className="px-7 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 font-display">Quick Start</h2>
        <span className="text-xs font-mono text-gray-400">bash</span>
      </div>
      <div className="bg-[#0A202A] p-6 font-mono text-sm leading-relaxed overflow-x-auto">
        <p className="text-gray-500"># Install the MedBot SDK</p>
        <p className="text-[#00A8A8]">npm install @medbot/sdk</p>
        <p className="mt-4 text-gray-500"># Initialize the client</p>
        <p className="text-white">import {'{ MedBot }'} from '@medbot/sdk'</p>
        <p className="text-white">const bot = new MedBot({'{'} apiKey: 'YOUR_API_KEY' {'}'})</p>
        <p className="mt-4 text-gray-500"># Run a triage assessment</p>
        <p className="text-white">const result = await bot.assess({'{'} patientId, symptoms {'}'})</p>
      </div>
    </div>

    {/* Support CTA */}
    <div className="bg-gradient-to-r from-[#073B4C] to-[#0A202A] rounded-2xl p-8 md:p-10 text-center">
      <h2 className="text-xl font-bold text-white mb-2 font-display">Need help?</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Our support team is available to help you with integration and configuration.
      </p>
      <a
        href="/support"
        className="inline-flex items-center gap-2 bg-[#00A8A8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#00A8A8]/90 transition-colors"
      >
        Contact Support <ArrowRight size={16} />
      </a>
    </div>
  </InfoPage>
)
