import { InfoPage } from './info-page'

export const AboutUsPage = () => (
  <InfoPage title="About Us" subtitle="Learn more about MedBot and our mission.">
    <div className="prose prose-gray max-w-none">
      <h2>Our Mission</h2>
      <p className="text-gray-600 leading-relaxed">
        MedBot is dedicated to revolutionizing patient triage in hospitals through AI-powered technology. 
        Our mission is to reduce wait times, improve patient outcomes, and help healthcare providers 
        deliver better care efficiently.
      </p>
      <h2>Founded</h2>
      <p className="text-gray-600 leading-relaxed">
        We started with a simple observation: emergency rooms are overwhelmed, and patients often wait 
        too long to receive critical care. By leveraging artificial intelligence, we can help hospitals 
        prioritize patients based on severity and direct them to the right care pathway faster.
      </p>
    </div>
  </InfoPage>
)
