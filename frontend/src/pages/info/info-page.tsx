import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface InfoPageProps {
  title: string
  subtitle?: string
  badge?: string
  children: React.ReactNode
}

export const InfoPage = ({ title, subtitle, badge, children }: InfoPageProps) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <div className="relative bg-[#0A202A] overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        {/* Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#00A8A8]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#00A8A8]/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 pt-8 pb-16 md:pt-12 md:pb-20">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>

          {/* Title area */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {badge && (
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#00A8A8] bg-[#00A8A8]/10 px-3 py-1 rounded-full mb-4">
                  {badge}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-display leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/50 mt-3 text-base md:text-lg max-w-xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-16 relative z-10">
        {children}
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2026 MedBot Health. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Not a substitute for emergency care
          </p>
        </div>
      </footer>
    </div>
  )
}
