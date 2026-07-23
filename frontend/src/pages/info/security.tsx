import { InfoPage } from './info-page'
import { ShieldCheck, Lock, Eye, Server, Key, Activity } from 'lucide-react'

const features = [
  {
    icon: Lock,
    title: 'Encryption',
    desc: 'AES-256 at rest, TLS 1.3 in transit. Your data is encrypted end-to-end.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Key,
    title: 'Access Controls',
    desc: 'Role-based access control (RBAC) with optional multi-factor authentication.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Server,
    title: 'Infrastructure',
    desc: 'Hosted on SOC 2 compliant cloud providers with regular penetration testing.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Activity,
    title: 'Monitoring',
    desc: '24/7 system monitoring for threats and anomalies with automated alerting.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Eye,
    title: 'Audit Logging',
    desc: 'Complete audit trail of all data access and modifications for compliance.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: ShieldCheck,
    title: 'Penetration Testing',
    desc: 'Regular third-party security assessments and vulnerability scanning.',
    color: 'bg-cyan-50 text-cyan-600',
  },
]

export const SecurityPage = () => (
  <InfoPage
    title="Security"
    subtitle="Enterprise-grade security to protect your data and your patients."
    badge="Security"
  >
    {/* Security overview */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#00A8A8]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-6 h-6 text-[#00A8A8]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 font-display">Our Approach</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Security is foundational to everything we build. We follow defense-in-depth principles,
            layering multiple controls to protect patient data at every level — from the application
            layer down to physical infrastructure.
          </p>
        </div>
      </div>
    </div>

    {/* Features grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      {features.map((feature) => {
        const Icon = feature.icon
        return (
          <div
            key={feature.title}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
          >
            <div className={`w-11 h-11 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
          </div>
        )
      })}
    </div>

    {/* Compliance badges */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-6 font-display">Certifications & Compliance</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['SOC 2 Type II', 'HIPAA', 'GDPR', 'ISO 27001'].map((cert) => (
          <div key={cert} className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="font-semibold text-gray-900 text-sm">{cert}</p>
            <p className="text-xs text-gray-400 mt-1">Compliant</p>
          </div>
        ))}
      </div>
    </div>

    {/* Report */}
    <div className="bg-gradient-to-r from-[#073B4C] to-[#0A202A] rounded-2xl p-8 md:p-10 text-center">
      <h2 className="text-xl font-bold text-white mb-2 font-display">Report a vulnerability</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Found a security issue? We take reports seriously and respond within 24 hours.
      </p>
      <a
        href="mailto:security@medbot.com"
        className="inline-flex items-center gap-2 bg-[#00A8A8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#00A8A8]/90 transition-colors"
      >
        Report to security@medbot.com
      </a>
    </div>
  </InfoPage>
)
