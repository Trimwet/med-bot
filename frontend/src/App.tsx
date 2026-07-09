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
import { HealthProfilePage } from '@/components/health-profile-page'
import { Navbar } from '@/components/navbar'

type Page = 'landing' | 'login' | 'signup' | 'disclaimer' | 'health-profile'

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  if (page === 'login') {
    return (
      <AuthPage
        initialMode="login"
        onBack={() => setPage('landing')}
        onToggleMode={() => setPage('signup')}
      />
    )
  }

  if (page === 'signup') {
    return (
      <DisclaimerPage
        onBack={() => setPage('landing')}
        onAccept={() => setPage('disclaimer')}
      />
    )
  }

  if (page === 'disclaimer') {
    return (
      <AuthPage
        initialMode="signup"
        onBack={() => setPage('landing')}
        onToggleMode={() => setPage('login')}
        onSignupSuccess={() => setPage('health-profile')}
      />
    )
  }

  if (page === 'health-profile') {
    return (
      <HealthProfilePage
        onBack={() => setPage('landing')}
        onContinue={() => setPage('landing')}
      />
    )
  }

  return (
    <div className="bg-white">
      <Navbar
        onLogin={() => setPage("login")}
        onSignup={() => setPage("signup")}
      />
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
  );
}
