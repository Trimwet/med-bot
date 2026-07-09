import React from "react";
import { TimelineAnimation } from "@/components/ui/timeline-animation";
import { useMediaQuery } from "@/hooks/use-media-query";
import MotionDrawer from "@/components/ui/motion-drawer";

interface NavbarProps {
  onLogin?: () => void;
  onSignup?: () => void;
  timelineRef: React.RefObject<HTMLDivElement>;
}

export const Navbar = ({ onLogin, onSignup, timelineRef }: NavbarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-line">
        <div className="flex gap-4 justify-between items-center px-6 py-3 sticky">
          <MotionDrawer
            direction="left"
            width={300}
            backgroundColor={"#1B2160"}
            clsBtnClassName="bg-navy border-r border-navy-mid text-white"
            contentClassName="bg-navy border-r border-navy-mid text-white"
            btnClassName="bg-navy text-white relative w-fit p-2 left-0 top-0"
          >
            <nav className="space-y-4">
              <a
                href="#features"
                className="block p-2 hover:bg-white/10 text-white rounded-sm"
              >
                Features
              </a>
              <a
                href="#results"
                className="block p-2 hover:bg-white/10 text-white rounded-sm"
              >
                Results
              </a>
              <a
                href="#testimonials"
                className="block p-2 hover:bg-white/10 text-white rounded-sm"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="block p-2 hover:bg-white/10 text-white rounded-sm"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="block p-2 hover:bg-white/10 text-white rounded-sm"
              >
                Contact
              </a>
            </nav>
          </MotionDrawer>
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
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-line">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <TimelineAnimation
          timelineRef={timelineRef}
          animationNum={1}
          className="flex items-center gap-5"
        >
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
        </TimelineAnimation>
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
  );
};

export default Navbar;
