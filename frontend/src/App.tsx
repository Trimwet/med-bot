import { useState } from 'react'
import { LandingPage } from '@/pages/landing'
import { AuthPage } from '@/components/auth-page'
import { DisclaimerPage } from '@/components/disclaimer-page'
import { HealthProfilePage } from '@/components/health-profile-page'

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
    <LandingPage
      onLogin={() => setPage('login')}
      onSignup={() => setPage('signup')}
    />
  );
}
