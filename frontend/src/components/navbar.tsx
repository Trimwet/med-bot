import { useState, useEffect, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"

interface NavbarProps {
  onLogin?: () => void
  onSignup?: () => void
}

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Results", href: "#results" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
] as const

function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return scrolled
}

function useActiveSection() {
  const [active, setActive] = useState("")

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[]
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`)
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return active
}

export const Navbar = ({ onLogin, onSignup }: NavbarProps) => {
  const scrolled = useScrolled()
  const activeSection = useActiveSection()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      {/* ── Desktop / Tablet ── */}
      <header
        role="banner"
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
          {/* ── Brand ── */}
          <a
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="MedBot – Go to homepage"
          >
            <img
              src="/assets/Logo.jpeg"
              alt=""
              className="h-8 w-auto rounded-md"
            />
            <span className="font-display font-extrabold text-lg tracking-tight text-navy">
              MedBot
            </span>
          </a>

          {/* ── Center Nav (desktop only) ── */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-1"
          >
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activeSection === href
              return (
                <a
                  key={href}
                  href={href}
                  className={cn(
                    "relative px-4 py-2 text-[14px] font-medium rounded-lg transition-colors duration-150",
                    isActive
                      ? "text-ink"
                      : "text-muted hover:text-ink"
                  )}
                >
                  {label}
                  {/* active underline */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-teal transition-all duration-200",
                      isActive ? "w-4 opacity-100" : "w-0 opacity-0"
                    )}
                  />
                </a>
              )
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onLogin?.() }}
              className="px-4 py-2 text-[14px] font-medium text-muted hover:text-ink rounded-lg transition-colors duration-150"
            >
              Log In
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onSignup?.() }}
              className="px-5 py-2 text-[14px] font-semibold text-white bg-navy rounded-full transition-all duration-150 hover:bg-navy-deep hover:shadow-md hover:shadow-navy/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              Sign Up
            </a>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-ink hover:bg-ink/5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-[60] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
              onClick={closeMobile}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-line">
                <a
                  href="/"
                  className="flex items-center gap-2.5"
                  aria-label="MedBot – Go to homepage"
                  onClick={closeMobile}
                >
                  <img
                    src="/assets/Logo.jpeg"
                    alt=""
                    className="h-8 w-auto rounded-md"
                  />
                  <span className="font-display font-extrabold text-lg tracking-tight text-navy">
                    MedBot
                  </span>
                </a>
                <button
                  onClick={closeMobile}
                  aria-label="Close menu"
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="px-6 py-6 space-y-1" aria-label="Mobile navigation">
                {NAV_LINKS.map(({ label, href }) => {
                  const isActive = activeSection === href
                  return (
                    <a
                      key={href}
                      href={href}
                      onClick={closeMobile}
                      className={cn(
                        "block px-4 py-3 text-[15px] font-medium rounded-xl transition-colors duration-150",
                        isActive
                          ? "bg-teal/10 text-teal"
                          : "text-ink hover:bg-ink/5"
                      )}
                    >
                      {label}
                    </a>
                  )
                })}
              </nav>

              {/* Actions */}
              <div className="px-6 pb-8 pt-2 space-y-3 border-t border-line">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onLogin?.(); closeMobile() }}
                  className="block w-full text-center px-5 py-3 text-[15px] font-medium text-ink border border-line rounded-full hover:bg-ink/5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                >
                  Log In
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onSignup?.(); closeMobile() }}
                  className="block w-full text-center px-5 py-3 text-[15px] font-semibold text-white bg-navy rounded-full transition-all duration-150 hover:bg-navy-deep hover:shadow-md hover:shadow-navy/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                >
                  Sign Up
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
