import React from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Chukwuebuka Ayaka',
    role: 'Lead Nurse',
    company: 'Abuja Medical Centre',
    text: 'MedBot has completely transformed our triage workflow. Patients are assessed before they even reach the desk.',
    avatar: 'CA',
    rating: 5,
  },
  {
    name: 'WeirdBola',
    role: 'Clinical Coordinator',
    company: 'Lagos Primary Health Board',
    text: 'The severity scoring is incredibly accurate. It helps us prioritise cases that truly need urgent attention.',
    avatar: 'WB',
    rating: 5,
  },
  {
    name: 'Wash Choji Rangs',
    role: 'Cyber Security Analyst',
    company: 'Plateau State University, Bokkos',
    text: 'I was sceptical at first, but the AI reasoning is transparent and reliable. A solid addition to our team.',
    avatar: 'WC',
    rating: 5,
  },
  {
    name: 'Adebolanle Ajimotokan',
    role: 'Data Analyst',
    company: 'National Open University of Nigeria',
    text: 'The insights from MedBot analytics help me understand patient flow trends like never before.',
    avatar: 'AA',
    rating: 5,
  },
  {
    name: 'Best Ifraimu',
    role: 'Nursing Officer',
    company: 'Federal Medical Centre, Yola',
    text: 'Our waiting room is quieter, our team is calmer, and patients leave knowing exactly what to do next.',
    avatar: 'BI',
    rating: 5,
  },
  {
    name: 'Okoye Frederick',
    role: 'Medical Director',
    company: 'Frederick Specialist Hospital, Onitsha',
    text: 'MedBot gives us structured, consistent intake data that our doctors actually reference during consultations.',
    avatar: 'OF',
    rating: 5,
  },
  {
    name: 'Itafe Angel Ohijemeshon',
    role: 'Head of Nursing',
    company: 'Delta State University Teaching Hospital',
    text: 'The local language support means our patients can describe symptoms comfortably. That makes all the difference.',
    avatar: 'IA',
    rating: 5,
  },
  {
    name: 'Benjamin Clement Alpha',
    role: 'IT & Health Informatics Lead',
    company: 'Cedarcrest Hospitals, Abuja',
    text: 'Integration was seamless. Within a week the entire triage team was using it without any training hiccups.',
    avatar: 'BC',
    rating: 5,
  },
  {
    name: 'Ogah Emmanuel Oheha',
    role: 'Senior Registrar',
    company: 'Benue State University Teaching Hospital',
    text: 'The clinical protocols are thorough and evidence-based. I trust the recommendations it generates.',
    avatar: 'OE',
    rating: 5,
  },
  {
    name: 'Polycarp Manji Isaac',
    role: 'Paediatric Consultant',
    company: 'Plateau State Specialist Hospital',
    text: 'Parents love the guidance they receive before arriving. It reduces anxiety and improves outcomes.',
    avatar: 'PM',
    rating: 5,
  },
  {
    name: 'Kaminevesho Darabasi Victor',
    role: 'Ward Manager',
    company: 'Rivers State University Teaching Hospital',
    text: 'Our triage accuracy improved significantly. MedBot catches what manual intake sometimes misses.',
    avatar: 'KD',
    rating: 5,
  },
  {
    name: 'Dalyop Daniel Joseph',
    role: 'Hospital Administrator',
    company: 'Bingham University Teaching Hospital, Jos',
    text: 'The analytics dashboard gives us real insight into patient flow and acuity trends. Invaluable for planning.',
    avatar: 'DD',
    rating: 5,
  },
  {
    name: 'Yakubu Yawachi Victor',
    role: 'Public Health Officer',
    company: 'Ministry of Health, Yobe State',
    text: 'We deployed MedBot in three rural clinics and the consistency of triage across facilities has been remarkable.',
    avatar: 'YY',
    rating: 5,
  },
  {
    name: 'Tatmang Israel David',
    role: 'UI/UX Designer',
    company: 'Plateau State University, Bokkos',
    text: 'MedBot has streamlined our patient intake process and improved accuracy across all shifts.',
    avatar: 'TD',
    rating: 5,
  },
]

const TestimonialCard = ({ testimonial, reverse = false }: { testimonial: typeof testimonials[0]; reverse?: boolean }) => (
  <div className="w-[280px] sm:w-[380px] shrink-0 p-4 sm:p-7 rounded-lg bg-teal/5 backdrop-blur-sm border border-teal/10 hover:bg-teal/10 transition-all duration-300 flex flex-col gap-3 sm:gap-5 relative overflow-hidden group">
    <div className={`absolute top-3 sm:top-4 ${reverse ? 'left-3 sm:left-4 rotate-180' : 'right-3 sm:right-4'}`}>
      <Quote className="w-7 h-7 sm:w-10 sm:h-10 fill-teal/5 stroke-teal/10" />
    </div>

    <div className={`flex ${reverse ? 'justify-end' : ''}`}>
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>

    <p className="text-[#9CA3AF] leading-relaxed text-pretty font-medium text-xs sm:text-[15px] line-clamp-4 sm:line-clamp-none">
      {testimonial.text}
    </p>

    <div className="flex items-center gap-3 sm:gap-4 mt-auto">
      <div className="size-9 sm:size-11 rounded-full bg-teal flex items-center justify-center text-white font-bold text-xs sm:text-sm border border-teal/30">
        {testimonial.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-xs sm:text-sm truncate">{testimonial.name}</p>
        <p className="text-[10px] sm:text-xs text-[#9CA3AF]/80 truncate">{testimonial.role}</p>
        <p className="text-[10px] sm:text-xs text-[#9CA3AF]/60 truncate">{testimonial.company}</p>
      </div>
    </div>
  </div>
)

export const MarqueeTestimonials = () => {
  const mid = Math.ceil(testimonials.length / 2)
  const topTestimonials = testimonials.slice(0, mid)
  const bottomTestimonials = testimonials.slice(mid)
  const topDoubled = [...topTestimonials, ...topTestimonials]
  const bottomDoubled = [...bottomTestimonials, ...bottomTestimonials]

  return (
    <section className="relative w-full overflow-hidden bg-[#0A202A] py-10 sm:py-16">
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-row-left {
          animation: marquee-scroll 40s linear infinite;
        }
        .marquee-row-right {
          animation: marquee-scroll 45s linear infinite reverse;
        }
        .marquee-row-left:hover,
        .marquee-row-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-14 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white text-balance leading-none mb-2 sm:mb-4 font-display">
          Trusted by Clinicians
        </h2>
        <p className="text-sm sm:text-lg text-[#9CA3AF] max-w-2xl mx-auto">
          Hear from healthcare professionals using MedBot to transform patient intake
        </p>
      </div>

      {/* Gradient fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-linear-to-r from-[#0A202A] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-linear-to-l from-[#0A202A] to-transparent z-10" />

      {/* Row 1 - left to right */}
      <div className="overflow-hidden">
        <div className="flex gap-3 sm:gap-5 w-max marquee-row-left">
          {topDoubled.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Row 2 - right to left */}
      <div className="overflow-hidden mt-3 sm:mt-5">
        <div className="flex gap-3 sm:gap-5 w-max marquee-row-right">
          {bottomDoubled.map((testimonial, i) => (
            <TestimonialCard key={`second-${i}`} testimonial={testimonial} reverse />
          ))}
        </div>
      </div>
    </section>
  )
}
