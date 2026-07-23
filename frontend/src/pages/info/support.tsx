import { InfoPage } from './info-page'
import { Mail, Phone, MessageSquare, BookOpen, Clock, ArrowRight } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    detail: 'support@medbot.com',
    sub: 'Response within 24 hours',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    detail: '+234 800 123 4567',
    sub: 'Mon–Fri, 9am–6pm WAT',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    detail: 'Available in-app',
    sub: 'Instant response during business hours',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: BookOpen,
    title: 'Help Center',
    detail: 'Browse FAQs & guides',
    sub: 'Self-service resources',
    color: 'bg-amber-50 text-amber-600',
  },
]

const faqs = [
  {
    q: 'How do I reset my password?',
    a: 'Go to the login page and click "Forgot Password". You\'ll receive a reset link via email.',
  },
  {
    q: 'How do I add staff members?',
    a: 'Navigate to Business Dashboard → Staff Management → Add Staff Member.',
  },
  {
    q: 'Is MedBot HIPAA compliant?',
    a: 'Yes. MedBot follows strict HIPAA guidelines. See our HIPAA Compliance page for details.',
  },
  {
    q: 'How do I integrate the API?',
    a: 'Check our API Reference and Documentation pages for step-by-step integration guides.',
  },
]

export const SupportPage = () => (
  <InfoPage
    title="Support"
    subtitle="We're here to help. Reach out through any of the channels below."
    badge="Support"
  >
    {/* Contact cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
      {contactMethods.map((method) => {
        const Icon = method.icon
        return (
          <div
            key={method.title}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className={`w-11 h-11 ${method.color} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
            <p className="text-sm text-[#00A8A8] font-medium">{method.detail}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Clock className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400">{method.sub}</p>
            </div>
          </div>
        )
      })}
    </div>

    {/* FAQs */}
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="bg-gradient-to-r from-[#073B4C] to-[#0A202A] rounded-2xl p-8 md:p-10 text-center">
      <h2 className="text-xl font-bold text-white mb-2 font-display">Still need help?</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Our team typically responds within a few hours during business days.
      </p>
      <a
        href="mailto:support@medbot.com"
        className="inline-flex items-center gap-2 bg-[#00A8A8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#00A8A8]/90 transition-colors"
      >
        Email Support <ArrowRight size={16} />
      </a>
    </div>
  </InfoPage>
)
