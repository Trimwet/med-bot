import React from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Starter',
    desc: 'For small clinics',
    price: '₦49,000',
    period: '/month',
    highlight: false,
    features: [
      { text: 'Up to 200 patients/month', included: true },
      { text: 'Chat-based triage', included: true },
      { text: 'Basic acuity scoring', included: true },
      { text: 'Single location', included: true },
      { text: 'Email support', included: true },
      { text: 'Phone triage', included: false },
      { text: 'Custom branding', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Growth',
    desc: 'For expanding hospitals',
    price: '₦149,000',
    period: '/month',
    highlight: true,
    features: [
      { text: 'Up to 2,000 patients/month', included: true },
      { text: 'Chat + voice triage', included: true },
      { text: 'Advanced acuity scoring', included: true },
      { text: 'Up to 5 locations', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Clinical dashboard', included: true },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Enterprise',
    desc: 'For hospital networks',
    price: 'Custom',
    period: '',
    highlight: false,
    features: [
      { text: 'Unlimited patients', included: true },
      { text: 'Chat + voice + video', included: true },
      { text: 'Custom triage protocols', included: true },
      { text: 'Unlimited locations', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Full API access', included: true },
      { text: 'HIPAA BAA', included: true },
    ],
  },
]

export const PricingSection = () => {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex px-4 py-1.5 text-xs font-semibold border border-teal/40 rounded-full text-teal uppercase tracking-[0.2em] bg-teal/10 mb-6">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-4 font-display">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Start triaging patients in minutes. Scale as your hospital grows.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
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
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={cn('text-sm ml-1', plan.highlight ? 'text-[#9CA3AF]/70' : 'text-muted')}>
                    {plan.period}
                  </span>
                )}
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
                className={cn(
                  'w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 font-display',
                  plan.highlight
                    ? 'bg-white text-[#0A202A] hover:bg-white/90'
                    : 'bg-teal text-white hover:bg-teal/80'
                )}
              >
                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
