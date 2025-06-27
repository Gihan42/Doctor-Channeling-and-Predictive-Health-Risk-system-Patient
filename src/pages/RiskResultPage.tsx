import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MessageSquareIcon,
  UserPlusIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const RiskResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState('');
  const [error, setError] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Get risk data from location state
  const {
    type = 'heart',
    interpretation = 'Low risk of cancer detected',
    prediction,
    probability,
  } = location.state || {};

  const diseaseType = type === 'heart' ? 'Heart Disease' : 'Cancer';

  const getRiskLevel = (interpretation: string) => {
    if (interpretation.toLowerCase().includes('low')) return 'low';
    if (
        interpretation.toLowerCase().includes('medium') ||
        interpretation.toLowerCase().includes('moderate')
    )
      return 'medium';
    if (interpretation.toLowerCase().includes('high')) return 'high';
    return 'medium';
  };

  const riskLevel = getRiskLevel(interpretation);

  const riskContent = {
    low: {
      title: 'Low Risk',
      color: 'green',
      icon: <CheckCircleIcon className="h-12 w-12 text-green-500" />,
      description: interpretation,
      recommendations: [
        'Continue with regular check-ups',
        'Maintain a healthy lifestyle',
        'Stay physically active',
        'Eat a balanced diet',
      ],
    },
    medium: {
      title: 'Medium Risk',
      color: 'yellow',
      icon: <AlertCircleIcon className="h-12 w-12 text-yellow-500" />,
      description: interpretation,
      recommendations: [
        'Schedule a check-up with your doctor',
        'Consider lifestyle modifications',
        'Monitor your symptoms',
        'Follow preventive measures',
      ],
    },
    high: {
      title: 'High Risk',
      color: 'red',
      icon: <XCircleIcon className="h-12 w-12 text-red-500" />,
      description: interpretation,
      recommendations: [
        'Consult with a healthcare provider as soon as possible',
        'Follow specific medical advice',
        'Make immediate lifestyle changes',
        'Consider more frequent screenings',
      ],
    },
  };

  const currentRisk = riskContent[riskLevel as keyof typeof riskContent];

  const medications =
      type === 'heart'
          ? [
            'Statins for cholesterol management',
            'Blood pressure medications',
            'Aspirin therapy (as advised by doctor)',
          ]
          : [
            'Preventive medications based on cancer type',
            'Immune system boosters',
            'Supplements (as advised by doctor)',
          ];

  const preventions =
      type === 'heart'
          ? [
            'Regular cardiovascular exercise',
            'Heart-healthy diet low in saturated fats',
            'Stress management techniques',
          ]
          : ['Regular cancer screenings', 'Sun protection', 'Avoiding known carcinogens'];

  const generateChatPrompt = () => {
    return `Patient's ${diseaseType} Risk Assessment Results:
- Risk Level: ${currentRisk.title}
- Description: ${currentRisk.description}
- Recommendations: ${currentRisk.recommendations.join(', ')}
- Suggested Medications: ${medications.join(', ')}
- Preventive Measures: ${preventions.join(', ')}

Please provide personalized advice based on this risk assessment.`;
  };

  const getChatResponse = async () => {
    setIsLoading(true);
    setError('');
    try {
      const prompt = generateChatPrompt();
      const response = await fetch('http://localhost:8080/api/v1/ml/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the server');
      }

      const data = await response.json();
      setChatResponse(data.response);
    } catch (err) {
      setError('Failed to get response. Please try again later.');
      console.error('Error fetching chat response:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate token on component mount
  useEffect(() => {
    const validateToken = () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) return setIsTokenValid(false);

        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) return setIsTokenValid(false);

        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem('token');
          localStorage.removeItem('jwt');
          localStorage.removeItem('authToken');
          return setIsTokenValid(false);
        }

        setIsTokenValid(true);
      } catch (err) {
        console.error('Error validating token:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('jwt');
        localStorage.removeItem('authToken');
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, []);

  return (
      <div className="bg-gray-50 min-h-screen py-12 mt-14">
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

            {/* Risk Info */}
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
                  {prediction !== undefined && (
                      <p className="mt-2 text-sm text-gray-500">
                        Prediction: {prediction === 0 ? 'Negative' : 'Positive'} | Probability:{' '}
                        {(probability * 100).toFixed(2)}%
                      </p>
                  )}
                  <div className="mt-4">
                    <p className="font-medium text-gray-700">Important Note:</p>
                    <p className="text-sm text-gray-500">
                      This assessment is for informational purposes only. Please consult a
                      healthcare professional for diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="px-6 py-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {currentRisk.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                      <span className="ml-2">{rec}</span>
                    </li>
                ))}
              </ul>
            </div>

            {/* Prevention & Medications */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="px-6 py-6 border-b md:border-r">
                <h3 className="text-lg font-semibold mb-4">Preventive Measures</h3>
                <ul className="space-y-2">
                  {preventions.map((prevention, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-green-500">•</span>
                        <span className="ml-2">{prevention}</span>
                      </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 py-6 border-b">
                <h3 className="text-lg font-semibold mb-4">Suggested Medications</h3>
                <ul className="space-y-2">
                  {medications.map((medication, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-purple-500">•</span>
                        <span className="ml-2">{medication}</span>
                      </li>
                  ))}
                  <li className="text-sm text-gray-500 italic mt-2">
                    Always consult a doctor before starting medication.
                  </li>
                </ul>
              </div>
            </div>

            {/* Chat Response */}
            <div className="mt-2 text-center p-6">
              {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Getting personalized advice...</span>
                  </div>
              ) : chatResponse ? (
                  <div className="max-h-64 overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white py-2">
                      Personalized Advice
                    </h3>
                    <p className="text-gray-700 text-left p-2">{chatResponse}</p>
                  </div>
              ) : (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Get Personalized Advice</h3>
                    <p className="text-gray-500 mb-4">
                      Click below to get AI-generated advice based on your risk.
                    </p>
                    <button
                        onClick={getChatResponse}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Generate Advice
                    </button>
                  </div>
              )}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {/* Next Steps */}
            <div className="px-6 py-8">
              <h3 className="text-lg font-semibold mb-6">Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => navigate('/chatbot')}
                    className="flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <MessageSquareIcon className="h-5 w-5 mr-2" />
                  Ask Our Health Assistant
                </button>
                <button
                    onClick={() => navigate(isTokenValid ? '/dashboard' : '/register')}
                    className="flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <UserPlusIcon className="h-5 w-5 mr-2" />
                  Register & Channel a Doctor
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
  );
};

export default RiskResultPage;
