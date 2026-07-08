import React, { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { useMediaQuery } from '@/hooks/use-media-query'
import MotionDrawer from '@/components/ui/motion-drawer'
import { HealthBot } from '@/components/health-bot'

export const HeroAiInfrastructure = () => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <section
      ref={timelineRef}
      className="relative min-h-screen flex flex-col bg-white text-ink w-full overflow-hidden"
    >
      {isMobile && (
        <div className="flex gap-4 justify-between items-center px-10 pt-4">
          <MotionDrawer
            direction="left"
            width={300}
            backgroundColor={'#1B2160'}
            clsBtnClassName="bg-navy border-r border-navy-mid text-white"
            contentClassName="bg-navy border-r border-navy-mid text-white"
            btnClassName="bg-navy text-white relative w-fit p-2 left-0 top-0"
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
          <TimelineAnimation
            as="button"
            timelineRef={timelineRef}
            animationNum={1}
            className="cursor-pointer bg-navy hover:bg-navy-deep transition px-2 py-2 rounded text-sm font-medium text-white"
          >
            Get Early Access
          </TimelineAnimation>
        </div>
      )}
      {!isMobile && (
        <header className="relative z-10 flex items-center max-w-7xl mx-auto w-full justify-between px-8 py-6">
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
          <div className="flex items-center gap-4">
            <TimelineAnimation
              as="button"
              timelineRef={timelineRef}
              animationNum={2}
              className="cursor-pointer bg-navy hover:bg-navy-deep transition px-2 py-2 rounded text-sm font-medium text-white"
            >
              Get Early Access
            </TimelineAnimation>
          </div>
        </header>
      )}

      <div className="relative z-10 grow flex flex-col lg:flex-row items-center justify-center px-8 pt-24 pb-16 gap-12 max-w-7xl mx-auto w-full">
        {/* Left content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <TimelineAnimation
            timelineRef={timelineRef}
            animationNum={3}
            className="flex items-center gap-2 rounded-full px-1.5 py-1 pr-4 bg-navy/10 text-ink text-sm font-medium font-display"
          >
            <span className="py-0.5 px-2.5 rounded-full bg-navy text-white font-semibold text-xs">
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
            <span className="text-navy">Always Available</span>
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
              className="cursor-pointer bg-navy text-white px-6 py-3 rounded-sm font-semibold flex items-center gap-2 hover:bg-navy-deep transition font-display"
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
          <div className="relative">
            <div className="absolute inset-0 bg-paper-soft rounded-2xl transform rotate-3 scale-105 border border-line shadow-lg"></div>
            <div className="absolute inset-0 bg-paper rounded-2xl transform -rotate-2 scale-102 border border-line shadow-xl"></div>
            <img
              src="/hero-bg.png"
              alt="Doctor consulting with patient"
              className="relative w-full max-w-lg rounded-2xl border border-line shadow-2xl object-cover"
            />
          </div>
        </TimelineAnimation>
      </div>
    </section>
  )
}
