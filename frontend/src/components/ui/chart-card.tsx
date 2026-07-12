import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, action, children, className }: ChartCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5",
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  )
}
