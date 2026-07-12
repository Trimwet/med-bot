import { cn } from "@/lib/utils"

export const chartDefaults = {
  gridColor: "#E4E5EF",
  gridColorDark: "#1e2028",
  textColor: "#6A6E85",
  textColorDark: "#6b7080",
  tooltipBg: "#FFFFFF",
  tooltipBgDark: "#0f1117",
  tooltipBorder: "#E4E5EF",
  tooltipBorderDark: "#1e2028",
  fontFamily: "'Inter', sans-serif",
}

export function getChartColors() {
  if (typeof document === "undefined") return chartDefaults
  const isDark = document.documentElement.classList.contains("dark")
  return {
    grid: isDark ? chartDefaults.gridColorDark : chartDefaults.gridColor,
    text: isDark ? chartDefaults.textColorDark : chartDefaults.textColor,
    tooltipBg: isDark ? chartDefaults.tooltipBgDark : chartDefaults.tooltipBg,
    tooltipBorder: isDark ? chartDefaults.tooltipBorderDark : chartDefaults.tooltipBorder,
  }
}

export const chartUtils = {
  toPercent(decimal: number, fixed = 0) {
    return `${(decimal * 100).toFixed(fixed)}%`
  },
  formatValue(value: number, prefix = "") {
    if (value >= 1000) {
      return `${prefix}${(value / 1000).toFixed(1)}k`
    }
    return `${prefix}${value}`
  },
}

interface TickProps {
  x: number
  y: number
  payload: { value: string }
}

export function renderAxisTick({ x, y, payload }: TickProps) {
  return (
    <text
      x={x}
      y={y + 4}
      textAnchor="middle"
      fill="currentColor"
      className="text-xs text-gray-400 dark:text-[#525666]"
    >
      {payload.value}
    </text>
  )
}

export function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className={cn(
      "rounded-lg border bg-white dark:bg-[#0f1117] border-gray-200 dark:border-[#1e2028] px-3 py-2 shadow-sm",
      "text-sm"
    )}>
      <p className="font-medium text-gray-900 dark:text-[#e8eaed] mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-gray-600 dark:text-[#a0a4ad]">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.name}: <span className="font-medium text-gray-900 dark:text-[#e8eaed]">{entry.value}</span></span>
        </div>
      ))}
    </div>
  )
}
