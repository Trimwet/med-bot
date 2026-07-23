import { InfoPage } from './info-page'
import { FileText, Scale, AlertTriangle, Shield, UserX, RefreshCw } from 'lucide-react'

const sections = [
  {
    icon: FileText,
    title: 'Acceptance of Terms',
    content: 'By accessing or using MedBot, you agree to be bound by these Terms of Service. If you do not agree to all terms, do not use our services. We reserve the right to modify these terms at any time.',
  },
  {
    icon: Scale,
    title: 'Use of Services',
    content: 'MedBot is designed to assist healthcare professionals in patient triage. It is not a substitute for professional medical judgment. All clinical decisions remain the responsibility of qualified healthcare providers.',
  },
  {
    icon: Shield,
    title: 'User Responsibilities',
    content: 'Users are responsible for maintaining the confidentiality of their accounts, for all activities under their accounts, and for ensuring their use complies with applicable laws and regulations.',
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: 'MedBot shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability shall not exceed the amount paid by you in the twelve months preceding the claim.',
  },
  {
    icon: UserX,
    title: 'Termination',
    content: 'We may terminate or suspend your access to our services at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users or the business.',
  },
  {
    icon: RefreshCw,
    title: 'Modifications',
    content: 'We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of material changes via email.',
  },
]

export const TermsOfServicePage = () => (
  <InfoPage
    title="Terms of Service"
    subtitle="Please read these terms carefully before using MedBot."
    badge="Legal"
  >
    <div className="space-y-5 mb-10">
      {sections.map((section) => {
        const Icon = section.icon
        return (
          <div key={section.title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#00A8A8]/10 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#00A8A8]" />
              </div>
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed ml-[52px]">{section.content}</p>
          </div>
        )
      })}
    </div>

    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-2">Questions?</h3>
      <p className="text-sm text-gray-500">
        Contact us at <span className="text-[#00A8A8] font-medium">legal@medbot.com</span>
      </p>
    </div>
  </InfoPage>
)
