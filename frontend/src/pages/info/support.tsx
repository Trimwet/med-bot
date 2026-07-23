import { InfoPage } from './info-page'

export const SupportPage = () => (
  <InfoPage title="Support" subtitle="Get help with MedBot.">
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-600 leading-relaxed mb-8">
        Our support team is available to help you with any questions or issues.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-500 mb-3">support@medbot.com</p>
          <p className="text-xs text-gray-400">Response within 24 hours</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-sm text-gray-500 mb-3">+234 800 123 4567</p>
          <p className="text-xs text-gray-400">Mon-Fri, 9am-6pm WAT</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-500 mb-3">Available in-app</p>
          <p className="text-xs text-gray-400">Instant response during business hours</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Help Center</h3>
          <p className="text-sm text-gray-500 mb-3">Browse FAQs and guides</p>
          <p className="text-xs text-gray-400">Self-service resources</p>
        </div>
      </div>
    </div>
  </InfoPage>
)
