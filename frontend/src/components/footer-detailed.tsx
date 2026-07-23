import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPublicStats, type PublicStats } from '@/lib/api'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'How It Works', href: '/how-it-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Clinical Protocols', href: '/clinical-protocols' },
      { label: 'API Reference', href: '/api' },
      { label: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'HIPAA Compliance', href: '/hipaa' },
      { label: 'Security', href: '/security' },
    ],
  },
]

export const DetailedFooter = ({ onRequestDemo }: { onRequestDemo?: () => void }) => {
  const [hospitalCount, setHospitalCount] = useState(120)

  useEffect(() => {
    getPublicStats()
      .then((data: PublicStats) => {
        if (data.hospitals) setHospitalCount(data.hospitals)
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="w-full bg-[#0A202A] text-white border-t border-white/5">
      {/* CTA */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
            Let's turn your intake line into a sorted queue.
          </h2>
          <p className="text-[#9CA3AF] mb-6 max-w-lg mx-auto text-sm">
            Join {hospitalCount}+ hospitals already using MedBot to triage patients faster and reduce wait times.
          </p>
          <button
            type="button"
            onClick={onRequestDemo}
            className="inline-flex items-center gap-2 bg-white text-[#0A202A] px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors font-display"
          >
            Request a Demo <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/assets/Logo.jpeg" alt="MedBot" className="h-8 w-auto rounded-md" />
              <span className="text-white font-bold text-lg font-display">MedBot</span>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              AI-powered patient triage for hospitals. Interview, sort, and hand off clinically grounded, always improving.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 md:gap-16">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">{group.title}</h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith('/#') ? (
                        <a href={link.href} className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.href} className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9CA3AF]/60">
            © 2026 MedBot Health. All rights reserved.
          </p>
          <p className="text-xs text-[#9CA3AF]/40">
            Not a substitute for emergency care
          </p>
        </div>
      </div>
    </footer>
  )
}
