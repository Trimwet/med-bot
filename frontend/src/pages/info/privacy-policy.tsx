import { InfoPage } from './info-page'
import { Shield, Eye, Lock, Database, UserCheck, AlertCircle } from 'lucide-react'

const sections = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: [
      'Account details you provide during registration (name, email, role)',
      'Health-related data entered during patient assessments',
      'Usage analytics to improve our services and performance',
      'Device and browser information for security purposes',
    ],
  },
  {
    icon: Database,
    title: 'How We Use Your Information',
    content: [
      'Provide and improve our triage services',
      'Generate health reports and analytics',
      'Ensure compliance with healthcare regulations',
      'Communicate service updates and support responses',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'AES-256 encryption for data at rest',
      'TLS 1.3 encryption for data in transit',
      'SOC 2 compliant infrastructure',
      'Regular third-party security audits',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      'Access and download your personal data',
      'Request correction of inaccurate data',
      'Request deletion of your account and data',
      'Opt out of non-essential data collection',
    ],
  },
]

export const PrivacyPolicyPage = () => (
  <InfoPage
    title="Privacy Policy"
    subtitle="Your privacy matters. Learn how we collect, use, and protect your data."
    badge="Legal"
  >
    {/* Effective date */}
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
      <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-gray-500" />
      </div>
      <div>
        <p className="text-sm text-gray-600">Effective Date: <span className="font-semibold">January 1, 2026</span></p>
        <p className="text-xs text-gray-400 mt-0.5">Last updated: January 1, 2026</p>
      </div>
    </div>

    {/* Sections */}
    <div className="space-y-5 mb-10">
      {sections.map((section) => {
        const Icon = section.icon
        return (
          <div key={section.title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#00A8A8]/10 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#00A8A8]" />
              </div>
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
            </div>
            <ul className="space-y-2.5 ml-13">
              {section.content.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-[#00A8A8] rounded-full mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>

    {/* Contact */}
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 mb-10">
      <h3 className="font-semibold text-gray-900 mb-2">Questions about this policy?</h3>
      <p className="text-sm text-gray-500">
        Contact our Data Protection Officer at <span className="text-[#00A8A8] font-medium">privacy@medbot.com</span>
      </p>
    </div>
  </InfoPage>
)
