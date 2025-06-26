import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, CheckCircleIcon, XCircleIcon, MessageSquareIcon, UserPlusIcon } from 'lucide-react';
const RiskResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get risk data from location state or use default values
  const {
    type = 'heart',
    riskLevel = 'medium'
  } = location.state || {};
  // Content based on risk type
  const diseaseType = type === 'heart' ? 'Heart Disease' : 'Cancer';
  // Risk level content
  const riskContent = {
    low: {
      title: 'Low Risk',
      color: 'green',
      icon: <CheckCircleIcon className="h-12 w-12 text-green-500" />,
      description: `Based on your responses, you appear to have a low risk for ${diseaseType.toLowerCase()}.`,
      recommendations: ['Continue with regular check-ups', 'Maintain a healthy lifestyle', 'Stay physically active', 'Eat a balanced diet']
    },
    medium: {
      title: 'Medium Risk',
      color: 'yellow',
      icon: <AlertCircleIcon className="h-12 w-12 text-yellow-500" />,
      description: `Based on your responses, you appear to have a moderate risk for ${diseaseType.toLowerCase()}.`,
      recommendations: ['Schedule a check-up with your doctor', 'Consider lifestyle modifications', 'Monitor your symptoms', 'Follow preventive measures']
    },
    high: {
      title: 'High Risk',
      color: 'red',
      icon: <XCircleIcon className="h-12 w-12 text-red-500" />,
      description: `Based on your responses, you appear to have a high risk for ${diseaseType.toLowerCase()}.`,
      recommendations: ['Consult with a healthcare provider as soon as possible', 'Follow specific medical advice', 'Make immediate lifestyle changes', 'Consider more frequent screenings']
    }
  };
  const currentRisk = riskContent[riskLevel as keyof typeof riskContent];
  // Medications and prevention based on disease type
  const medications = type === 'heart' ? ['Statins for cholesterol management', 'Blood pressure medications', 'Aspirin therapy (as advised by doctor)'] : ['Preventive medications based on cancer type', 'Immune system boosters', 'Supplements (as advised by doctor)'];
  const preventions = type === 'heart' ? ['Regular cardiovascular exercise', 'Heart-healthy diet low in saturated fats', 'Stress management techniques'] : ['Regular cancer screenings', 'Sun protection', 'Avoiding known carcinogens'];
  return <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`bg-${currentRisk.color}-100 px-6 py-4`}>
            <div className="flex items-center">
              {currentRisk.icon}
              <h1 className="ml-4 text-2xl font-bold">
                {diseaseType} Risk Assessment Results
              </h1>
            </div>
          </div>
          {/* Risk Level */}
          <div className="px-6 py-8 border-b">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className={`bg-${currentRisk.color}-100 rounded-full p-4`}>
                  {currentRisk.icon}
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <h2 className={`text-xl font-semibold text-${currentRisk.color}-700`}>
                  {currentRisk.title}
                </h2>
                <p className="mt-2 text-gray-600">{currentRisk.description}</p>
                <div className="mt-4">
                  <p className="font-medium text-gray-700">Important Note:</p>
                  <p className="text-sm text-gray-500">
                    This assessment is for informational purposes only and does
                    not constitute medical advice. Please consult with a
                    healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Recommendations */}
          <div className="px-6 py-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {currentRisk.recommendations.map((rec, index) => <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                  <span className="ml-2">{rec}</span>
                </li>)}
            </ul>
          </div>
          {/* Prevention & Medications */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="px-6 py-6 border-b md:border-r">
              <h3 className="text-lg font-semibold mb-4">
                Preventive Measures
              </h3>
              <ul className="space-y-2">
                {preventions.map((prevention, index) => <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-green-500">
                      •
                    </span>
                    <span className="ml-2">{prevention}</span>
                  </li>)}
              </ul>
            </div>
            <div className="px-6 py-6 border-b">
              <h3 className="text-lg font-semibold mb-4">
                Suggested Medications
              </h3>
              <ul className="space-y-2">
                {medications.map((medication, index) => <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-purple-500">
                      •
                    </span>
                    <span className="ml-2">{medication}</span>
                  </li>)}
                <li className="text-sm text-gray-500 italic mt-2">
                  Always consult with a healthcare provider before starting any
                  medication.
                </li>
              </ul>
            </div>
          </div>
          {/* Actions */}
          <div className="px-6 py-8">
            <h3 className="text-lg font-semibold mb-6">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => navigate('/chatbot')} className="flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <MessageSquareIcon className="h-5 w-5 mr-2" />
                Ask Our Health Assistant
              </button>
              <button onClick={() => navigate('/register')} className="flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Register & Channel a Doctor
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800 font-medium">
            Return to Home
          </button>
        </div>
      </div>
    </div>;
};
export default RiskResultPage;