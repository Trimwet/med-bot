import React from 'react'
import { Check, X, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  { category: 'Triage', name: 'Symptom intake' },
  { category: 'Triage', name: 'Chat-based triage' },
  { category: 'Triage', name: 'Voice triage' },
  { category: 'Triage', name: 'Video triage' },
  { category: 'Triage', name: 'Custom protocols' },
  { category: 'Scoring', name: 'Basic acuity' },
  { category: 'Scoring', name: 'Advanced acuity' },
  { category: 'Scoring', name: 'Custom scoring models' },
  { category: 'Platform', name: 'Clinical dashboard' },
  { category: 'Platform', name: 'Multi-location' },
  { category: 'Platform', name: 'Custom branding' },
  { category: 'Platform', name: 'API access' },
  { category: 'Support', name: 'Email support' },
  { category: 'Support', name: 'Priority support' },
  { category: 'Support', name: 'Dedicated account manager' },
  { category: 'Compliance', name: 'HIPAA compliant' },
  { category: 'Compliance', name: 'HIPAA BAA' },
  { category: 'Compliance', name: 'SOC 2' },
]

const plans = ['Starter', 'Growth', 'Enterprise']

const planValues: Record<string, Record<string, boolean | null>> = {
  Starter: {
    'Symptom intake': true,
    'Chat-based triage': true,
    'Voice triage': false,
    'Video triage': false,
    'Custom protocols': false,
    'Basic acuity': true,
    'Advanced acuity': false,
    'Custom scoring models': false,
    'Clinical dashboard': false,
    'Multi-location': false,
    'Custom branding': false,
    'API access': false,
    'Email support': true,
    'Priority support': false,
    'Dedicated account manager': false,
    'HIPAA compliant': true,
    'HIPAA BAA': false,
    'SOC 2': false,
  },
  Growth: {
    'Symptom intake': true,
    'Chat-based triage': true,
    'Voice triage': true,
    'Video triage': false,
    'Custom protocols': false,
    'Basic acuity': true,
    'Advanced acuity': true,
    'Custom scoring models': false,
    'Clinical dashboard': true,
    'Multi-location': true,
    'Custom branding': true,
    'API access': false,
    'Email support': true,
    'Priority support': true,
    'Dedicated account manager': false,
    'HIPAA compliant': true,
    'HIPAA BAA': false,
    'SOC 2': false,
  },
  Enterprise: {
    'Symptom intake': true,
    'Chat-based triage': true,
    'Voice triage': true,
    'Video triage': true,
    'Custom protocols': true,
    'Basic acuity': true,
    'Advanced acuity': true,
    'Custom scoring models': true,
    'Clinical dashboard': true,
    'Multi-location': true,
    'Custom branding': true,
    'API access': true,
    'Email support': true,
    'Priority support': true,
    'Dedicated account manager': true,
    'HIPAA compliant': true,
    'HIPAA BAA': true,
    'SOC 2': true,
  },
}

const CheckIcon = ({ included }: { included: boolean }) => {
  if (included === null) return <Minus className="size-4 text-neutral-300" />
  return included ? (
    <Check className="size-4 text-green" />
  ) : (
    <X className="size-4 text-neutral-300" />
  )
}

export const CompareSection = () => {
  const categories = [...new Set(features.map((f) => f.category))]

  return (
    <section className="py-24 px-6 bg-paper-soft relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex px-4 py-1.5 text-xs font-semibold border border-navy/20 rounded-full text-navy uppercase tracking-[0.2em] bg-navy/5 mb-6">
            Compare Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-4 font-display">
            See what's included
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Every plan includes the essentials. Upgrade for advanced features.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-line shadow-sm overflow-x-auto">
          <div className="min-w-[600px]">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_repeat(3,120px)] border-b border-line bg-paper-soft">
            <div className="p-5" />
            {plans.map((plan, i) => (
              <div
                key={plan}
                className={cn(
                  'p-5 text-center font-semibold text-sm font-display',
                  i === 1 ? 'bg-navy text-white' : 'text-ink'
                )}
              >
                {plan}
              </div>
            ))}
          </div>

          {/* Table body */}
          {categories.map((category) => (
            <div key={category}>
              <div className="grid grid-cols-[1fr_repeat(3,120px)] border-b border-line">
                <div className="p-4 px-5 text-sm font-semibold text-navy uppercase tracking-wider bg-paper-soft/50">
                  {category}
                </div>
                {plans.map((plan) => (
                  <div key={plan} className="border-l border-line" />
                ))}
              </div>
              {features
                .filter((f) => f.category === category)
                .map((feature, fi) => (
                  <div
                    key={feature.name}
                    className={cn(
                      'grid grid-cols-[1fr_repeat(3,120px)] border-b border-line last:border-b-0',
                      fi % 2 === 0 ? 'bg-white' : 'bg-paper-soft/30'
                    )}
                  >
                    <div className="p-4 px-5 text-sm text-ink flex items-center">
                      {feature.name}
                    </div>
                    {plans.map((plan) => (
                      <div
                        key={plan}
                        className="p-4 flex items-center justify-center border-l border-line"
                      >
                        <CheckIcon included={planValues[plan][feature.name]} />
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}