import { InfoPage } from './info-page'
import { MessageSquare, Activity, Stethoscope } from 'lucide-react'

export const HowItWorksPage = () => (
  <InfoPage title="How It Works" subtitle="A simple three-step process to triage patients faster.">
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-[#00A8A8]/10 rounded-full flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-[#00A8A8]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Step 1: Patient Interview</h3>
          <p className="text-gray-600 leading-relaxed">
            The patient describes their symptoms in a conversational format. MedBot asks targeted
            follow-up questions to gather relevant clinical information — just like a nurse would
            on the phone.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-[#00A8A8]/10 rounded-full flex items-center justify-center">
          <Activity className="w-5 h-5 text-[#00A8A8]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Step 2: AI Triage Assessment</h3>
          <p className="text-gray-600 leading-relaxed">
            MedBot analyzes the responses against clinical protocols and assigns an urgency level
            (Urgent, Semi-Urgent, Non-Urgent, or Emergency). The assessment is backed by
            evidence-based guidelines and improves over time.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-[#00A8A8]/10 rounded-full flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-[#00A8A8]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Step 3: Handoff to Care</h3>
          <p className="text-gray-600 leading-relaxed">
            The triage result is sent to the hospital dashboard in real time. Staff can review
            the patient's assessment, prioritize based on urgency, and direct them to the
            appropriate care pathway — reducing wait times and improving outcomes.
          </p>
        </div>
      </div>
    </div>
  </InfoPage>
)
