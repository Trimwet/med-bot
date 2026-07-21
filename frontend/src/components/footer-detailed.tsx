import { ArrowRight } from 'lucide-react'

export const DetailedFooter = () => {
  return (
    <footer className="w-full bg-[#0A202A] text-white border-t border-white/5">
      {/* CTA */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
            Let's turn your intake line into a sorted queue.
          </h2>
          <p className="text-[#9CA3AF] mb-6 max-w-lg mx-auto text-sm">
            Join 120+ hospitals already using MedBot to triage patients faster and reduce wait times.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white text-[#0A202A] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors font-display"
          >
            Request a Demo <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto" />
              <span className="text-white font-bold text-lg font-display">MedBot</span>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              AI-powered patient triage for hospitals. Interview, sort, and hand off clinically grounded, always improving.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 md:gap-16">
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-2.5">
                <li><a href="#privacy" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#security" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
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
