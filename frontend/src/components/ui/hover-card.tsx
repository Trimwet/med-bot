import { HoverCard as HoverCardPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

export const HoverCard = HoverCardPrimitive.Root
export const HoverCardTrigger = HoverCardPrimitive.Trigger
export function HoverCardContent({ className, sideOffset = 4, ...props }: ComponentProps<typeof HoverCardPrimitive.Content>) {
  return <HoverCardPrimitive.Portal><HoverCardPrimitive.Content sideOffset={sideOffset} className={className} {...props} /></HoverCardPrimitive.Portal>
}
