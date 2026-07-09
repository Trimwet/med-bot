import { useState } from 'react'
import { HeroAiInfrastructure } from '@/components/hero-ai-infrastructure'
import { FeatureHero } from '@/components/feature-hero'
import { StatsSection } from '@/components/stats-section'
import { MarqueeTestimonials } from '@/components/marque-testimonial'
import { PricingSection } from '@/components/pricing-section'
import { CompareSection } from '@/components/compare-section'
import { DetailedFooter } from '@/components/footer-detailed'
import { AuthPage } from '@/components/auth-page'
import { DisclaimerPage } from '@/components/disclaimer-page'

type Page = 'landing' | 'login' | 'signup' | 'disclaimer'

export default function App() {
  const [page, setPage] = useState<Page>('landing')

  if (page === 'login' || page === 'signup') {
    return (
      <AuthPage
        initialMode={page === 'signup' ? 'signup' : 'login'}
        onBack={() => setPage('landing')}
        onToggleMode={() => setPage(page === 'signup' ? 'login' : 'signup')}
      />
    )
  }

  if (page === 'disclaimer') {
    return (
      <DisclaimerPage
        onBack={() => setPage('landing')}
        onAccept={() => setPage('landing')}
      />
    )
  }

  return (
    <div className="bg-white">
      <div id="hero">
        <HeroAiInfrastructure onLogin={() => setPage('login')} onSignup={() => setPage('signup')} />
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
