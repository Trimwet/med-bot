import { InfoPage } from './info-page'

export const ClinicalProtocolsPage = () => (
  <InfoPage title="Clinical Protocols" subtitle="Evidence-based protocols powering our triage system.">
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-600 leading-relaxed mb-8">
        Our AI triage system is built on established clinical protocols and continuously updated 
        based on the latest medical research and guidelines.
      </p>
      <div className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Triage Assessment Protocol</h3>
          <p className="text-sm text-gray-600">
            Standardized methodology for evaluating patient symptoms and determining urgency levels.
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Emergency Classification</h3>
          <p className="text-sm text-gray-600">
            Framework for identifying and categorizing emergency cases requiring immediate attention.
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Follow-up Guidelines</h3>
          <p className="text-sm text-gray-600">
            Protocols for post-assessment follow-up and patient monitoring recommendations.
          </p>
        </div>
      </div>
    </div>
  </InfoPage>
)
