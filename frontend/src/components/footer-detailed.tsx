import React from 'react'
import { ArrowRight } from 'lucide-react'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'How It Works', href: '#how' },
      { label: 'For Clinicians', href: '#clinicians' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Team', href: '#team' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press Kit', href: '#press' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#docs' },
      { label: 'Clinical Protocols', href: '#protocols' },
      { label: 'API Reference', href: '#api' },
      { label: 'Support', href: '#support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'HIPAA Compliance', href: '#hipaa' },
      { label: 'Security', href: '#security' },
    ],
  },
]

export const DetailedFooter = () => {
  return (
    <footer className="w-full bg-navy-deep text-on-navy border-t border-white/5">
      {/* CTA Banner */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Let's turn your intake line into a sorted queue.
          </h2>
          <p className="text-on-navy/60 mb-8 max-w-xl mx-auto">
            Join 120+ hospitals already using MedBot to triage patients faster and reduce wait times.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white text-navy px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors font-display"
          >
            Request a Demo <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-navy-deep font-extrabold text-sm">
                M
              </div>
              <span className="text-white font-bold text-lg font-display">MedBot</span>
            </div>
            <p className="text-sm text-on-navy/60 leading-relaxed mb-6 max-w-xs">
              AI-powered patient triage for hospitals. Interview, sort, and hand off — clinically grounded, always improving.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-xs text-on-navy/40">
                <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-on-navy/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-on-navy/40">
            <span>© 2026 MedBot Health. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span>Not a substitute for emergency care</span>
          </div>

          <form
            className="w-full max-w-sm relative"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email for updates"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-12 text-sm text-white placeholder:text-on-navy/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-navy-deep size-8 rounded-md flex items-center justify-center hover:bg-white/90 transition-colors"
            >
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}
