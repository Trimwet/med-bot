import { InfoPage } from './info-page'

export const PrivacyPolicyPage = () => (
  <InfoPage title="Privacy Policy" subtitle="How we collect, use, and protect your data.">
    <div className="prose prose-gray max-w-none">
      <h2>Information We Collect</h2>
      <p className="text-gray-600 leading-relaxed">
        We collect information you provide directly, such as account details and health-related data 
        entered during assessments. We also collect usage data to improve our services.
      </p>
      <h2>How We Use Your Information</h2>
      <p className="text-gray-600 leading-relaxed">
        Your information is used to provide and improve our triage services, generate health reports, 
        and ensure compliance with healthcare regulations.
      </p>
      <h2>Data Security</h2>
      <p className="text-gray-600 leading-relaxed">
        We implement industry-standard security measures including encryption, access controls, and 
        regular security audits to protect your data.
      </p>
      <h2>Data Sharing</h2>
      <p className="text-gray-600 leading-relaxed">
        We do not sell or share your personal health information with third parties except as required 
        by law or with your explicit consent.
      </p>
    </div>
  </InfoPage>
)
