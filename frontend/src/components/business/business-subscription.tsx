import { Check, Download, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const freeFeatures: string[] = []
const premiumFeatures: string[] = []
const paymentHistory: any[] = []
const invoices: any[] = []

function FeatureRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-[#073B4C]/10 dark:bg-[#00D4D4]/10 flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 text-[#073B4C] dark:text-[#00D4D4]" strokeWidth={3} />
      </div>
      <span className="text-sm text-gray-600 dark:text-[#a0a4ad]">{label}</span>
    </div>
  )
}

export const BusinessSubscription = () => {
  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Subscription</h1>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
          Choose the plan that fits your needs and manage your subscription details.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {/* Free Plan */}
        <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-200 dark:border-[#1e2028] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed]">Free</h3>
            <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-gray-100 dark:bg-[#1a1d25] text-gray-500 dark:text-[#6b7080]">
              Current
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-4xl font-bold text-gray-900 dark:text-[#e8eaed]">₦0</span>
            <span className="text-sm text-gray-500 dark:text-[#6b7080]">/month</span>
          </div>
          <div className="space-y-3.5 mb-7 flex-1">
            {freeFeatures.map((f) => (
              <FeatureRow key={f} label={f} />
            ))}
          </div>
          <button
            disabled
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-gray-400 dark:text-[#525666] bg-gray-100 dark:bg-[#1a1d25] cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="relative bg-white dark:bg-[#0f1117] rounded-2xl border border-[#073B4C] dark:border-[#00D4D4]/40 p-6 flex flex-col shadow-lg shadow-[#073B4C]/10 dark:shadow-[#00D4D4]/10">
          <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#073B4C] dark:bg-[#00D4D4] text-white dark:text-[#073B4C] text-[10px] font-bold uppercase tracking-wider">
            Most Popular
          </div>
          <div className="flex items-center justify-between mb-1 mt-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed]">Premium</h3>
            <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-[#073B4C]/10 dark:bg-[#00D4D4]/10 text-[#073B4C] dark:text-[#00D4D4]">
              ₦20k/mo
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-4xl font-bold text-gray-900 dark:text-[#e8eaed]">₦20,000</span>
            <span className="text-sm text-gray-500 dark:text-[#6b7080]">/month</span>
          </div>
          <div className="space-y-3.5 mb-7 flex-1">
            {premiumFeatures.map((f) => (
              <FeatureRow key={f} label={f} />
            ))}
          </div>
          <button
            onClick={() => navigate('/business/dashboard/payment')}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#073B4C] dark:bg-[#00D4D4] dark:text-[#073B4C] hover:bg-[#0A202A] dark:hover:bg-[#00C4C4] transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Plan Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <p className="text-xs text-gray-400 dark:text-[#525666] uppercase font-semibold tracking-wider">Current Plan</p>
          <p className="text-lg font-bold text-gray-900 dark:text-[#e8eaed] mt-2">Free</p>
        </div>
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <p className="text-xs text-gray-400 dark:text-[#525666] uppercase font-semibold tracking-wider">Renewal</p>
          <p className="text-lg font-bold text-gray-900 dark:text-[#e8eaed] mt-2">No active renewal</p>
        </div>
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <p className="text-xs text-gray-400 dark:text-[#525666] uppercase font-semibold tracking-wider">Premium Price</p>
          <p className="text-lg font-bold text-gray-900 dark:text-[#e8eaed] mt-2">₦20,000<span className="text-sm font-normal text-gray-500 dark:text-[#6b7080]">/mo</span></p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#1e2028]">
          <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Payment History</h3>
          <button className="text-sm font-semibold text-[#073B4C] dark:text-[#00D4D4] hover:underline">Export CSV</button>
        </div>

        <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_0.8fr_1fr] gap-4 px-5 py-3 border-b border-gray-100 dark:border-[#1e2028] text-xs font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">
          <span>Date</span>
          <span>Plan</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Invoice</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-[#1e2028]">
          {paymentHistory.map((p, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_0.8fr_1fr] gap-2 sm:gap-4 px-5 py-4 items-center">
              <span className="text-sm text-gray-600 dark:text-[#a0a4ad]">{p.date}</span>
              <span className="text-sm text-gray-500 dark:text-[#6b7080]">{p.plan}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">{p.amount}</span>
              <span className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#073B4C] dark:text-[#00D4D4]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#073B4C] dark:bg-[#00D4D4]" />
                {p.status}
              </span>
              <button className="text-sm text-[#073B4C] dark:text-[#00D4D4] font-semibold hover:underline text-left">
                View Invoice ↗
              </button>
            </div>
          ))}
        </div>

        <div className="text-center py-3 border-t border-gray-100 dark:border-[#1e2028]">
          <button className="text-sm text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#a0a4ad]">View Older Payments</button>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028]">
        <div className="p-5 border-b border-gray-100 dark:border-[#1e2028]">
          <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Invoices</h3>
        </div>

        <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-4 px-5 py-3 border-b border-gray-100 dark:border-[#1e2028] text-xs font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">
          <span>Invoice #</span>
          <span>Date</span>
          <span>Plan</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-[#1e2028]">
          {invoices.map((inv, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-2 sm:gap-4 px-5 py-4 items-center">
              <span className="text-sm text-[#073B4C] dark:text-[#00D4D4] font-medium">{inv.id}</span>
              <span className="text-sm text-gray-500 dark:text-[#6b7080]">{inv.date}</span>
              <span className="text-sm text-gray-500 dark:text-[#6b7080]">{inv.plan}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">{inv.amount}</span>
              <span className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#073B4C] dark:text-[#00D4D4]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#073B4C] dark:bg-[#00D4D4]" />
                {inv.status}
              </span>
              <button className="p-2 text-gray-400 dark:text-[#525666] hover:text-[#073B4C] dark:hover:text-[#00D4D4] self-start sm:self-center transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 dark:bg-[#080a0e] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400 dark:text-[#525666] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 dark:text-[#6b7080] leading-relaxed">
            Subscriptions renew automatically. You can cancel anytime from Settings.
          </p>
        </div>
      </div>
    </div>
  )
}
