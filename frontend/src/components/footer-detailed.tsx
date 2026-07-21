export const DetailedFooter = () => {
  return (
    <footer className="w-full bg-[#0A202A] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto" />
              <span className="text-white font-bold text-lg font-display">MedBot</span>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              AI-powered patient triage for hospitals. Interview, sort, and hand off — clinically grounded, always improving.
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
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2.5">
                <li><a href="#about" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Careers</a></li>
                <li><a href="#contact" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">Contact</a></li>
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
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
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
