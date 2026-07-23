import { InfoPage } from './info-page'

export const ApiReferencePage = () => (
  <InfoPage title="API Reference" subtitle="Complete API documentation for developers.">
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-600 leading-relaxed mb-8">
        Integrate MedBot into your applications using our RESTful API endpoints.
      </p>
      <div className="space-y-4">
        <div className="p-4 bg-gray-900 rounded-xl font-mono text-sm">
          <p className="text-green-400">GET</p>
          <p className="text-gray-300">/api/v1/assessments</p>
          <p className="text-gray-500 text-xs mt-1">Retrieve all assessments</p>
        </div>
        <div className="p-4 bg-gray-900 rounded-xl font-mono text-sm">
          <p className="text-blue-400">POST</p>
          <p className="text-gray-300">/api/v1/assessments</p>
          <p className="text-gray-500 text-xs mt-1">Create a new assessment</p>
        </div>
        <div className="p-4 bg-gray-900 rounded-xl font-mono text-sm">
          <p className="text-green-400">GET</p>
          <p className="text-gray-300">/api/v1/patients</p>
          <p className="text-gray-500 text-xs mt-1">Retrieve patient records</p>
        </div>
        <div className="p-4 bg-gray-900 rounded-xl font-mono text-sm">
          <p className="text-yellow-400">PUT</p>
          <p className="text-gray-300">/api/v1/patients/:id</p>
          <p className="text-gray-500 text-xs mt-1">Update patient information</p>
        </div>
      </div>
    </div>
  </InfoPage>
)
