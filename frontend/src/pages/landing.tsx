import { HeroAiInfrastructure } from '@/components/hero-ai-infrastructure'
import { FeaturesAlternating } from '@/components/features-alternating'
import { StatsSection } from '@/components/stats-section'
import { MarqueeTestimonials } from '@/components/marque-testimonial'
import { PricingSection } from '@/components/pricing-section'
import { DetailedFooter } from '@/components/footer-detailed'
import { Navbar } from '@/components/navbar'

interface LandingPageProps {
  onLogin: () => void
  onSignup: () => void
  onPartners?: () => void
}

export const LandingPage = ({ onLogin, onSignup, onPartners }: LandingPageProps) => {
  return (
    <div className="bg-white overflow-hidden">
      <Navbar onLogin={onLogin} onSignup={onSignup} />
      <div id="hero">
        <HeroAiInfrastructure onPartners={onPartners} />
      </div>
      <div id="features">
        <FeaturesAlternating />
      </div>
      <div id="results">
        <StatsSection />
      </div>
      <div id="testimonials">
        <MarqueeTestimonials />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <div id="contact">
        <DetailedFooter />
      </div>
    </div>
  )
}
