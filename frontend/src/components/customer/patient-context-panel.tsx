import {
  Heart,
  Thermometer,
  Droplets,
  Weight,
  Ruler,
  Activity,
  Pill,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { useState } from 'react'

const vitals = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, trend: 'stable', color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, trend: 'stable', color: 'text-teal', bg: 'bg-teal/10' },
  { label: 'Temperature', value: '98.6', unit: '\u00b0F', icon: Thermometer, trend: 'stable', color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'SpO2', value: '98', unit: '%', icon: Droplets, trend: 'stable', color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Weight', value: '175', unit: 'lbs', icon: Weight, trend: 'down', color: 'text-green-500', bg: 'bg-green-50' },
  { label: 'Height', value: '5\'10"', unit: '', icon: Ruler, trend: 'stable', color: 'text-muted', bg: 'bg-paper-soft' },
]

const medications = [
  { name: 'Lisinopril', dose: '10mg', frequency: 'Once daily', status: 'active' },
  { name: 'Metformin', dose: '500mg', frequency: 'Twice daily', status: 'active' },
  { name: 'Vitamin D', dose: '2000 IU', frequency: 'Once daily', status: 'active' },
]

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-red-400" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-green-400" />
  return <Minus className="w-3 h-3 text-muted/40" />
}

export const PatientContextPanel = () => {
  const [vitalsExpanded, setVitalsExpanded] = useState(true)
  const [medsExpanded, setMedsExpanded] = useState(true)

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-line shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold">
            JD
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-ink truncate">John Doe</h2>
            <p className="text-[11px] text-muted">Male &middot; 34 yrs &middot; O+</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Vitals Section */}
        <div className="border-b border-line">
          <button
            onClick={() => setVitalsExpanded(!vitalsExpanded)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-ink/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal" />
              <span className="text-xs font-semibold text-ink">Health Snapshot</span>
            </div>
            {vitalsExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted" />
            )}
          </button>
          {vitalsExpanded && (
            <div className="px-5 pb-4 grid grid-cols-2 gap-2">
              {vitals.map((v) => (
                <div key={v.label} className="p-2.5 rounded-xl bg-paper-soft border border-line/50">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`w-6 h-6 rounded-md ${v.bg} flex items-center justify-center`}>
                      <v.icon className={`w-3.5 h-3.5 ${v.color}`} />
                    </div>
                    <TrendIcon trend={v.trend} />
                  </div>
                  <div className="text-base font-bold text-ink leading-tight">{v.value}<span className="text-[10px] font-normal text-muted ml-0.5">{v.unit}</span></div>
                  <div className="text-[10px] text-muted/60 mt-0.5">{v.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medications Section */}
        <div className="border-b border-line">
          <button
            onClick={() => setMedsExpanded(!medsExpanded)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-ink/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-navy" />
              <span className="text-xs font-semibold text-ink">Current Medications</span>
            </div>
            {medsExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted" />
            )}
          </button>
          {medsExpanded && (
            <div className="px-5 pb-4 space-y-2">
              {medications.map((med) => (
                <div key={med.name} className="flex items-start gap-3 p-2.5 rounded-xl bg-paper-soft border border-line/50">
                  <div className="w-6 h-6 rounded-md bg-navy/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Pill className="w-3 h-3 text-navy" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-ink">{med.name}</div>
                    <div className="text-[11px] text-muted">{med.dose} &middot; {med.frequency}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Allergies */}
        <div className="px-5 py-4">
          <h3 className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Known Allergies</h3>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[11px] font-medium rounded-lg">Penicillin</span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[11px] font-medium rounded-lg">Sulfa Drugs</span>
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 pb-5">
          <h3 className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">Assessment Progress</h3>
          <div className="space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted">Profile Completion</span>
                <span className="text-[11px] font-semibold text-ink">85%</span>
              </div>
              <div className="w-full h-1.5 bg-paper-soft rounded-full overflow-hidden">
                <div className="h-full bg-teal rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted">Health Score</span>
                <span className="text-[11px] font-semibold text-ink">92/100</span>
              </div>
              <div className="w-full h-1.5 bg-paper-soft rounded-full overflow-hidden">
                <div className="h-full bg-green rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
