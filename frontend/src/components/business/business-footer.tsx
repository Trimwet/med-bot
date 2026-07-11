import { AlertCircle } from 'lucide-react'

export const BusinessFooter = () => {
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
                © 2024 MedBot Enterprise Solutions. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            System Status: Operational
          </span>
          <span>Version 4.2.0-stable</span>
        </div>
      </div>
    </footer>
  )
}
