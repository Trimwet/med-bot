import { useState } from 'react'
import { HeroAiInfrastructure } from '@/components/hero-ai-infrastructure'
import { FeatureHero } from '@/components/feature-hero'
import { StatsSection } from '@/components/stats-section'
import { MarqueeTestimonials } from '@/components/marque-testimonial'
import { PricingSection } from '@/components/pricing-section'
import { CompareSection } from '@/components/compare-section'
import { DetailedFooter } from '@/components/footer-detailed'
import { AuthPage } from '@/components/auth-page'

type Page = 'landing' | 'login' | 'signup'

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

  return (
    <div className="bg-white">
      {/* Auth nav buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setPage('login')}
          className="bg-white border border-line text-ink px-4 py-2 rounded-lg text-sm font-medium hover:bg-paper-soft transition-colors font-display shadow-sm"
        >
          Log In
        </button>
        <button
          onClick={() => setPage('signup')}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy-deep transition-colors font-display shadow-sm"
        >
          Sign Up
        </button>
      </div>

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
