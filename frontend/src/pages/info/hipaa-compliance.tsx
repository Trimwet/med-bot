import { InfoPage } from './info-page'
import { ShieldCheck, FileCheck, Users, AlertOctagon, Lock, Server } from 'lucide-react'

const safeguards = [
  {
    icon: Lock,
    title: 'Technical Safeguards',
    items: ['AES-256 encryption at rest', 'TLS 1.3 in transit', 'Multi-factor authentication', 'Role-based access controls'],
  },
  {
    icon: Users,
    title: 'Administrative Safeguards',
    items: ['Privacy officer designated', 'Staff HIPAA training', 'Incident response procedures', 'Regular risk assessments'],
  },
  {
    icon: Server,
    title: 'Physical Safeguards',
    items: ['SOC 2 compliant hosting', 'Data center access controls', 'Device management policies', 'Secure disposal procedures'],
  },
]

export const HipaaCompliancePage = () => (
  <InfoPage
    title="HIPAA Compliance"
    subtitle="MedBot is committed to protecting patient health information in accordance with HIPAA regulations."
    badge="Compliance"
  >
    {/* Overview */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#00A8A8]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-6 h-6 text-[#00A8A8]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 font-display">Our Commitment</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            MedBot implements administrative, physical, and technical safeguards to ensure the
            confidentiality, integrity, and availability of protected health information (PHI).
            We maintain compliance with the Health Insurance Portability and Accountability Act
            and its implementing regulations.
          </p>
        </div>
      </div>
    </div>

    {/* Safeguards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
      {safeguards.map((sg) => {
        const Icon = sg.icon
        return (
          <div key={sg.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-11 h-11 bg-[#00A8A8]/10 rounded-xl flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-[#00A8A8]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-3">{sg.title}</h3>
            <ul className="space-y-2">
              {sg.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-[#00A8A8] rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>

    {/* BAA & Breach */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
      <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Business Associate Agreements</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed ml-[52px]">
          We maintain BAAs with all partners who handle PHI on our behalf, ensuring they meet
          the same rigorous standards we hold ourselves to.
        </p>
      </div>
      <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <AlertOctagon className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Breach Notification</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed ml-[52px]">
          In the event of a breach of unsecured PHI, we notify affected individuals and HHS
          as required by law within 60 days of discovery.
        </p>
      </div>
    </div>
  </InfoPage>
)
