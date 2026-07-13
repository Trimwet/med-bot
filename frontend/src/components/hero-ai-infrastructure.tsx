import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { TimelineAnimation } from '@/components/ui/timeline-animation'

interface HeroAiInfrastructureProps {
  onPartners?: () => void
}

export const HeroAiInfrastructure = ({ onPartners }: HeroAiInfrastructureProps) => {
  const timelineRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={timelineRef}
      className="relative min-h-screen flex flex-col bg-white text-ink w-full"
    >
      <div className="relative z-10 grow flex flex-col lg:flex-row items-center justify-center px-8 pt-24 pb-16 gap-12 max-w-7xl mx-auto w-full">
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
            className="text-4xl md:text-5xl font-semibold tracking-tight leading-[120%] max-w-2xl my-5 font-display"
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
            className="text-muted text-base md:text-lg max-w-xl mb-6 font-light"
          >
            Describe your symptoms, get instant guidance, and receive
            personalized recommendations powered by clinical knowledge and AI.
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
              onClick={onPartners}
              className="cursor-pointer relative bg-transparent hover:bg-ink/5 transition px-8 py-3 rounded-sm font-semibold border border-ink/20 text-ink font-display"
            >
              For HealthCare Partners
            </TimelineAnimation>
          </div>
        </div>

        <TimelineAnimation
          timelineRef={timelineRef}
          animationNum={5.5}
          className="flex-1 flex justify-center lg:justify-end"
        >
          <div className="relative group">
            <div className="absolute -inset-4 bg-paper-soft rounded-3xl border border-line shadow-lg animate-[float-border_4s_ease-in-out_infinite] will-change-transform"></div>
            <div className="absolute -inset-2 bg-paper rounded-3xl border border-line shadow-xl animate-[float-border_4s_ease-in-out_infinite_0.4s] will-change-transform"></div>
            <div className="relative overflow-hidden rounded-2xl border border-line shadow-2xl bg-white">
              <img
                src="/hero-doctor.jpg"
                alt="Doctor consulting with patient"
                loading="lazy"
                decoding="async"
                className="w-full max-w-lg object-cover object-center mix-blend-multiply"
                style={{ aspectRatio: "4/3" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 pointer-events-none"></div>
            </div>
          </div>
        </TimelineAnimation>
      </div>
    </section>
  );
}