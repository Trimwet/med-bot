import { AlertCircle } from 'lucide-react'

export const CustomerFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto mt-0.5" />
          <div>
            <p className="font-bold text-gray-900 text-sm">MedBot</p>
            <div className="flex items-start gap-1.5 mt-1">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                MedBot provides health information, not medical advice or diagnosis.
                Professional clinical oversight required.
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              © 2024 MedBot AI. For emergency use only.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Medical Disclaimer</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  )
}
