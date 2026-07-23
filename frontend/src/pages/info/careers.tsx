import { InfoPage } from './info-page'
import { Briefcase, MapPin, Clock, ArrowRight, ChevronRight } from 'lucide-react'

const openPositions: Array<{ title: string; department: string; location: string; type: string }> = [
  // TODO: Fetch job listings from API
]

const departments = [
  { name: 'Engineering', openings: '-' },
  { name: 'Product', openings: '-' },
  { name: 'Medical', openings: '-' },
  { name: 'Operations', openings: '-' },
]

const benefits = [
  'Competitive salary and equity',
  'Health and dental insurance',
  'Remote-friendly culture',
  'Learning & development budget',
  'Flexible working hours',
  'Annual team retreats',
]

export const CareersPage = () => (
  <InfoPage
    title="Careers at MedBot"
    subtitle="Help us build the future of patient triage. We're hiring across engineering, product, and medical teams."
    badge="Careers"
  >
    {/* Department counts */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {departments.map((dept) => (
        <div key={dept.name} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center hover:border-[#00A8A8]/30 transition-colors cursor-pointer">
          <p className="text-2xl font-bold text-[#00A8A8] font-display">{dept.openings}</p>
          <p className="text-sm text-gray-500 mt-1">{dept.name}</p>
        </div>
      ))}
    </div>

    {/* Benefits */}
    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Why MedBot?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#00A8A8]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <ChevronRight className="w-3.5 h-3.5 text-[#00A8A8]" />
            </div>
            <span className="text-gray-600 text-sm">{benefit}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Open Positions */}
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Open Positions</h2>
      <div className="space-y-3">
        {openPositions.length === 0 ? (
          <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No open positions right now</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon — we're always growing.</p>
          </div>
        ) : (
          openPositions.map((pos, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-[#00A8A8]/30 hover:shadow-md transition-all group cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[#00A8A8] transition-colors">{pos.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {pos.department}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {pos.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pos.type}</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#00A8A8] group-hover:translate-x-0.5 transition-all hidden sm:block" />
            </div>
          ))
        )}
      </div>
    </div>

    {/* CTA */}
    <div className="bg-gradient-to-r from-[#073B4C] to-[#0A202A] rounded-2xl p-8 md:p-10 text-center">
      <h2 className="text-xl font-bold text-white mb-2 font-display">Don't see a fit?</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Send us your resume anyway. We're always looking for exceptional people.
      </p>
      <a
        href="mailto:careers@medbot.com"
        className="inline-flex items-center gap-2 bg-[#00A8A8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#00A8A8]/90 transition-colors"
      >
        Send Your Resume <ArrowRight size={16} />
      </a>
    </div>
  </InfoPage>
)
