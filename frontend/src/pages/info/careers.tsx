import { InfoPage } from './info-page'

export const CareersPage = () => (
  <InfoPage title="Careers" subtitle="Join us in shaping the future of healthcare.">
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-600 leading-relaxed mb-8">
        We're always looking for talented individuals who are passionate about healthcare and technology. 
        Check out our open positions below.
      </p>
      <div className="space-y-4">
        {/* TODO: Fetch job listings from API */}
        <div className="p-6 border border-gray-200 rounded-xl">
          <p className="text-sm text-gray-400 text-center py-4">Job listings loading...</p>
        </div>
      </div>
    </div>
  </InfoPage>
)
