import { InfoPage } from './info-page'
import { ExternalLink, AtSign, Mail, ArrowRight } from 'lucide-react'

const team = [
  // TODO: Fetch team members from API
]

const placeholders = [
  { name: 'Team Member', role: 'Role', department: 'Department' },
  { name: 'Team Member', role: 'Role', department: 'Department' },
  { name: 'Team Member', role: 'Role', department: 'Department' },
  { name: 'Team Member', role: 'Role', department: 'Department' },
]

const departments = [
  { name: 'Engineering', count: '-' },
  { name: 'Medical', count: '-' },
  { name: 'Design', count: '-' },
  { name: 'Operations', count: '-' },
]

export const OurTeamPage = () => (
  <InfoPage
    title="Our Team"
    subtitle="Meet the healthcare professionals, engineers, and researchers building the future of triage."
    badge="Our Team"
  >
    {/* Departments */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {departments.map((dept) => (
        <div key={dept.name} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-[#00A8A8] font-display">{dept.count}</p>
          <p className="text-sm text-gray-500 mt-1">{dept.name}</p>
        </div>
      ))}
    </div>

    {/* Team Grid */}
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Leadership</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {placeholders.map((member, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
          >
            {/* Avatar placeholder */}
            <div className="h-40 bg-gradient-to-br from-[#073B4C] to-[#00A8A8]/80 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white font-display">
                  {member.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-[#00A8A8] font-medium mt-0.5">{member.role}</p>
              <p className="text-xs text-gray-400 mt-1">{member.department}</p>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                <button className="text-gray-400 hover:text-[#00A8A8] transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-[#00A8A8] transition-colors">
                  <AtSign className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-[#00A8A8] transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Join CTA */}
    <div className="bg-gradient-to-r from-[#073B4C] to-[#0A202A] rounded-2xl p-8 md:p-10 text-center">
      <h2 className="text-xl font-bold text-white mb-2 font-display">Join Our Team</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        We're always looking for talented people who are passionate about healthcare and technology.
      </p>
      <a
        href="/careers"
        className="inline-flex items-center gap-2 bg-[#00A8A8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#00A8A8]/90 transition-colors"
      >
        View Open Positions <ArrowRight size={16} />
      </a>
    </div>
  </InfoPage>
)
