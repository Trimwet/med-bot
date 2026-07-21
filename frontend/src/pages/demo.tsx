import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { ApiError } from '@/lib/api'
import { getDemoStatus, hasDemoSession } from '@/lib/demo-session'

export const DemoAccessGuard = () => {
  const navigate = useNavigate()
  const [state, setState] = useState<'loading' | 'missing' | 'invalid' | 'ready'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!hasDemoSession()) { setState('missing'); return }
    getDemoStatus().then(() => setState('ready')).catch((err) => {
      setMessage(err instanceof Error ? err.message : 'Unable to restore temporary session')
      setState(err instanceof ApiError && err.code === 'DEMO_TOKEN_MISSING' ? 'missing' : 'invalid')
    })
  }, [])

  if (state === 'ready') return <Outlet />
  if (state === 'loading') return <div className="min-h-dvh grid place-items-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
  const missing = state === 'missing'
  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-[#0a0c10] grid place-items-center px-5">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1117] p-7 text-center shadow-sm">
        <AlertCircle className="w-9 h-9 mx-auto text-[#073B4C] dark:text-teal mb-4" />
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{missing ? 'Temporary session token not found' : 'Demo session unavailable'}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{missing ? 'This demo is tied to the browser where it was started. Request a new demo from the homepage to continue.' : message}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-[#073B4C] text-white text-sm font-medium">Return home</button>
          <Link to="/login" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium">Log in</Link>
          <Link to="/signup" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export const DemoAssessmentLock = () => (
  <div className="flex-1 grid place-items-center bg-white dark:bg-[#0a0c10] p-6">
    <div className="max-w-md text-center">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chat Assessments are available with an account</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Create a free account to save assessments and access your health history.</p>
      <div className="mt-5 flex justify-center gap-3"><Link to="/signup" className="px-4 py-2 rounded-lg bg-[#073B4C] text-white text-sm font-medium">Sign up</Link><Link to="/login" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium">Log in</Link></div>
    </div>
  </div>
)
