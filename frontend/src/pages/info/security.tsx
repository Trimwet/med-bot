import { InfoPage } from './info-page'

export const SecurityPage = () => (
  <InfoPage title="Security" subtitle="How we keep your data safe.">
    <div className="prose prose-gray max-w-none">
      <h2>Encryption</h2>
      <p className="text-gray-600 leading-relaxed">
        All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. 
        This ensures your data is protected during transmission and storage.
      </p>
      <h2>Access Controls</h2>
      <p className="text-gray-600 leading-relaxed">
        We implement role-based access controls (RBAC) to ensure only authorized personnel 
        can access sensitive data. Multi-factor authentication is available for all accounts.
      </p>
      <h2>Infrastructure</h2>
      <p className="text-gray-600 leading-relaxed">
        Our infrastructure is hosted on SOC 2 compliant cloud providers with regular security 
        audits and penetration testing.
      </p>
      <h2>Monitoring</h2>
      <p className="text-gray-600 leading-relaxed">
        We monitor our systems 24/7 for security threats and anomalies. Any suspicious activity 
        triggers immediate investigation and response.
      </p>
    </div>
  </InfoPage>
)
