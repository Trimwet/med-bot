import React, { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { useMediaQuery } from '@/hooks/use-media-query'
import MotionDrawer from '@/components/ui/motion-drawer'
import { HealthBot } from '@/components/health-bot'

export const HeroAiInfrastructure = ({ onLogin, onSignup }: { onLogin?: () => void; onSignup?: () => void }) => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <section
      ref={timelineRef}
      className="relative min-h-screen flex flex-col bg-white text-ink w-full"
    >
      {isMobile && (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-line">
          <div className="flex gap-4 justify-between items-center px-6 py-3">
            <MotionDrawer
              direction="left"
              width={300}
              backgroundColor={'#1B2160'}
              clsBtnClassName="bg-[#0A202A] border-r border-teal/30 text-white"
              contentClassName="bg-[#0A202A] border-r border-teal/30 text-white"
              btnClassName="bg-[#0A202A] text-white relative w-fit p-2 left-0 top-0"
            >
              <nav className="space-y-4">
                <a href="#features" className="block p-2 hover:bg-white/10 text-white rounded-sm">
                  Features
                </a>
                <a href="#results" className="block p-2 hover:bg-white/10 text-white rounded-sm">
                  Results
                </a>
                <a href="#testimonials" className="block p-2 hover:bg-white/10 text-white rounded-sm">
                  Testimonials
                </a>
                <a href="#pricing" className="block p-2 hover:bg-white/10 text-white rounded-sm">
                  Pricing
                </a>
                <a href="#contact" className="block p-2 hover:bg-white/10 text-white rounded-sm">
                  Contact
                </a>
              </nav>
            </MotionDrawer>
            <div className="flex items-center gap-2">
              <button
                onClick={onLogin}
                className="text-sm font-medium text-ink hover:text-teal transition-colors px-3 py-1.5"
              >
                Log In
              </button>
              <button
                onClick={onSignup}
                className="text-sm font-medium bg-teal text-white px-4 py-1.5 rounded-lg hover:bg-teal/80 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-line">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
            <TimelineAnimation
              timelineRef={timelineRef}
              animationNum={1}
              className="flex items-center gap-5"
            >
              <nav className="hidden md:flex items-center gap-6 text-md text-muted">
                <a href="#features" className="hover:text-ink transition">Features</a>
                <a href="#results" className="hover:text-ink transition">Results</a>
                <a href="#testimonials" className="hover:text-ink transition">Testimonials</a>
                <a href="#pricing" className="hover:text-ink transition">Pricing</a>
              </nav>
            </TimelineAnimation>
            <div className="flex items-center gap-3">
              <button
                onClick={onLogin}
                className="text-sm font-medium text-ink hover:text-teal transition-colors px-3 py-1.5"
              >
                Log In
              </button>
              <button
                onClick={onSignup}
                className="text-sm font-medium bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal/80 transition-colors font-display"
              >
                Sign Up
              </button>
            </div>
          </div>
        </header>
      )}

      <div className="relative z-10 grow flex flex-col lg:flex-row items-center justify-center px-8 pt-24 pb-16 gap-12 max-w-7xl mx-auto w-full">
        {/* Left content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <TimelineAnimation
            timelineRef={timelineRef}
            animationNum={3}
            className="flex items-center gap-2 rounded-full px-1.5 py-1 pr-4 bg-teal/10 text-ink text-sm font-medium font-display"
          >
            <span className="py-0.5 px-2.5 rounded-full bg-teal text-white font-semibold text-xs">
              New
            </span>
            <span>Trusted by 999+ growing B2B teams</span>
          </TimelineAnimation>

          <TimelineAnimation
            timelineRef={timelineRef}
            as="h1"
            animationNum={4}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[120%] max-w-2xl my-5 font-display"
          >
            Your AI Medical
            <br />
            Assistant is
            <br />
            <span className="text-teal">Always Available</span>
          </TimelineAnimation>

          <TimelineAnimation
            timelineRef={timelineRef}
            as="p"
            animationNum={5}
            className="text-muted text-lg md:text-xl max-w-xl mb-6 font-light"
          >
            Describe your symptoms, get instant guidance, and receive personalized
            recommendations powered by clinical knowledge and AI.
          </TimelineAnimation>

          <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
            <TimelineAnimation
              timelineRef={timelineRef}
              as="a"
              animationNum={6}
              href="#contact"
              className="cursor-pointer bg-[#007A7A] text-white px-6 py-3 rounded-sm font-semibold flex items-center gap-2 hover:bg-[#005F5F] transition font-display"
            >
              Start Symptom Check <ArrowRight size={18} />
            </TimelineAnimation>
            <TimelineAnimation
              timelineRef={timelineRef}
              as="button"
              animationNum={7}
              className="cursor-pointer relative bg-transparent hover:bg-ink/5 transition px-8 py-3 rounded-sm font-semibold border border-ink/20 text-ink font-display"
            >
              Learn More
            </TimelineAnimation>
          </div>
        </div>

        {/* Right image */}
        <TimelineAnimation
          timelineRef={timelineRef}
          animationNum={5.5}
          className="flex-1 flex justify-center lg:justify-end"
        >
          <div className="relative group">
            {/* Animated paper border layers */}
            <div className="absolute -inset-4 bg-paper-soft rounded-3xl border border-line shadow-lg animate-[float-border_4s_ease-in-out_infinite] will-change-transform"></div>
            <div className="absolute -inset-2 bg-paper rounded-3xl border border-line shadow-xl animate-[float-border_4s_ease-in-out_infinite_0.4s] will-change-transform"></div>
            {/* Image container */}
            <div className="relative overflow-hidden rounded-2xl border border-line shadow-2xl bg-white">
              <img
                src="/hero-doctor.jpg"
                alt="Doctor consulting with patient"
                loading="lazy"
                decoding="async"
                className="w-full max-w-lg object-cover object-center mix-blend-multiply"
                style={{ aspectRatio: '4/3' }}
              />
              {/* Soft edge fade to blend with white background */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 pointer-events-none"></div>
            </div>
          </div>
        </TimelineAnimation>
      </div>
    </section>
  )
}
