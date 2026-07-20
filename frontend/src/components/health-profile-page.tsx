import React, { useState } from 'react'
import { User, Heart, Ruler, Weight, Droplets, AlertTriangle, Pill, Phone } from 'lucide-react'
import { Select } from './ui/select'
import { updateProfile, ApiError } from '@/lib/api'

interface HealthProfilePageProps {
  onBack?: () => void
  onContinue?: () => void
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const HealthProfilePage = ({ onBack, onContinue }: HealthProfilePageProps) => {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    bloodGroup: '',
    allergies: '',
    conditions: '',
    medications: '',
    emergencyContact: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateProfile({
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        heightCm: form.height ? Number(form.height) : undefined,
        weightKg: form.weight ? Number(form.weight) : undefined,
        bloodGroup: form.bloodGroup || undefined,
        allergies: form.allergies || undefined,
        conditions: form.conditions || undefined,
        medications: form.medications || undefined,
        emergencyContact: form.emergencyContact || undefined,
      })
      onContinue?.()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F5FA] flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Profile form */}
          <div className="bg-white rounded-2xl border border-line shadow-sm px-8 py-10">

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-ink font-display mb-2">
                Create Your Health Profile
              </h1>
              <p className="text-sm text-[#9CA3AF] max-w-xs mx-auto">
                Help us personalize your experience and provide better health guidance.
              </p>
              <p className="text-xs text-muted/40 -mt-1">Only Age and Gender are required. Fill in the rest to get better guidance.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Age & Gender row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                    <User className="size-3.5 text-teal" />
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your age"
                    value={form.age}
                    onChange={(e) => update('age', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                    <User className="size-3.5 text-teal" />
                    Gender
                  </label>
                  <Select
                    value={form.gender}
                    onValueChange={(val) => update('gender', val)}
                    placeholder="Select your gender"
                    options={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                      { label: 'Other', value: 'other' },
                    ]}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-line" />
                <span className="text-[11px] font-medium text-muted/40 uppercase tracking-wider">Optional</span>
                <div className="flex-1 h-px bg-line" />
              </div>

              {/* Height & Weight row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                    <Ruler className="size-3.5 text-teal" />
                    Height <span className="text-xs text-muted/40 font-normal">(cm)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 170"
                    value={form.height}
                    onChange={(e) => update('height', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                    <Weight className="size-3.5 text-teal" />
                    Weight <span className="text-xs text-muted/40 font-normal">(kg)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 70"
                    value={form.weight}
                    onChange={(e) => update('weight', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                  <Droplets className="size-3.5 text-teal" />
                  Blood Group
                </label>
                  <Select
                    value={form.bloodGroup}
                    onValueChange={(val) => update('bloodGroup', val)}
                    placeholder="Select your blood group"
                    options={bloodGroups.map((bg) => ({ label: bg, value: bg }))}
                  />
              </div>

              {/* Allergies */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                  <AlertTriangle className="size-3.5 text-teal" />
                  Allergies <span className="text-xs text-muted/40 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="E.g. Peanuts, Pollen, Dust"
                  maxLength={100}
                  rows={1}
                  value={form.allergies}
                  onChange={(e) => update('allergies', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all resize-none"
                />
                <p className="text-xs text-muted/50 text-right -mt-1">{form.allergies.length}/100</p>
              </div>

              {/* Existing Conditions */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                  <Heart className="size-3.5 text-teal" />
                  Existing Conditions <span className="text-xs text-muted/40 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="E.g. Diabetes, Hypertension, Asthma"
                  maxLength={100}
                  rows={1}
                  value={form.conditions}
                  onChange={(e) => update('conditions', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all resize-none"
                />
                <p className="text-xs text-muted/50 text-right -mt-1">{form.conditions.length}/100</p>
              </div>

              {/* Medications */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                  <Pill className="size-3.5 text-teal" />
                  Medications <span className="text-xs text-muted/40 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="List any current medications"
                  maxLength={100}
                  rows={1}
                  value={form.medications}
                  onChange={(e) => update('medications', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all resize-none"
                />
                <p className="text-xs text-muted/50 text-right -mt-1">{form.medications.length}/100</p>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                  <Phone className="size-3.5 text-teal" />
                  Emergency Contact <span className="text-xs text-muted/40 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Name and phone number"
                  maxLength={100}
                  rows={1}
                  value={form.emergencyContact}
                  onChange={(e) => update('emergencyContact', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all resize-none"
                />
                <p className="text-xs text-muted/50 text-right -mt-1">{form.emergencyContact.length}/100</p>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 rounded-lg bg-[#0A202A] text-white font-semibold text-sm hover:bg-[#0A202A]/80 transition-colors font-display disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'SAVING...' : 'CONTINUE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
