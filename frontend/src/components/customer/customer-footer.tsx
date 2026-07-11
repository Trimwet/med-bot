import { AlertCircle } from 'lucide-react'

export const CustomerFooter = () => {
  return (
    <footer className="border-t border-line bg-white px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <img src="/assets/Logo.jpeg" alt="" className="h-8 w-auto rounded-md mt-0.5" />
          <div>
            <p className="font-display font-bold text-ink text-sm">MedBot</p>
            <div className="flex items-start gap-1.5 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-muted mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted leading-relaxed max-w-md">
                MedBot provides health information, not medical advice or diagnosis.
                Professional clinical oversight required.
              </p>
            </div>
            <p className="text-xs text-muted/50 mt-2">
              &copy; 2026 MedBot Health. All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted">
          <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-ink transition-colors">Medical Disclaimer</a>
          <a href="#" className="hover:text-ink transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  )
}
