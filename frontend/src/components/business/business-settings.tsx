import { Building2, Bell, Shield, LogOut, ChevronRight, AlertCircle } from 'lucide-react'

const settingsItems = [
  {
    icon: Building2,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    title: 'Hospital Profile',
    description: 'View and update hospital information, contact details, and branding.',
    action: 'Manage',
  },
  {
    icon: Bell,
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    title: 'Notification Settings',
    description: 'Configure email, SMS, and in-app notification preferences.',
    action: 'Manage',
  },
  {
    icon: Shield,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    title: 'Security',
    description: 'Manage password, two-factor authentication, and login sessions.',
    action: 'Manage',
  },
  {
    icon: LogOut,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    title: 'Logout',
    description: 'Sign out of your account securely.',
    action: 'Logout',
    actionStyle: 'text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20',
  },
]

export const BusinessSettings = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
          Manage your hospital settings and preferences.
        </p>
      </div>

      {/* Settings Items */}
      <div className="space-y-3">
        {settingsItems.map((item) => (
          <div
            key={item.title}
            className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`px-4 py-2 border rounded-lg text-sm font-semibold transition-colors ${
                  item.actionStyle || 'border-gray-200 dark:border-[#1e2028] text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#1a1d25]'
                }`}
              >
                {item.action}
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-[#525666]" />
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gray-50 dark:bg-[#080a0e] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400 dark:text-[#525666] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-[#6b7080] leading-relaxed">
              Settings help you customize and secure your hospital account. Make sure to save your changes.
            </p>
            <p className="text-xs text-gray-400 dark:text-[#525666] mt-1">
              Last updated: October 24, 2023 at 14:32 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
