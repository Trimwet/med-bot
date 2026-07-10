import { useState, useEffect, useCallback } from 'react'
import { LandingPage } from '@/pages/landing'
import { AuthPage } from '@/components/auth-page'
import { DisclaimerPage } from '@/components/disclaimer-page'
import { HealthProfilePage } from '@/components/health-profile-page'
import { ForgotPasswordPage } from '@/components/forgot-password-page'

type Page = 'landing' | 'login' | 'signup' | 'disclaimer' | 'health-profile' | 'forgot-password'

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  const goLanding = useCallback(() => {
    window.history.replaceState({}, '', '/');
    setPage('landing');
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (path === '/health-profile' && token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', '/health-profile');
      setPage('health-profile');
    } else if (path === '/dashboard' && token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', '/');
      setPage('landing');
    } else if (path === '/login' && params.get('error')) {
      setPage('login');
    }
  }, []);

  if (page === 'login') {
    return (
      <AuthPage
        initialMode="login"
        onBack={goLanding}
        onToggleMode={() => setPage('signup')}
        onLoginSuccess={goLanding}
        onForgotPassword={() => setPage('forgot-password')}
      />
    )
  }

  if (page === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onBack={() => setPage('login')}
        onLogin={() => setPage('login')}
      />
    )
  }

  if (page === 'signup') {
    return (
      <DisclaimerPage
        onBack={goLanding}
        onAccept={() => setPage('disclaimer')}
      />
    )
  }

  if (page === 'disclaimer') {
    return (
      <AuthPage
        initialMode="signup"
        onBack={goLanding}
        onToggleMode={() => setPage('login')}
        onSignupSuccess={() => setPage('health-profile')}
      />
    )
  }

  if (page === 'health-profile') {
    return (
      <HealthProfilePage
        onBack={goLanding}
        onContinue={goLanding}
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
