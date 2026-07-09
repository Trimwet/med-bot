import { HeroAiInfrastructure } from '@/components/hero-ai-infrastructure'
import { FeatureHero } from '@/components/feature-hero'
import { StatsSection } from '@/components/stats-section'
import { MarqueeTestimonials } from '@/components/marque-testimonial'
import { PricingSection } from '@/components/pricing-section'
import { CompareSection } from '@/components/compare-section'
import { DetailedFooter } from '@/components/footer-detailed'
import { Navbar } from '@/components/navbar'

interface LandingPageProps {
  onLogin: () => void
  onSignup: () => void
}

export const LandingPage = ({ onLogin, onSignup }: LandingPageProps) => {
  return (
    <div className="bg-white">
      <Navbar onLogin={onLogin} onSignup={onSignup} />
      <div id="hero">
        <HeroAiInfrastructure />
      </div>
      <div id="features">
        <FeatureHero />
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
      <div id="compare">
        <CompareSection />
      </div>
      <div id="contact">
        <DetailedFooter />
      </div>
    </div>
  )
}
