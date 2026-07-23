import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'
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
import { DemoAccessGuard, DemoAssessmentLock } from '@/pages/demo'
import { hasDemoSession, getDemoStatus, startDemo } from '@/lib/demo-session'
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
import { AdminLogin } from '@/components/admin/admin-login'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminOverview } from '@/components/admin/admin-overview'
import { AdminTenants } from '@/components/admin/admin-tenants'
import { AdminUsers } from '@/components/admin/admin-users'
import { AdminAnalytics } from '@/components/admin/admin-analytics'
import { AdminPartners } from '@/components/admin/admin-partners'
import { AdminSettings } from '@/components/admin/admin-settings'
import { AboutUsPage } from '@/pages/info/about-us'
import { OurTeamPage } from '@/pages/info/our-team'
import { CareersPage } from '@/pages/info/careers'
import { DocumentationPage } from '@/pages/info/documentation'
import { ClinicalProtocolsPage } from '@/pages/info/clinical-protocols'
import { ApiReferencePage } from '@/pages/info/api-reference'
import { SupportPage } from '@/pages/info/support'
import { PrivacyPolicyPage } from '@/pages/info/privacy-policy'
import { TermsOfServicePage } from '@/pages/info/terms-of-service'
import { HipaaCompliancePage } from '@/pages/info/hipaa-compliance'
import { SecurityPage } from '@/pages/info/security'

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()

  // Apply stored theme on mount
  useEffect(() => {
    const stored = localStorage.getItem('medbot-theme') as 'light' | 'dark' | 'system' | null
    const theme = stored || 'light'
    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useLayoutEffect(() => {
    const params = new URLSearchParams(location.hash.slice(1))
    const token = params.get('token')
    if (token) {
      localStorage.setItem('token', token)
      const cleanUrl = location.pathname + location.search
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [location])

  const requestDemo = async () => {
    try {
      if (hasDemoSession()) await getDemoStatus()
      else await startDemo()
      navigate('/demo')
    } catch {
      // A stale stored credential cannot be resumed; create a fresh demo for this browser.
      try { await startDemo(); navigate('/demo') } catch { navigate('/demo') }
    }
  }

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
            onRequestDemo={requestDemo}
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
            onLoginSuccess={() => navigate('/dashboard')}
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

      {/* Anonymous temporary demo */}
      <Route path="/demo" element={<DemoAccessGuard />}>
        <Route element={<CustomerDashboardLayout demo />}>
          <Route index element={<CustomerDashboardHome demo />} />
          <Route path="health-library" element={<HealthLibrary />} />
          <Route path="assessment-history" element={<DemoAssessmentLock />} />
        </Route>
      </Route>

      {/* Business Partner Routes */}
      <Route
        path="/business/login"
        element={
          <BusinessLogin
            onBack={() => navigate('/')}
            onSignup={() => navigate('/business/signup')}
            onLoginSuccess={(token) => {
              localStorage.setItem('token', token)
              navigate('/business/dashboard')
            }}
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
            onSignupSuccess={(token) => {
              localStorage.setItem('token', token)
              navigate('/business/dashboard')
            }}
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

      {/* Super Admin Routes */}
      <Route
        path="/admin/login"
        element={
          <AdminLogin
            onBack={() => navigate('/')}
          />
        }
      />
      <Route path="/admin/dashboard" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="tenants" element={<AdminTenants />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="partners" element={<AdminPartners />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Info Pages */}
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/team" element={<OurTeamPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/docs" element={<DocumentationPage />} />
      <Route path="/clinical-protocols" element={<ClinicalProtocolsPage />} />
      <Route path="/api" element={<ApiReferencePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/hipaa" element={<HipaaCompliancePage />} />
      <Route path="/security" element={<SecurityPage />} />

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
