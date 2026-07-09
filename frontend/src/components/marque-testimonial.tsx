import React from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Ngozi Okafor',
    role: 'Director of Nursing',
    company: 'City General Hospital, Lagos',
    text: 'Our front desk stopped being the bottleneck. By the time a patient reaches us, we already know where they need to go.',
    avatar: 'NO',
    rating: 5,
  },
  {
    name: 'Ravi Anand',
    role: 'Chief Medical Officer',
    company: 'Lakeside Health, Abuja',
    text: "It's the first intake tool our clinicians actually trust, because they can always see the reasoning behind the tag.",
    avatar: 'RA',
    rating: 5,
  },
  {
    name: 'Chidinma Eze',
    role: 'Head of Emergency',
    company: 'University Teaching Hospital, Ibadan',
    text: 'During peak hours, MedBot handles the initial triage so our nurses can focus on critical cases. Game changer.',
    avatar: 'CE',
    rating: 5,
  },
  {
    name: 'Adebayo Ogundimu',
    role: 'Hospital Administrator',
    company: 'Reddington Hospital, Victoria Island',
    text: 'We reduced patient wait times by 60% in the first month. The clinical team loves the structured handoff summaries.',
    avatar: 'AO',
    rating: 5,
  },
  {
    name: 'Fatima Abubakar',
    role: 'Matron',
    company: 'National Hospital, Abuja',
    text: 'Finally, a tool that speaks the language of triage nurses. The acuity scoring is spot on every single time.',
    avatar: 'FA',
    rating: 5,
  },
  {
    name: 'Emeka Nwosu',
    role: 'Paediatrics Lead',
    company: 'Children\'s Specialist Clinic, Enugu',
    text: 'Parents appreciate getting guidance before they arrive. It has transformed how we manage our outpatient flow.',
    avatar: 'EN',
    rating: 5,
  },
]

const TestimonialCard = ({ testimonial, reverse = false }: { testimonial: typeof testimonials[0]; reverse?: boolean }) => (
  <div className="w-[380px] shrink-0 p-7 rounded-lg bg-teal/5 backdrop-blur-sm border border-teal/10 hover:bg-teal/10 transition-all duration-300 flex flex-col gap-5 relative overflow-hidden group">
    <div className={`absolute top-4 ${reverse ? 'left-4 rotate-180' : 'right-4'}`}>
      <Quote className="w-10 h-10 fill-teal/5 stroke-teal/10" />
    </div>

    <div className={`flex ${reverse ? 'justify-end' : ''}`}>
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>

    <p className="text-[#9CA3AF] leading-relaxed text-pretty font-medium">
      {testimonial.text}
    </p>

    <div className="flex items-center gap-4 mt-auto">
      <div className="size-11 rounded-full bg-teal flex items-center justify-center text-white font-bold text-sm border border-teal/30">
        {testimonial.avatar}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white text-sm">{testimonial.name}</p>
        <p className="text-xs text-[#9CA3AF]/80">{testimonial.role}</p>
        <p className="text-xs text-[#9CA3AF]/60">{testimonial.company}</p>
      </div>
    </div>
  </div>
)

export const MarqueeTestimonials = () => {
  const doubled = [...testimonials, ...testimonials]

  return (
    <section className="relative w-full overflow-hidden bg-[#0A202A] py-16">
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .marquee-row-left {
          animation: marquee-left 40s linear infinite;
          will-change: transform;
        }
        .marquee-row-right {
          animation: marquee-right 45s linear infinite;
          will-change: transform;
        }
        .marquee-row-left:hover,
        .marquee-row-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-14 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-display">
          Trusted by Clinicians
        </h2>
        <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
          Hear from healthcare professionals using MedBot to transform patient intake
        </p>
      </div>

      {/* Gradient fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#0A202A] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#0A202A] to-transparent z-10" />

      {/* Row 1 - left to right */}
      <div className="overflow-hidden">
        <div className="flex gap-5 px-6 w-max marquee-row-left">
          {doubled.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Row 2 - right to left */}
      <div className="overflow-hidden mt-5">
        <div className="flex gap-5 px-6 w-max marquee-row-right">
          {doubled.map((testimonial, i) => (
            <TestimonialCard key={`second-${i}`} testimonial={testimonial} reverse />
          ))}
        </div>
      </div>
    </section>
  )
}
