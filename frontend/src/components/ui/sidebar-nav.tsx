import React, { useEffect, useCallback } from 'react'
import { X, Activity, Shield, Zap, Users, FileText, HelpCircle, ArrowRight } from 'lucide-react'

interface SidebarNavProps {
  isOpen: boolean
  onClose: () => void
  onLogin?: () => void
  onSignup?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Product',
    items: [
      { label: 'Symptom Checker', href: '#features', icon: Activity },
      { label: 'AI Diagnostics', href: '#features', icon: Zap },
      { label: 'Health Records', href: '#features', icon: FileText },
      { label: 'Privacy & Security', href: '#features', icon: Shield },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About Us', href: '#about', icon: Users },
      { label: 'Testimonials', href: '#testimonials', icon: FileText },
      { label: 'Pricing', href: '#pricing', icon: FileText },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center', href: '#contact', icon: HelpCircle },
    ],
  },
]

export const SidebarNav = ({ isOpen, onClose, onLogin, onSignup }: SidebarNavProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  return (
    <>
      {/* Overlay */}
      <div
        role="button"
        aria-label="Close menu"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-[#0f2933] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">MedBot</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-4">
          {navGroups.map((group, groupIdx) => (
            <React.Fragment key={group.title}>
              {groupIdx > 0 && (
                <div className="border-t border-white/10 my-3" />
              )}
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-3 mb-2">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 group"
                    >
                      <item.icon className="w-[18px] h-[18px] text-gray-500 group-hover:text-teal-400 transition-colors duration-200" />
                      <span className="text-[15px] font-medium">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-4 pb-6 pt-2 border-t border-white/10 space-y-3">
          {onLogin && (
            <button
              onClick={() => { onLogin(); onClose() }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-white/15 text-gray-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all duration-200"
            >
              Log In
            </button>
          )}
          {onSignup && (
            <button
              onClick={() => { onSignup(); onClose() }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-teal-500/25"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>
    </>
  )
}

export default SidebarNav