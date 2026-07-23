import { InfoPage } from './info-page'
import { ArrowRight, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const endpoints = [
  {
    method: 'GET',
    methodColor: 'text-emerald-400',
    path: '/api/v1/assessments',
    description: 'Retrieve all assessments with optional filters',
    params: ['patient_id', 'status', 'date_from', 'date_to'],
  },
  {
    method: 'POST',
    methodColor: 'text-blue-400',
    path: '/api/v1/assessments',
    description: 'Create a new triage assessment',
    params: ['patient_id', 'symptoms[]', 'duration', 'severity'],
  },
  {
    method: 'GET',
    methodColor: 'text-emerald-400',
    path: '/api/v1/patients',
    description: 'Retrieve patient records with pagination',
    params: ['page', 'limit', 'search'],
  },
  {
    method: 'PUT',
    methodColor: 'text-amber-400',
    path: '/api/v1/patients/:id',
    description: 'Update patient information',
    params: ['name', 'age', 'gender', 'medical_history'],
  },
  {
    method: 'DELETE',
    methodColor: 'text-red-400',
    path: '/api/v1/assessments/:id',
    description: 'Delete a specific assessment record',
    params: [],
  },
]

const CodeBlock = ({ children }: { children: string }) => {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative group">
      <pre className="bg-[#0A202A] text-gray-300 rounded-xl p-4 pr-10 text-sm font-mono overflow-x-auto">
        {children}
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

export const ApiReferencePage = () => (
  <InfoPage
    title="API Reference"
    subtitle="Integrate MedBot into your applications with our RESTful API."
    badge="API"
  >
    {/* Auth */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3 font-display">Authentication</h2>
      <p className="text-sm text-gray-500 mb-5">
        All API requests require an API key in the Authorization header.
      </p>
      <CodeBlock>{`Authorization: Bearer YOUR_API_KEY`}</CodeBlock>
    </div>

    {/* Endpoints */}
    <div className="space-y-4 mb-10">
      <h2 className="text-lg font-bold text-gray-900 font-display">Endpoints</h2>
      {endpoints.map((ep, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className={`font-mono text-sm font-bold ${ep.methodColor} w-16`}>{ep.method}</span>
            <code className="text-sm text-gray-800 font-mono bg-gray-50 px-3 py-1 rounded-lg">{ep.path}</code>
          </div>
          <div className="px-6 pb-5 border-t border-gray-50 pt-4">
            <p className="text-sm text-gray-600 mb-3">{ep.description}</p>
            {ep.params.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ep.params.map((p) => (
                  <span key={p} className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{p}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Rate Limits */}
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-4 font-display">Rate Limits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { plan: 'Free', limit: '100 req/day' },
          { plan: 'Pro', limit: '10,000 req/day' },
          { plan: 'Enterprise', limit: 'Unlimited' },
        ].map((tier) => (
          <div key={tier.plan} className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="font-semibold text-gray-900">{tier.plan}</p>
            <p className="text-sm text-[#00A8A8] font-mono mt-1">{tier.limit}</p>
          </div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="bg-gradient-to-r from-[#073B4C] to-[#0A202A] rounded-2xl p-8 md:p-10 text-center">
      <h2 className="text-xl font-bold text-white mb-2 font-display">Ready to build?</h2>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Get your API key and start integrating MedBot today.
      </p>
      <a
        href="/support"
        className="inline-flex items-center gap-2 bg-[#00A8A8] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#00A8A8]/90 transition-colors"
      >
        Get API Key <ArrowRight size={16} />
      </a>
    </div>
  </InfoPage>
)
