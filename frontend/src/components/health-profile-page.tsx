import React, { useState } from 'react'
import { User, Heart, Ruler, Weight, Droplets, AlertTriangle, Pill, Phone, ChevronLeft } from 'lucide-react'

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

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

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
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
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

            {/* Title */}
            <div className="text-center mb-8 pt-2">
              <h1 className="text-2xl font-bold text-ink font-display mb-2">
                Create Your Health Profile
              </h1>
              <p className="text-sm text-[#9CA3AF] max-w-xs mx-auto">
                Help us personalize your experience and provide better health guidance.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
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
                  <select
                    value={form.gender}
                    onChange={(e) => update('gender', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all appearance-none"
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Height & Weight row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                    <Ruler className="size-3.5 text-teal" />
                    Height
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your height"
                    value={form.height}
                    onChange={(e) => update('height', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                    <Weight className="size-3.5 text-teal" />
                    Weight
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your weight"
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
                <select
                  value={form.bloodGroup}
                  onChange={(e) => update('bloodGroup', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all appearance-none"
                >
                  <option value="">Select your blood group</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Allergies */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                  <AlertTriangle className="size-3.5 text-teal" />
                  Allergies
                </label>
                <textarea
                  placeholder="E.g. Peanuts, Pollen, Dust"
                  maxLength={100}
                  rows={2}
                  value={form.allergies}
                  onChange={(e) => update('allergies', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all resize-none"
                />
                <p className="text-xs text-muted/50 text-right mt-1">{form.allergies.length}/100</p>
              </div>

              {/* Existing Conditions */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                  <Heart className="size-3.5 text-teal" />
                  Existing Conditions
                </label>
                <textarea
                  placeholder="E.g. Diabetes, Hypertension, Asthma"
                  maxLength={100}
                  rows={2}
                  value={form.conditions}
                  onChange={(e) => update('conditions', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all resize-none"
                />
                <p className="text-xs text-muted/50 text-right mt-1">{form.conditions.length}/100</p>
              </div>

              {/* Medications */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                  <Pill className="size-3.5 text-teal" />
                  Medications
                </label>
                <textarea
                  placeholder="List any current medications"
                  maxLength={100}
                  rows={2}
                  value={form.medications}
                  onChange={(e) => update('medications', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all resize-none"
                />
                <p className="text-xs text-muted/50 text-right mt-1">{form.medications.length}/100</p>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink mb-1.5">
                  <Phone className="size-3.5 text-teal" />
                  Emergency Contact
                </label>
                <textarea
                  placeholder="Name and phone number"
                  maxLength={100}
                  rows={2}
                  value={form.emergencyContact}
                  onChange={(e) => update('emergencyContact', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all resize-none"
                />
                <p className="text-xs text-muted/50 text-right mt-1">{form.emergencyContact.length}/100</p>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#0A202A] text-white font-semibold text-sm hover:bg-[#0A202A]/80 transition-colors font-display"
                >
                  CONTINUE
                </button>
                <button
                  onClick={onBack}
                  type="button"
                  className="w-full py-3 rounded-lg border border-line text-muted font-semibold text-sm hover:text-ink hover:border-ink/30 transition-all font-display"
                >
                  BACK
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
