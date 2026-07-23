import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Building2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const b2cPlans = [
  {
    name: 'Free',
    desc: 'For personal use',
    monthlyPrice: '₦0',
    yearlyPrice: '₦0',
    monthlyPeriod: '/month',
    yearlyPeriod: '/year',
    highlight: false,
    features: [
      { text: 'Limited checks/month', included: true },
      { text: 'Symptom assessment', included: true },
      { text: 'Basic triage scoring', included: true },
      { text: 'Saved history', included: false },
      { text: 'Medication reminders', included: false },
      { text: 'Health tips', included: false },
      { text: 'Priority response', included: false },
      { text: 'Export health summary', included: false },
    ],
  },
  {
    name: 'Plus',
    desc: 'For individuals',
    monthlyPrice: '₦1,500–₦2,500',
    yearlyPrice: '₦15,000–₦25,000',
    monthlyPeriod: '/month',
    yearlyPeriod: '/year',
    highlight: true,
    features: [
      { text: 'Unlimited checks', included: true },
      { text: 'Symptom assessment', included: true },
      { text: 'Advanced triage scoring', included: true },
      { text: 'Saved history', included: true },
      { text: 'Medication reminders', included: true },
      { text: 'Health tips', included: true },
      { text: 'Priority response', included: false },
      { text: 'Export health summary', included: false },
    ],
  },
  {
    name: 'Family',
    desc: 'For families',
    monthlyPrice: '₦3,500–₦5,000',
    yearlyPrice: '₦35,000–₦50,000',
    monthlyPeriod: '/month',
    yearlyPeriod: '/year',
    highlight: false,
    features: [
      { text: 'Unlimited checks', included: true },
      { text: 'Symptom assessment', included: true },
      { text: 'Advanced triage scoring', included: true },
      { text: 'Saved history', included: true },
      { text: 'Medication reminders', included: true },
      { text: 'Health tips', included: true },
      { text: 'Priority response', included: true },
      { text: 'Export health summary', included: true },
    ],
  },
]

