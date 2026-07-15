import { useState, useEffect, useRef } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const datePresets = [
  { label: 'Today', start: new Date(2026, 4, 20), end: new Date(2026, 4, 20) },
  { label: 'Last 7 Days', start: new Date(2026, 4, 14), end: new Date(2026, 4, 20) },
  { label: 'This Month', start: new Date(2026, 4, 1), end: new Date(2026, 4, 20) },
  { label: 'Last Month', start: new Date(2026, 3, 1), end: new Date(2026, 3, 30) },
  { label: 'Last 30 Days', start: new Date(2026, 3, 21), end: new Date(2026, 4, 20) },
]

interface DateDropdownProps {
  value?: { start: Date; end: Date }
  onChange?: (range: { start: Date; end: Date }) => void
  className?: string
}

const formatDate = (d: Date) => `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`

export const DateDropdown = ({ value, onChange, className }: DateDropdownProps) => {
  const [range, setRange] = useState(value || { start: new Date(2026, 4, 1), end: new Date(2026, 4, 20) })
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const select = (preset: typeof datePresets[number]) => {
    setRange({ start: preset.start, end: preset.end })
    onChange?.({ start: preset.start, end: preset.end })
    setOpen(false)
  }

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-[#1e2028] bg-white dark:bg-[#0f1117] px-3 py-2 text-xs font-medium text-gray-600 dark:text-[#6b7080] transition-colors hover:border-gray-300 dark:hover:border-[#2a2d35]"
      >
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(range.start)} - {formatDate(range.end)}, {range.end.getFullYear()} ▾
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-gray-200 dark:border-[#1e2028] bg-white dark:bg-[#0f1117] shadow-lg z-50 overflow-hidden">
          <div className="p-2 space-y-0.5">
            {datePresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => select(preset)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  range.start.getTime() === preset.start.getTime() && range.end.getTime() === preset.end.getTime()
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-600 dark:text-[#a1a1aa] hover:bg-gray-100 dark:hover:bg-[#1a1d25]'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
