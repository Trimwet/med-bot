import { InfoPage } from './info-page'

export const DocumentationPage = () => (
  <InfoPage title="Documentation" subtitle="Technical guides and API documentation.">
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-600 leading-relaxed mb-8">
        Comprehensive documentation to help you integrate and use MedBot effectively.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 rounded-xl hover:border-[#073B4C] transition-colors cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
          <p className="text-sm text-gray-500">Quick start guide for new users</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-xl hover:border-[#073B4C] transition-colors cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">Integration Guide</h3>
          <p className="text-sm text-gray-500">How to integrate MedBot into your workflow</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-xl hover:border-[#073B4C] transition-colors cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">Triage Protocols</h3>
          <p className="text-sm text-gray-500">Understanding our AI triage algorithms</p>
        </div>
        <div className="p-6 border border-gray-200 rounded-xl hover:border-[#073B4C] transition-colors cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
          <p className="text-sm text-gray-500">Tips for optimal implementation</p>
        </div>
      </div>
    </div>
  </InfoPage>
)
