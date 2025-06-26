import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircleIcon } from 'lucide-react';
const RiskAssessmentForm = () => {
  const navigate = useNavigate();
  const [assessmentType, setAssessmentType] = useState<'heart' | 'cancer' | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Common fields
    age: '',
    gender: '',
    familyHistory: '',
    smoking: '',
    // Heart specific
    bloodPressure: '',
    cholesterol: '',
    diabetes: '',
    physicalActivity: '',
    // Cancer specific
    sunExposure: '',
    alcohol: '',
    diet: '',
    previousCancer: ''
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleTypeSelect = (type: 'heart' | 'cancer') => {
    setAssessmentType(type);
    setStep(2);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process the data here
    // For now, we'll just navigate to the results page
    navigate('/risk-result', {
      state: {
        type: assessmentType,
        riskLevel: calculateRiskLevel(),
        formData
      }
    });
  };
  const calculateRiskLevel = () => {
    // This is a simplified mock calculation
    // In a real app, this would use actual medical algorithms
    const riskLevels = ['low', 'medium', 'high'];
    return riskLevels[Math.floor(Math.random() * 3)];
  };
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setAssessmentType(null);
      }
    }
  };
  return <div>
      {step === 1 && <div className="text-center">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            What would you like to assess?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => handleTypeSelect('heart')} className="flex items-center justify-center p-6 border-2 border-teal-200 rounded-xl hover:bg-teal-50 transition-colors">
              <div className="text-center">
                <div className="bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-800">
                  Heart Disease Risk
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  Assess your risk factors for heart attack and cardiovascular
                  diseases
                </p>
              </div>
            </button>
            <button onClick={() => handleTypeSelect('cancer')} className="flex items-center justify-center p-6 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-800">
                  Cancer Risk
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  Evaluate your risk factors for various types of cancer
                </p>
              </div>
            </button>
          </div>
        </div>}
      {step === 2 && <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <button type="button" onClick={goBack} className="text-teal-500 flex items-center mb-4">
              <ChevronRight className="h-4 w-4 transform rotate-180 mr-1" />
              Back
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {assessmentType === 'heart' ? 'Heart Disease Risk Assessment' : 'Cancer Risk Assessment'}
            </h3>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
              <div className="flex">
                <AlertCircleIcon className="h-5 w-5 text-amber-500 mr-2" />
                <p className="text-sm text-amber-700">
                  This assessment is for informational purposes only and does
                  not replace professional medical advice.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {/* Common Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <select name="age" value={formData.age} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option value="">Select age range</option>
                  <option value="18-30">18-30 years</option>
                  <option value="31-40">31-40 years</option>
                  <option value="41-50">41-50 years</option>
                  <option value="51-60">51-60 years</option>
                  <option value="61+">61+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family History
              </label>
              <select name="familyHistory" value={formData.familyHistory} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option value="">Select option</option>
                <option value="yes">
                  Yes, family history of{' '}
                  {assessmentType === 'heart' ? 'heart disease' : 'cancer'}
                </option>
                <option value="no">No family history</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Smoking Status
              </label>
              <select name="smoking" value={formData.smoking} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option value="">Select option</option>
                <option value="never">Never smoked</option>
                <option value="former">Former smoker</option>
                <option value="current">Current smoker</option>
              </select>
            </div>
            {/* Heart Disease Specific Questions */}
            {assessmentType === 'heart' && <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Pressure
                    </label>
                    <select name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                      <option value="">Select option</option>
                      <option value="normal">
                        Normal (less than 120/80 mm Hg)
                      </option>
                      <option value="elevated">
                        Elevated (120-129/less than 80 mm Hg)
                      </option>
                      <option value="high">
                        High (130/80 mm Hg or higher)
                      </option>
                      <option value="unknown">I don't know</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cholesterol Level
                    </label>
                    <select name="cholesterol" value={formData.cholesterol} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                      <option value="">Select option</option>
                      <option value="normal">Normal</option>
                      <option value="borderline">Borderline high</option>
                      <option value="high">High</option>
                      <option value="unknown">I don't know</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diabetes Status
                  </label>
                  <select name="diabetes" value={formData.diabetes} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="">Select option</option>
                    <option value="no">No diabetes</option>
                    <option value="prediabetes">Prediabetes</option>
                    <option value="type1">Type 1 diabetes</option>
                    <option value="type2">Type 2 diabetes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Physical Activity Level
                  </label>
                  <select name="physicalActivity" value={formData.physicalActivity} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="">Select option</option>
                    <option value="inactive">
                      Inactive (little to no exercise)
                    </option>
                    <option value="light">
                      Light activity (1-2 days/week)
                    </option>
                    <option value="moderate">
                      Moderate activity (3-5 days/week)
                    </option>
                    <option value="high">High activity (6-7 days/week)</option>
                  </select>
                </div>
              </>}
            {/* Cancer Specific Questions */}
            {assessmentType === 'cancer' && <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sun Exposure
                  </label>
                  <select name="sunExposure" value={formData.sunExposure} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="">Select option</option>
                    <option value="low">Low (rarely outdoors)</option>
                    <option value="moderate">
                      Moderate (sometimes outdoors)
                    </option>
                    <option value="high">
                      High (frequently outdoors without protection)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alcohol Consumption
                  </label>
                  <select name="alcohol" value={formData.alcohol} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="">Select option</option>
                    <option value="none">None</option>
                    <option value="light">Light (≤1 drink/day)</option>
                    <option value="moderate">Moderate (2-3 drinks/day)</option>
                    <option value="heavy">Heavy (≥4 drinks/day)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diet
                  </label>
                  <select name="diet" value={formData.diet} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="">Select option</option>
                    <option value="healthy">
                      Healthy (plenty of fruits, vegetables, whole grains)
                    </option>
                    <option value="average">
                      Average (balanced diet with some processed foods)
                    </option>
                    <option value="poor">
                      Poor (high in processed foods, red meat, low in
                      fruits/vegetables)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Cancer Diagnosis
                  </label>
                  <select name="previousCancer" value={formData.previousCancer} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </>}
          </div>
          <div className="mt-8">
            <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-medium rounded-lg hover:from-teal-500 hover:to-teal-600 shadow-sm transition-all">
              Get My Results
            </button>
          </div>
        </form>}
    </div>;
};
export default RiskAssessmentForm;