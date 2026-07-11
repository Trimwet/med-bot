import { Check, Info, Download, AlertCircle } from 'lucide-react'

const freeFeatures = [
  'AI Symptom Assessment',
  'Basic Health Reports',
  'Health Library Access',
  'Find Nearby Care',
  'Priority Support',
]

const premiumFeatures = [
  'Everything in Free',
  'Unlimited Assessments',
  'Advanced Health Reports',
  'Priority Support',
  'Premium AI Features',
]

const paymentHistory = [
  { date: 'May 20, 2026', plan: 'Premium Monthly', amount: '₦20,000', status: 'Paid' },
  { date: 'Apr 20, 2026', plan: 'Premium Monthly', amount: '₦20,000', status: 'Paid' },
  { date: 'Mar 20, 2026', plan: 'Premium Monthly', amount: '₦20,000', status: 'Paid' },
]

const invoices = [
  { id: 'INV-2026-05-0005', date: 'May 20, 2026', plan: 'Premium Monthly', amount: '₦20,000', status: 'Paid' },
  { id: 'INV-2026-04-0004', date: 'Apr 20, 2026', plan: 'Premium Monthly', amount: '₦20,000', status: 'Paid' },
]

export const BusinessSubscription = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Subscription</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose the plan that fits your needs and manage your subscription details.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Free Plan</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">₦0</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
          </div>
          <div className="space-y-3 mb-6">
            {freeFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{f}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-[#073B4C] p-6 relative">
          <span className="absolute -top-3 right-4 bg-[#073B4C] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Recommended
          </span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Premium Plan</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">₦20,000</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
          </div>
          <div className="space-y-3 mb-6">
            {premiumFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{f}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Status & Upgrade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Enjoying MedBot? Upgrade to Premium for advanced features and priority support.</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors flex-shrink-0">
            Upgrade Now
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">Plan Status</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">No active renewal</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Upgrade to unlock full features</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-full">FREE</span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Payment History</h3>
          <button className="text-sm font-semibold text-[#073B4C] hover:underline">Export CSV</button>
        </div>

        <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_0.8fr_1fr] gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          <span>Date</span>
          <span>Plan</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Invoice</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {paymentHistory.map((p, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_0.8fr_1fr] gap-2 sm:gap-4 px-5 py-4 items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300">{p.date}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{p.plan}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.amount}</span>
              <span className="text-sm text-green-600 font-medium">{p.status}</span>
              <button className="text-sm text-[#073B4C] font-semibold hover:underline text-left">
                View Invoice ↗
              </button>
            </div>
          ))}
        </div>

        <div className="text-center py-3 border-t border-gray-100 dark:border-gray-700">
          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">View Older Payments</button>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Invoices</h3>
        </div>

        <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          <span>Invoice #</span>
          <span>Date</span>
          <span>Plan</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {invoices.map((inv, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-2 sm:gap-4 px-5 py-4 items-center">
              <span className="text-sm text-[#073B4C] font-medium">{inv.id}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{inv.date}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{inv.plan}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{inv.amount}</span>
              <span className="text-sm text-green-600 font-medium">{inv.status}</span>
              <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 self-start sm:self-center">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Subscriptions renew automatically. You can cancel anytime from Settings.
          </p>
        </div>
      </div>
    </div>
  )
}
