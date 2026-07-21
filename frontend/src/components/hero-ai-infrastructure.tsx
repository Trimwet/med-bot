import { useRef, useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import SplitText from '@/components/ui/SplitText'

const ROTATING_WORDS = [
  'Always Available',
  'Here to Help',
  'Ready to Assist',
  'By Your Side',
  'Never Off Duty',
  'Listening Closely',
  'Built for You',
  'Smarter Every Day',
  'On Call 24/7',
  'Science-Backed',
  'Your Health Partner',
  'Here For You',
]

interface HeroAiInfrastructureProps {
  onPartners?: () => void
}

export const HeroAiInfrastructure = ({ onPartners }: HeroAiInfrastructureProps) => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={timelineRef}
      className="relative min-h-screen flex flex-col bg-white text-ink w-full overflow-hidden"
    >
      <div className="relative z-10 grow flex flex-col lg:flex-row items-center justify-center px-6 sm:px-8 lg:px-12 pt-24 pb-16 gap-14 lg:gap-12 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-center text-center min-w-0">
          <TimelineAnimation
            timelineRef={timelineRef}
            animationNum={3}
            className="flex items-center gap-2 rounded-full px-1.5 py-1 pr-4 bg-teal/10 text-ink text-[12px] font-medium font-display my-2"
          >
            <span className="py-0.5 px-2.5 rounded-full bg-teal text-white font-semibold text-xs">
              New
            </span>
            <span>Trusted by 999+ growing B2B teams</span>
          </TimelineAnimation>

          <TimelineAnimation
            timelineRef={timelineRef}
            animationNum={4}
            className="text-[1.75rem] sm:text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.2] max-w-2xl my-4 font-display"
          >
            {/* Line 1: "Your AI" */}
            <div className="block text-center">
              <SplitText
                text="Your AI"
                delay={50}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                tag="span"
              />
            </div>
            {/* Line 2: "Medical Assistant" — kept together so the two words never split */}
            <div className="block text-center">
              <SplitText
                text="Medical Assistant"
                delay={50}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                tag="span"
              />
            </div>
            {/* Line 3: "is" on its own line, rotating teal word on the next — both full-width so no clipping */}
            <div className="block text-center">
              <span>is</span>
            </div>
            <div className="block text-center text-teal relative h-[1.2em] overflow-hidden">
              {ROTATING_WORDS.map((word, i) => (
                <SplitText
                  key={word}
                  text={word}
                  className={`block transition-all duration-500 ${
                    i === wordIndex
                      ? 'opacity-100 translate-y-0 relative'
                      : 'opacity-0 translate-y-full absolute inset-0'
                  }`}
                  delay={30}
                  duration={0.8}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  tag="span"
                />
              ))}
            </div>
          </TimelineAnimation>

          <TimelineAnimation
            timelineRef={timelineRef}
            as="p"
            animationNum={5}
            className="text-muted text-sm sm:text-base md:text-lg max-w-xl mb-6 font-light"
          >
            Describe your symptoms, get instant guidance, and receive
            personalized recommendations powered by clinical knowledge and AI.
          </TimelineAnimation>

          <div className="flex flex-wrap gap-3 items-center justify-center w-full">
            <TimelineAnimation
              timelineRef={timelineRef}
              as="a"
              animationNum={6}
              href="#contact"
              className="cursor-pointer bg-teal text-white px-5 py-2.5 rounded-sm font-semibold flex items-center gap-2 hover:bg-teal/80 transition font-display text-sm sm:whitespace-nowrap justify-center"
            >
              Start Symptom Check <ArrowRight size={16} />
            </TimelineAnimation>
            <TimelineAnimation
              timelineRef={timelineRef}
              as="button"
              animationNum={7}
              onClick={onPartners}
              className="cursor-pointer relative bg-transparent hover:bg-ink/5 transition px-5 py-2.5 rounded-sm font-semibold border border-ink/20 text-ink font-display text-sm sm:whitespace-nowrap justify-center"
            >
              For Healthcare Partners
            </TimelineAnimation>
          </div>
        </div>

        <TimelineAnimation
          timelineRef={timelineRef}
          animationNum={5.5}
          className="flex-1 flex justify-center lg:justify-end w-full lg:w-auto"
        >
          <div className="relative group w-full max-w-md lg:max-w-lg">
            <div className="absolute -inset-4 bg-paper-soft rounded-3xl border border-line shadow-[0_25px_80px_-10px_rgba(0,168,168,0.5)] animate-[float-border_4s_ease-in-out_infinite] will-change-transform"></div>
            <div className="absolute -inset-2 bg-paper rounded-3xl border border-line shadow-xl animate-[float-border_4s_ease-in-out_infinite_0.4s] will-change-transform"></div>
            <div className="relative overflow-hidden rounded-2xl border border-line shadow-2xl bg-white">
              <img
                src="/hero-doctor.png"
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
  )
}
