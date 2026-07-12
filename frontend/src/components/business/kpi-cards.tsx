import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCard {
  label: string
  value: string
  subtitle: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
}

interface KpiCardsProps {
  cards: KpiCard[]
}

function TrendBadge({ change, trend }: { change: string; trend: 'up' | 'down' }) {
  const isPositive = trend === 'up'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tabular-nums',
        isPositive
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
      )}
    >
      {change}
    </span>
  )
}

export function KpiCards({ cards }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={cn(
              'group relative rounded-xl p-6',
              'bg-white border border-gray-200',
              'dark:bg-[#111111] dark:border-white/[0.06]',
              'transition-colors duration-150',
              'hover:dark:border-white/[0.1]'
            )}
          >
            {/* Top row: icon + trend badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/[0.04]">
                <Icon className="h-4 w-4 text-gray-400 dark:text-[#6b7280]" strokeWidth={1.5} />
              </div>
              <TrendBadge change={card.change} trend={card.trend} />
            </div>

            {/* Value */}
            <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white tabular-nums">
              {card.value}
            </p>

            {/* Label + subtext */}
            <p className="mt-1.5 text-sm font-medium text-gray-600 dark:text-[#a1a1aa]">
              {card.label}
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-[#52525b]">
              {card.subtitle}
            </p>
          </div>
        )
      })}
    </div>
  )
}
