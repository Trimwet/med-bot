import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface InfoPageProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export const InfoPage = ({ title, subtitle, children }: InfoPageProps) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 font-display">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {children}
      </div>
    </div>
  )
}
