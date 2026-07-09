import React, { useState } from 'react'
import { FileText, ChevronLeft, ChevronRight, Info } from 'lucide-react'

interface DisclaimerPageProps {
  onBack?: () => void
  onAccept?: () => void
}

export const DisclaimerPage = ({ onBack, onAccept }: DisclaimerPageProps) => {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="min-h-screen bg-[#F4F5FA] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-line px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-teal flex items-center justify-center text-white font-extrabold text-xs">
            M
          </div>
          <span className="text-ink font-bold text-sm font-display">MedBot</span>
        </div>
        <button className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-muted hover:text-ink hover:border-ink/30 transition-colors">
          <Info className="size-3.5" />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl border border-line shadow-sm px-8 py-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-teal flex items-center justify-center mb-3">
                <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                  <rect x="6" y="8" width="20" height="16" rx="4" fill="white" />
                  <rect x="10" y="12" width="4" height="4" rx="1" fill="#0A202A" />
                  <rect x="18" y="12" width="4" height="4" rx="1" fill="#0A202A" />
                  <path d="M12 18 Q16 21 20 18" stroke="#0A202A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <rect x="14" y="4" width="4" height="4" rx="2" fill="#0A202A" />
                  <line x1="16" y1="8" x2="16" y2="10" stroke="#0A202A" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-xs text-muted font-medium tracking-wide">MedBot AI Assistant</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-ink text-center mb-6 font-display">
              Medical Disclaimer
            </h1>

            {/* Divider */}
            <div className="flex justify-center mb-6">
              <div className="w-10 h-10 rounded-full bg-paper-soft flex items-center justify-center">
                <FileText className="size-5 text-muted" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-5 text-sm leading-relaxed text-muted">
              <p className="font-semibold text-ink text-base">
                Please read this carefully before using MediChat.
              </p>

              <p>
                MediChat provides AI-powered health information based on the symptoms
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
              <button
                onClick={onBack}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm border border-line text-muted hover:text-ink hover:border-ink/30 transition-all font-display"
              >
                <ChevronLeft className="size-4" />
                BACK
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
