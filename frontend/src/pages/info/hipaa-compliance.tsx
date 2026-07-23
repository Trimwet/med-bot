import { InfoPage } from './info-page'

export const HipaaCompliancePage = () => (
  <InfoPage title="HIPAA Compliance" subtitle="Our commitment to protecting health information.">
    <div className="prose prose-gray max-w-none">
      <h2>Overview</h2>
      <p className="text-gray-600 leading-relaxed">
        MedBot is committed to maintaining compliance with the Health Insurance Portability and 
        Accountability Act (HIPAA) regulations to protect patient health information.
      </p>
      <h2>Safeguards</h2>
      <p className="text-gray-600 leading-relaxed">
        We implement administrative, physical, and technical safeguards to ensure the confidentiality, 
        integrity, and availability of protected health information (PHI).
      </p>
      <h2>Business Associate Agreements</h2>
      <p className="text-gray-600 leading-relaxed">
        We maintain Business Associate Agreements (BAAs) with all partners who handle PHI on our behalf.
      </p>
      <h2>Breach Notification</h2>
      <p className="text-gray-600 leading-relaxed">
        In the event of a breach of unsecured PHI, we will notify affected individuals and the 
        Department of Health and Human Services as required by law.
      </p>
    </div>
  </InfoPage>
)
