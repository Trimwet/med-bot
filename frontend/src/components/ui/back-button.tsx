import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  label?: string
  onClick: () => void
}

export function BackButton({ label = 'Back', onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  )
}
