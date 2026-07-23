import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DisclaimerPageProps {
  onBack?: () => void
  onAccept?: () => void
}

export const DisclaimerPage = ({ onBack, onAccept }: DisclaimerPageProps) => {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="min-h-screen bg-[#F4F5FA] flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl border border-line shadow-sm px-8 py-10 relative">
            {/* Back button */}
            <button
              onClick={onBack}
              className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors group"
            >
              <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
            {/* Logo */}
            <div className="flex flex-col items-center pt-4">
              <div className="w-18 h-18 rounded-xl bg-teal flex items-center justify-center text-white font-extrabold text-lg font-display mb-4">
                <img src="/assets/Logo.jpeg" alt="MedBot Logo" />
              </div>
              <span className="text-xs text-muted font-medium tracking-wide">MedBot AI Assistant</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-ink text-center mb-6 font-display">
              Medical Disclaimer
            </h1>

            {/* Divider */}
            <div className="flex justify-center mb-6">
              <img src="/assets/contract-signed.svg" alt="" className="w-12 h-auto" />
            </div>

            {/* Content */}
            <div className="space-y-5 text-sm leading-relaxed text-muted">
              <p className="font-semibold text-ink text-base">
                Please read this carefully before using MedBot.
              </p>

              <p>
                MedBot provides AI-powered health information based on the symptoms
                you describe. It uses advanced language models to cross-reference medical
                databases, but it operates without the physical presence or contextual
                nuance of a qualified professional.
              </p>

              <p className="font-medium text-ink">
                It is not intended to replace professional medical advice, diagnosis, or
                treatment.
              </p>

              <p>
                Always seek the advice of your physician or other qualified health provider
                with any questions you may have regarding a medical condition. Never
                disregard professional medical advice or delay in seeking it because of
                something you have read on this platform.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-line my-8" />

            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer mb-6 group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="size-5 rounded-md border border-line peer-checked:bg-teal peer-checked:border-teal transition-all flex items-center justify-center">
                  {agreed && (
                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-muted group-hover:text-ink transition-colors">
                I understand this is not a diagnosis.
              </span>
            </label>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={onAccept}
                disabled={!agreed}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all font-display ${
                  agreed
                    ? 'bg-[#0A202A] text-white hover:bg-[#0A202A]/80'
                    : 'bg-muted/20 text-muted/50 cursor-not-allowed'
                }`}
              >
                ACCEPT & CONTINUE
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted/50 mt-8">
            © 2026 MedBot AI. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  )
}
