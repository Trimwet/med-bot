import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { LandingPage } from '@/pages/landing'
import { AuthPage } from '@/components/auth-page'
import { DisclaimerPage } from '@/components/disclaimer-page'
import { HealthProfilePage } from '@/components/health-profile-page'
import { ForgotPasswordPage } from '@/components/forgot-password-page'
import { CustomerDashboardLayout } from '@/components/customer/customer-dashboard-layout'
import { CustomerDashboardHome } from '@/components/customer/customer-dashboard-home'
import { AssessmentHistory } from '@/components/customer/assessment-history'
import { HealthReports } from '@/components/customer/health-reports'
import { HealthLibrary } from '@/components/customer/health-library'

function AppRoutes() {
  const navigate = useNavigate()

  return (
    <Routes>
      {/* Landing & Auth */}
      <Route
        path="/"
        element={
          <LandingPage
            onLogin={() => navigate('/login')}
            onSignup={() => navigate('/signup')}
          />
        }
      />
      <Route
        path="/login"
        element={
          <AuthPage
            initialMode="login"
            onBack={() => navigate('/')}
            onToggleMode={() => navigate('/signup')}
            onLoginSuccess={() => navigate('/')}
            onForgotPassword={() => navigate('/forgot-password')}
          />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage
            onBack={() => navigate('/login')}
            onLogin={() => navigate('/login')}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <DisclaimerPage
            onBack={() => navigate('/')}
            onAccept={() => navigate('/disclaimer')}
          />
        }
      />
      <Route
        path="/disclaimer"
        element={
          <AuthPage
            initialMode="signup"
            onBack={() => navigate('/')}
            onToggleMode={() => navigate('/login')}
            onSignupSuccess={() => navigate('/health-profile')}
          />
        }
      />
      <Route
        path="/health-profile"
        element={
          <HealthProfilePage
            onBack={() => navigate('/')}
            onContinue={() => navigate('/dashboard')}
          />
        }
      />

      {/* Customer Dashboard */}
      <Route path="/dashboard" element={<CustomerDashboardLayout />}>
        <Route index element={<CustomerDashboardHome />} />
        <Route path="assessment-history" element={<AssessmentHistory />} />
        <Route path="health-reports" element={<HealthReports />} />
        <Route path="health-library" element={<HealthLibrary />} />
        <Route path="find-nearby-care" element={<div className="text-gray-600">Find Nearby Care - Coming Soon</div>} />
        <Route path="subscription" element={<div className="text-gray-600">Subscription - Coming Soon</div>} />
        <Route path="settings" element={<div className="text-gray-600">Settings - Coming Soon</div>} />
        <Route path="help" element={<div className="text-gray-600">Help Center - Coming Soon</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
