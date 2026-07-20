import { cn } from '@/lib/utils'

interface BrowserMockupProps {
  children: React.ReactNode
  className?: string
  url?: string
  fade?: boolean
}

export function BrowserMockup({ children, className, url, fade }: BrowserMockupProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden border border-ink/10 bg-white shadow-2xl shadow-ink/10',
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 h-10 bg-ink/[0.03] border-b border-ink/[0.06]">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </div>
        {url && (
          <div className="flex-1 flex items-center justify-center">
            <div className="px-3 py-1 rounded-md bg-ink/[0.04] text-xs text-ink/40 font-medium max-w-[200px] truncate">
              {url}
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="relative bg-white">
        {children}
      </div>
      {/* Fade — sits above the bottom border/rounded corners */}
      {fade && (
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-white via-white/60 to-transparent rounded-b-xl" />
      )}
    </div>
  )
}
