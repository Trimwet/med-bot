import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, action, children, className }: ChartCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5",
      className
    )}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  )
}
