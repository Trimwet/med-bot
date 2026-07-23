import { InfoPage } from './info-page'

export const TermsOfServicePage = () => (
  <InfoPage title="Terms of Service" subtitle="Terms and conditions for using MedBot.">
    <div className="prose prose-gray max-w-none">
      <h2>Acceptance of Terms</h2>
      <p className="text-gray-600 leading-relaxed">
        By accessing or using MedBot, you agree to be bound by these Terms of Service. 
        If you do not agree, do not use our services.
      </p>
      <h2>Use of Services</h2>
      <p className="text-gray-600 leading-relaxed">
        MedBot is designed to assist healthcare professionals in patient triage. It is not a substitute 
        for professional medical judgment.
      </p>
      <h2>User Responsibilities</h2>
      <p className="text-gray-600 leading-relaxed">
        Users are responsible for maintaining the confidentiality of their accounts and for all 
        activities that occur under their accounts.
      </p>
      <h2>Limitation of Liability</h2>
      <p className="text-gray-600 leading-relaxed">
        MedBot shall not be liable for any indirect, incidental, special, consequential, or 
        punitive damages resulting from your use of the service.
      </p>
    </div>
  </InfoPage>
)
