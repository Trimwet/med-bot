import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import MotionDrawer from "@/components/ui/motion-drawer"

interface NavbarProps {
  onLogin?: () => void
  onSignup?: () => void
}

export const Navbar = ({ onLogin, onSignup }: NavbarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (isMobile) {
    return (
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-line">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-ink hover:bg-ink/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img src="/assets/Logo.jpeg" alt="MedBot" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogin}
              className="text-sm font-medium text-ink hover:text-navy transition-colors px-3 py-1.5"
            >
              Log In
            </button>
            <button
              onClick={onSignup}
              className="text-sm font-medium bg-navy text-white px-4 py-1.5 rounded-lg hover:bg-navy-deep transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
        <MotionDrawer
          direction="left"
          width={300}
          isOpen={drawerOpen}
          onToggle={setDrawerOpen}
          showToggleButton={false}
          backgroundColor={"#073B4C"}
          clsBtnClassName="bg-navy border-r border-navy text-white flex items-center justify-center w-10 h-10 rounded-lg text-ink hover:bg-ink/5 transition-colors"
          contentClassName="bg-navy border-r border-navy text-white flex flex-col items-start justify-start p-6 space-y-4"
        >
          <div className="flex items-center justify-between w-[250px]">
            <img src="/assets/Logo.jpeg" alt="Logo" className="h-10 w-auto rounded-lg" />
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-4 mt-4">
            <a
              href="#features"
              onClick={() => setDrawerOpen(false)}
              className="block p-2 hover:bg-white/10 text-white rounded-sm"
            >
              Features
            </a>
            <a
              href="#results"
              onClick={() => setDrawerOpen(false)}
              className="block p-2 hover:bg-white/10 text-white rounded-sm"
            >
              Results
            </a>
            <a
              href="#testimonials"
              onClick={() => setDrawerOpen(false)}
              className="block p-2 hover:bg-white/10 text-white rounded-sm"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              onClick={() => setDrawerOpen(false)}
              className="block p-2 hover:bg-white/10 text-white rounded-sm"
            >
              Pricing
            </a>
            <a
              href="#contact"
              onClick={() => setDrawerOpen(false)}
              className="block p-2 hover:bg-white/10 text-white rounded-sm"
            >
              Contact
            </a>
          </nav>
        </MotionDrawer>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-line">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-5">
          <a href="/" className="flex items-center gap-2">
            <img src="/assets/Logoico.png" alt="Logo" className="h-10 w-auto" />
            <p className="font-extrabold text-2xl text-[#073B4C]">MedBot</p>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-md text-muted">
            <a href="#features" className="hover:text-ink transition">
              Features
            </a>
            <a href="#results" className="hover:text-ink transition">
              Results
            </a>
            <a href="#testimonials" className="hover:text-ink transition">
              Testimonials
            </a>
            <a href="#pricing" className="hover:text-ink transition">
              Pricing
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="text-sm font-medium text-ink hover:text-navy transition-colors px-3 py-1.5"
          >
            Log In
          </button>
          <button
            onClick={onSignup}
            className="text-sm font-medium bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-deep transition-colors font-display"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar