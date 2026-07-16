import { useEffect, useRef } from 'react'

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking'

interface DashboardOrbProps {
  state?: OrbState
  /** Pass a MutableRefObject so audio-level changes never cause re-renders */
  reactivityRef?: React.MutableRefObject<number>
  /** Fallback scalar reactivity (only used when reactivityRef is absent) */
  reactivity?: number
  size?: number
  onClick?: () => void
}

function useCloudAnimation(
  state: OrbState,
  reactivityRef: React.MutableRefObject<number>,
) {
  const cloud1Ref = useRef<HTMLDivElement>(null)
  const cloud2Ref = useRef<HTMLDivElement>(null)
  const cloud3Ref = useRef<HTMLDivElement>(null)
  const cloud4Ref = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef(0)
  const rafRef = useRef<number>(0)
  // keep state in a ref so the rAF closure always sees current value
  // without needing to restart the loop
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const c1 = cloud1Ref.current
    const c2 = cloud2Ref.current
    const c3 = cloud3Ref.current
    const c4 = cloud4Ref.current
    const h = highlightRef.current
    if (!c1 && !c2 && !c3) return

    const tick = () => {
      const s = stateRef.current
      const r = reactivityRef.current

      const speed = s === 'listening' ? 0.014 : s === 'speaking' ? 0.018 : 0.005
      const amp = s === 'idle' ? 3 : 6
      timeRef.current += speed
      const t = timeRef.current

      if (c1) {
        const dx = Math.sin(t * 0.9 + r * 2.5) * amp
        const dy = Math.cos(t * 0.65 + r * 1.8 + 1.2) * amp * 0.7
        c1.style.transform = `translate(${dx}px, ${dy}px)`
      }
      if (c2) {
        const dx = Math.sin(t * 0.55 + 2.1 + r * 1.6) * amp * 0.8
        const dy = Math.cos(t * 0.7 + 0.9 + r * 1.2) * amp * 0.55
        c2.style.transform = `translate(${dx}px, ${dy}px)`
      }
      if (c3) {
        const dx = Math.sin(t * 0.35 + 4.3 + r) * amp * 0.6
        const dy = Math.cos(t * 0.45 + 1.9 + r * 0.9) * amp * 0.45
        c3.style.transform = `translate(${dx}px, ${dy}px)`
      }
      if (c4) {
        const dx = Math.sin(t * 0.25 + 6.0 + r * 0.7) * amp * 0.4
        const dy = Math.cos(t * 0.3 + 3.2 + r * 0.6) * amp * 0.35
        c4.style.transform = `translate(${dx}px, ${dy}px)`
      }
      if (h) {
        const shimmer = 0.22 + Math.sin(t * 1.2) * 0.05 + r * 0.08
        h.style.opacity = String(shimmer)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // Only start/stop the loop once on mount — state changes go via stateRef
  }, [reactivityRef])

  return { cloud1Ref, cloud2Ref, cloud3Ref, cloud4Ref, highlightRef }
}

export function DashboardOrb({ state = 'idle', reactivityRef, reactivity = 0, size = 180, onClick }: DashboardOrbProps) {
  // If a ref is provided, use it; otherwise wrap the scalar in a stable ref
  const scalarRef = useRef(reactivity)
  useEffect(() => { scalarRef.current = reactivity }, [reactivity])
  const resolvedRef = reactivityRef ?? scalarRef

  const { cloud1Ref, cloud2Ref, cloud3Ref, cloud4Ref, highlightRef } = useCloudAnimation(state, resolvedRef)
  const isActive = state !== 'idle'

  const glowIntensity = isActive ? 0.4 + reactivity * 0.3 : 0.18
  const glowSpread = isActive ? 35 + reactivity * 45 : 25

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {/* Outer glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: `-${glowSpread}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,212,212,${glowIntensity}) 0%, rgba(0,168,168,${glowIntensity * 0.3}) 40%, transparent 70%)`,
          filter: `blur(${glowSpread * 0.4}px)`,
          transition: 'all 0.6s ease-out',
        }}
      />

      {/* Main sphere — translucent glass */}
      <div
        className="relative overflow-hidden"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'rgba(0,60,80,0.06)',
          backdropFilter: 'blur(12px) saturate(1.5) brightness(1.05)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.5) brightness(1.05)',
          boxShadow: `
            inset 0 -${size * 0.05}px ${size * 0.1}px rgba(0,0,0,0.2),
            inset 0 ${size * 0.02}px ${size * 0.04}px rgba(255,255,255,0.12),
            0 ${size * 0.03}px ${size * 0.12}px rgba(0,0,0,0.15)
          `,
        }}
      >
        {/* Cloud layer 1 — white wisps (upper) */}
        <div
          ref={cloud1Ref}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 65% 50% at 35% 30%, rgba(255,255,255,0.28) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 55% 25%, rgba(255,255,255,0.18) 0%, transparent 55%)
            `,
            filter: 'blur(6px)',
          }}
        />

        {/* Cloud layer 2 — teal/blue wisps (mid) */}
        <div
          ref={cloud2Ref}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 45% at 50% 50%, rgba(0,168,168,0.3) 0%, transparent 60%),
              radial-gradient(ellipse 45% 35% at 30% 55%, rgba(0,120,180,0.15) 0%, transparent 50%),
              radial-gradient(ellipse 40% 30% at 65% 45%, rgba(0,212,212,0.2) 0%, transparent 55%)
            `,
            filter: 'blur(7px)',
          }}
        />

        {/* Cloud layer 3 — deep blue/milk wisps */}
        <div
          ref={cloud3Ref}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 75% 55% at 45% 55%, rgba(56,62,168,0.12) 0%, transparent 55%),
              radial-gradient(ellipse 50% 40% at 60% 65%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(ellipse 55% 40% at 35% 45%, rgba(77,90,200,0.08) 0%, transparent 50%)
            `,
            filter: 'blur(9px)',
          }}
        />

        {/* Cloud layer 4 — deep horizon mist */}
        <div
          ref={cloud4Ref}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 35% at 50% 70%, rgba(255,255,255,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 60% 30% at 40% 60%, rgba(0,168,168,0.1) 0%, transparent 50%)
            `,
            filter: 'blur(11px)',
          }}
        />

        {/* Specular highlight — top-left catch light */}
        <div
          ref={highlightRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 45% 35% at 30% 25%, rgba(255,255,255,0.3) 0%, transparent 60%),
              radial-gradient(ellipse 25% 20% at 33% 28%, rgba(255,255,255,0.15) 0%, transparent 45%)
            `,
          }}
        />

        {/* Bottom rim — subtle blue glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 25% at 50% 88%, rgba(0,168,168,0.1) 0%, transparent 60%)`,
          }}
        />

        {/* Glass rim ring */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />

        {/* Edge darkening for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '50%',
            boxShadow: `inset 0 0 ${size * 0.2}px ${size * 0.07}px rgba(0,15,25,0.4)`,
          }}
        />
      </div>
    </div>
  )
}
