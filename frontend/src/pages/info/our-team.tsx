import { InfoPage } from './info-page'

export const OurTeamPage = () => (
  <InfoPage title="Our Team" subtitle="Meet the people building MedBot.">
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-600 leading-relaxed mb-8">
        Our team consists of healthcare professionals, AI researchers, and software engineers 
        united by the goal of improving patient care through technology.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TODO: Fetch team members from API */}
        <div className="p-6 border border-gray-200 rounded-xl">
          <p className="text-sm text-gray-400 text-center py-4">Team members loading...</p>
        </div>
      </div>
    </div>
  </InfoPage>
)
