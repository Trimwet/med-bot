import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
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
import { CustomerSettings } from '@/components/customer/customer-settings'
import { BusinessLogin } from '@/components/business/business-login'
import { BusinessSignup } from '@/components/business/business-signup'
import { BusinessDashboardLayout } from '@/components/business/business-dashboard-layout'
import { BusinessDashboardHome } from '@/components/business/business-dashboard-home'
import { BusinessAnalytics } from '@/components/business/business-analytics'
import { PatientInsights } from '@/components/business/patient-insights'
import { BusinessReports } from '@/components/business/business-reports'
import { BusinessSubscription } from '@/components/business/business-subscription'
import { BusinessSettings } from '@/components/business/business-settings'
import { StaffManagement } from '@/components/business/staff-management'
import { BusinessPayment } from '@/components/business/business-payment'
import { ProtocolAdmin } from '@/components/admin/protocol-admin'

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.hash.slice(1))
    const token = params.get('token')
    if (token) {
      localStorage.setItem('token', token)
      const cleanUrl = location.pathname + location.search
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [location])

  return (
    <Routes>
      {/* Landing & Auth */}
      <Route
        path="/"
        element={
          <LandingPage
            onLogin={() => navigate('/login')}
            onSignup={() => navigate('/signup')}
            onPartners={() => navigate('/business/login')}
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
        <Route path="subscription" element={<div className="text-gray-600">Subscription - Coming Soon</div>} />
        {/* chat-history merged into Chat Assessments (assessment-history) */}
        <Route path="chat-history" element={<Navigate to="/dashboard/assessment-history" replace />} />
        <Route path="settings" element={<CustomerSettings />} />
        <Route path="help" element={<div className="text-gray-600">Help Center - Coming Soon</div>} />
      </Route>

      {/* Business Partner Routes */}
      <Route
        path="/business/login"
        element={
          <BusinessLogin
            onBack={() => navigate('/')}
            onSignup={() => navigate('/business/signup')}
            onLoginSuccess={() => navigate('/business/dashboard')}
            onForgotPassword={() => navigate('/forgot-password')}
          />
        }
      />
      <Route
        path="/business/signup"
        element={
          <BusinessSignup
            onBack={() => navigate('/')}
            onLogin={() => navigate('/business/login')}
            onSignupSuccess={() => navigate('/business/login')}
          />
        }
      />

      {/* Business Dashboard */}
      <Route path="/business/dashboard" element={<BusinessDashboardLayout />}>
        <Route index element={<BusinessDashboardHome />} />
        <Route path="assessments" element={<BusinessAnalytics />} />
        <Route path="patient-insights" element={<PatientInsights />} />
        <Route path="reports" element={<BusinessReports />} />
        <Route path="subscriptions" element={<BusinessSubscription />} />
        <Route path="settings" element={<BusinessSettings />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="payment" element={<BusinessPayment />} />
        <Route path="protocols" element={<ProtocolAdmin />} />
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