const b2bModels = [
  {
    name: 'Per-User/Month',
    desc: 'PUPM pricing',
    price: '₦150–₦400',
    period: '/enrolled member/month',
    description: 'Billed to the institution',
    typicalFit: 'HMOs, large employers with hundreds/thousands of covered lives',
    features: [
      { text: 'Scalable per-member pricing', included: true },
      { text: 'Institutional billing', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom branding', included: true },
    ],
  },
  {
    name: 'Flat Institutional License',
    desc: 'Annual license',
    price: '₦150K–₦1M+',
    period: '/year',
    description: 'Unlimited internal use',
    typicalFit: 'Single hospital or clinic',
    features: [
      { text: 'Unlimited internal use', included: true },
      { text: 'No per-user fees', included: true },
      { text: 'Full feature access', included: true },
      { text: 'Custom triage protocols', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Training & onboarding', included: true },
    ],
  },
  {
    name: 'Per-API-Call',
    desc: 'Usage-based',
    price: '₦20–₦50',
    period: '/session',
    description: 'Pay for actual usage',
    typicalFit: 'Pharmacies, smaller clinics, integrators',
    features: [
      { text: 'Pay per triage session', included: true },
      { text: 'No upfront commitment', included: true },
      { text: 'Real-time usage tracking', included: true },
      { text: 'REST API access', included: true },
      { text: 'Webhook integrations', included: true },
      { text: 'Developer documentation', included: true },
    ],
  },
  {
    name: 'Revenue Share',
    desc: 'Partnership model',
    price: '% of consultations',
    period: '/referrals',
    description: 'MedBot drives paid referrals',
    typicalFit: 'HMOs/hospitals where MedBot drives paid referrals',
    features: [
      { text: 'No upfront costs', included: true },
      { text: 'Performance-based', included: true },
      { text: 'Referral tracking', included: true },
      { text: 'Joint marketing', included: true },
      { text: 'Dedicated partner manager', included: true },
      { text: 'Custom integration', included: true },
    ],
  },
]

export const PricingSection = () => {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [activeTab, setActiveTab] = useState<'b2c' | 'b2b'>('b2c')

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-4 font-display">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Start triaging patients in minutes. Scale as your needs grow.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('b2c')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === 'b2c'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              )}
            >
              <User className="w-4 h-4" />
              Individual
            </button>
            <button
              onClick={() => setActiveTab('b2b')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === 'b2b'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              )}
            >
              <Building2 className="w-4 h-4" />
              Business
            </button>
          </div>
        </div>

        {/* B2C Pricing */}
        {activeTab === 'b2c' && (
          <>
            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-4">
                <span className={cn('text-sm font-medium', billingCycle === 'monthly' ? 'text-ink' : 'text-muted')}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors',
                    billingCycle === 'yearly' ? 'bg-teal' : 'bg-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                      billingCycle === 'yearly' ? 'left-7' : 'left-1'
                    )}
                  />
                </button>
                <span className={cn('text-sm font-medium', billingCycle === 'yearly' ? 'text-ink' : 'text-muted')}>
                  Yearly
                  <span className="ml-1.5 text-xs text-teal font-semibold">≈2 months free</span>
                </span>
              </div>
            </div>

            {/* B2C Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {b2cPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    'relative flex flex-col p-8 rounded-xl border transition-all duration-300',
                    plan.highlight
                      ? 'bg-[#0A202A] text-white border-[#0A202A] shadow-xl shadow-[#0A202A]/10 scale-[1.02]'
                      : 'bg-white border-line hover:border-teal/30'
                  )}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  )}

                  <div className="mb-6">
                    <h3 className={cn('text-xl font-bold mb-1 font-display', plan.highlight ? 'text-white' : 'text-ink')}>
                      {plan.name}
                    </h3>
                    <p className={cn('text-sm', plan.highlight ? 'text-[#9CA3AF]' : 'text-muted')}>
                      {plan.desc}
                    </p>
                  </div>

                  <div className="mb-8">
                    <span className={cn('text-4xl font-bold tracking-tight font-display', plan.highlight ? 'text-white' : 'text-ink')}>
                      {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className={cn('text-sm ml-1', plan.highlight ? 'text-[#9CA3AF]/70' : 'text-muted')}>
                      {billingCycle === 'monthly' ? plan.monthlyPeriod : plan.yearlyPeriod}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className={cn('size-4 mt-0.5 shrink-0', plan.highlight ? 'text-teal' : 'text-teal')} />
                        ) : (
                          <X className={cn('size-4 mt-0.5 shrink-0', plan.highlight ? 'text-[#9CA3AF]/30' : 'text-neutral-300')} />
                        )}
                        <span className={cn('text-sm', plan.highlight ? (feature.included ? 'text-white/80' : 'text-[#9CA3AF]/40') : (feature.included ? 'text-ink' : 'text-neutral-300'))}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate('/signup')}
                    className={cn(
                      'w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 font-display',
                      plan.highlight
                        ? 'bg-white text-[#0A202A] hover:bg-white/90'
                        : 'bg-teal text-white hover:bg-teal/80'
                    )}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* B2B Pricing */}
        {activeTab === 'b2b' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {b2bModels.map((model) => (
              <div
                key={model.name}
                className="flex flex-col p-6 rounded-xl border border-line bg-white hover:border-teal/30 transition-all duration-300"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-ink mb-1 font-display">
                    {model.name}
                  </h3>
                  <p className="text-sm text-muted">
                    {model.desc}
                  </p>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold tracking-tight text-ink font-display">
                    {model.price}
                  </span>
                  <span className="text-sm text-muted ml-1">
                    {model.period}
                  </span>
                  <p className="text-xs text-muted mt-1">
                    {model.description}
                  </p>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-muted">
                    <span className="font-medium text-ink">Typical fit:</span> {model.typicalFit}
                  </p>
                </div>

                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {model.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="size-3.5 mt-0.5 shrink-0 text-teal" />
                      <span className="text-xs text-ink">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => window.location.href = 'mailto:sales@medbot.health'}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 font-display bg-teal text-white hover:bg-teal/80"
                >
                  Contact Sales
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
