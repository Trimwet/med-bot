import { useDarkMode } from '@/components/business/dark-mode-context'
import { CustomTooltip } from './chart-utils'

export function useChartTheme() {
  const { dark } = useDarkMode()
  return {
    grid: { stroke: dark ? '#1e2028' : '#E4E5EF', strokeDasharray: '3 3' },
    axis: { fontSize: 12, fill: dark ? '#6b7080' : '#6A6E85' },
    bar: dark ? '#00A8A8' : '#073B4C',
    barHover: dark ? '#00C4C4' : '#054A5E',
    areaStroke: dark ? '#00A8A8' : '#073B4C',
    gradientTop: dark ? '#00A8A8' : '#073B4C',
    dotFill: dark ? '#0f1117' : '#FFFFFF',
    dotStroke: dark ? '#00A8A8' : '#073B4C',
    activeDotFill: dark ? '#00A8A8' : '#073B4C',
    activeDotStroke: dark ? '#0f1117' : '#FFFFFF',
    cursor: dark ? '#ffffff10' : '#E4E5EF30',
  }
}

export { CustomTooltip }
