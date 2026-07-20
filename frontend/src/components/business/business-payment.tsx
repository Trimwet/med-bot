import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Building2, Lock, ShieldCheck, Info, ChevronLeft } from 'lucide-react'

type PaymentMethod = 'card' | 'bank' | 'paystack'

export const BusinessPayment = () => {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 16)
    return v.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 4)
    if (v.length >= 3) return v.slice(0, 2) + ' / ' + v.slice(2)
    return v
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Payment</h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
            Complete your payment securely to activate or renew your subscription.
          </p>
        </div>
        <button
          onClick={() => navigate('/business/dashboard/subscriptions')}
          className="flex items-center gap-2 text-sm font-semibold text-[#00A8A8] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Subscriptions
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Payment Methods */}
          <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 bg-[#073B4C] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaed]">Payment Methods</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-[#6b7080] mb-4">Choose a payment method</p>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedMethod('card')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                  selectedMethod === 'card'
                    ? 'border-[#00A8A8] bg-[#00A8A8]/5'
                    : 'border-gray-200 dark:border-[#1e2028] hover:border-gray-300 dark:hover:border-[#2a2d35]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedMethod === 'card' ? 'bg-[#00A8A8]/10 text-[#00A8A8]' : 'bg-gray-100 dark:bg-[#1a1d25] text-gray-400 dark:text-[#525666]'
                }`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">Card</p>
                  <p className="text-xs text-gray-500 dark:text-[#6b7080]">Pay securely using your debit or credit card</p>
                </div>
                {selectedMethod === 'card' && (
                  <div className="w-5 h-5 bg-[#00A8A8] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => setSelectedMethod('bank')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                  selectedMethod === 'bank'
                    ? 'border-[#00A8A8] bg-[#00A8A8]/5'
                    : 'border-gray-200 dark:border-[#1e2028] hover:border-gray-300 dark:hover:border-[#2a2d35]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedMethod === 'bank' ? 'bg-[#00A8A8]/10 text-[#00A8A8]' : 'bg-gray-100 dark:bg-[#1a1d25] text-gray-400 dark:text-[#525666]'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">Bank Transfer</p>
                  <p className="text-xs text-gray-500 dark:text-[#6b7080]">Make payment directly to our bank account</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('paystack')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                  selectedMethod === 'paystack'
                    ? 'border-[#00A8A8] bg-[#00A8A8]/5'
                    : 'border-gray-200 dark:border-[#1e2028] hover:border-gray-300 dark:hover:border-[#2a2d35]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedMethod === 'paystack' ? 'bg-[#00A8A8]/10 text-[#00A8A8]' : 'bg-gray-100 dark:bg-[#1a1d25] text-gray-400 dark:text-[#525666]'
                }`}>
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">Paystack</p>
                  <p className="text-xs text-gray-500 dark:text-[#6b7080]">Pay securely via Paystack</p>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Payment Details */}
          {selectedMethod === 'card' && (
            <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 bg-[#073B4C] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaed]">Payment Details</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-[#6b7080] mb-5">Enter your card details to complete payment</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#00A8A8]/30 focus:border-[#00A8A8] transition-colors pr-10"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#525666]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM / YY"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#00A8A8]/30 focus:border-[#00A8A8] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1.5">
                      CVV <span className="text-gray-400 dark:text-[#525666] cursor-help" title="3-digit number on the back of your card">ⓘ</span>
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#00A8A8]/30 focus:border-[#00A8A8] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#00A8A8]/30 focus:border-[#00A8A8] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod !== 'card' && (
            <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 bg-[#073B4C] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaed]">Payment Details</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-[#6b7080]">
                {selectedMethod === 'bank'
                  ? 'Bank transfer details will be provided after confirmation.'
                  : 'You will be redirected to Paystack to complete payment.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* 2. Billing Summary */}
          <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 bg-[#073B4C] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaed]">Billing Summary</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-[#6b7080] mb-4">Review your subscription and payment details</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-[#6b7080]">Plan</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-[#6b7080]">Billing Cycle</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-[#6b7080]">Amount</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">₦0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-[#6b7080]">VAT (7.5%)</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">₦0</span>
              </div>
              <div className="border-t border-gray-100 dark:border-[#1e2028] pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 dark:text-[#e8eaed]">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">₦0</span>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-[#1e2028] pt-3 mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-[#525666]">Start Date</span>
                  <span className="text-xs font-medium text-gray-600 dark:text-[#a0a4ad]">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-[#525666]">Next Renewal</span>
                  <span className="text-xs font-medium text-gray-600 dark:text-[#a0a4ad]">-</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Confirm Payment */}
          <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 bg-[#073B4C] text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaed]">Confirm Payment</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-[#6b7080] mb-4">
              By confirming, you agree to our <span className="text-[#00A8A8] cursor-pointer hover:underline">Terms and Conditions</span>
            </p>

            <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#073B4C] text-white rounded-xl text-sm font-semibold hover:bg-[#0A202A] dark:hover:bg-[#00D4D4]/20 transition-colors">
              <Lock className="w-4 h-4" />
              Confirm Payment
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400 dark:text-[#525666]" />
              <p className="text-xs text-gray-400 dark:text-[#525666]">Your payment is secure and encrypted</p>
            </div>
          </div>

          {/* Help */}
          <div className="bg-gray-50 dark:bg-[#080a0e] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-400 dark:text-[#525666] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 dark:text-[#6b7080] leading-relaxed">
                Need help? Contact our support team at{' '}
                <span className="text-[#00A8A8] font-medium">support@medbot.com</span> or call{' '}
                <span className="text-[#00A8A8] font-medium">+234 800 123 4567</span>. Payments are processed securely. Your data is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
