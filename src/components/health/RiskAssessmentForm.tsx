import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';

const RiskAssessmentForm = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [assessmentType, setAssessmentType] = useState<'heart' | 'cancer' | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Common fields
    age: '',
    gender: '',

    // Cancer specific fields
    familyHistory: '',
    smoking: '',
    bmi: '',
    geneticRisk: '',
    physicalActivity: '',
    alcoholIntake: '',
    cancerHistory: '',
    sunExposure: '',
    diet: '',
    previousCancer: '',

    // Heart disease specific fields
    chestPainType: '',
    restingBP: '',
    cholesterol: '',
    fastingBloodSugar: '',
    restingECG: '',
    maxHeartRate: '',
    exerciseAngina: '',
    stDepression: '',
    stSlope: '',
    majorVessels: '',
    thalassemia: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeSelect = (type: 'heart' | 'cancer') => {
    setAssessmentType(type);
    setStep(2);
  };

  // Mapping functions for cancer
  const mapBmi = (bmiOption: string): number => {
    switch(bmiOption) {
      case 'underweight': return 17;
      case 'normal': return 22;
      case 'overweight': return 27.5;
      case 'obese': return 32;
      case 'unknown': return 26;
      default: return 25;
    }
  };

  const mapSmoking = (smokingOption: string): number => {
    switch(smokingOption) {
      case 'never': return 0;
      case 'former': return 1;
      case 'current': return 2;
      default: return 0;
    }
  };

  const mapGeneticRisk = (riskOption: string): number => {
    switch(riskOption) {
      case 'none': return 0;
      case 'distant': return 1;
      case 'close': return 2;
      case 'multiple': return 3;
      case 'genetic-mutation': return 4;
      case 'unknown': return 1;
      default: return 0;
    }
  };

  const mapPhysicalActivity = (activityOption: string): number => {
    switch(activityOption) {
      case 'sedentary': return 0;
      case 'light': return 1;
      case 'moderate': return 2;
      case 'vigorous': return 3;
      default: return 0;
    }
  };

  const mapAlcoholIntake = (alcoholOption: string): number => {
    switch(alcoholOption) {
      case 'none': return 0;
      case 'occasional': return 0.5;
      case 'light': return 1;
      case 'moderate': return 2;
      case 'heavy': return 4;
      case 'binge': return 3;
      default: return 0;
    }
  };

  const mapCancerHistory = (historyOption: string): number => {
    switch(historyOption) {
      case 'none': return 0;
      case 'benign': return 1;
      case 'cancer-treated': return 2;
      case 'cancer-ongoing': return 3;
      case 'precancerous': return 1;
      default: return 0;
    }
  };

  const prepareCancerData = () => {
    return {
      Age: parseInt(formData.age) || 30,
      Gender: formData.gender === "2" ? 0 : 1, // 1 for male, 0 for female
      BMI: mapBmi(formData.bmi),
      Smoking: mapSmoking(formData.smoking),
      GeneticRisk: mapGeneticRisk(formData.geneticRisk),
      PhysicalActivity: mapPhysicalActivity(formData.physicalActivity),
      AlcoholIntake: mapAlcoholIntake(formData.alcoholIntake),
      CancerHistory: mapCancerHistory(formData.cancerHistory)
    };
  };

  const prepareHeartData = () => {
    return {
      age: parseInt(formData.age) || 50,
      sex: formData.gender === "2" ? 0 : 1, // 1 = male, 0 = female
      cp: parseInt(formData.chestPainType) || 0, // chest pain type
      trtbps: parseInt(formData.restingBP) || 120, // ✔ FastAPI expects this
      chol: parseInt(formData.cholesterol) || 200, // serum cholesterol
      fbs: parseInt(formData.fastingBloodSugar) || 0, // fasting blood sugar
      restecg: parseInt(formData.restingECG) || 0, // resting ECG
      thalach: parseInt(formData.maxHeartRate) || 150, // max heart rate
      exang: parseInt(formData.exerciseAngina) || 0, // exercise induced angina
      oldpeak: parseFloat(formData.stDepression) || 0.0, // ST depression
      slope: parseInt(formData.stSlope) || 1, // slope of ST segment
      ca: parseInt(formData.majorVessels) || 0, // major vessels
      thal: parseInt(formData.thalassemia) || 1 // thalassemia
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let apiUrl = '';
      let requestData = {};

      if (assessmentType === 'cancer') {
        apiUrl = `${baseUrl}ml/predict/cancer`;
        requestData = prepareCancerData();
      } else if (assessmentType === 'heart') {
        apiUrl = `${baseUrl}ml/predict/heart-attack`;
        requestData = prepareHeartData();
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log(data.prediction)
      navigate('/risk-result', {
        state: {
          type: assessmentType,
          prediction: data.prediction,
          probability: data.probability,
          interpretation: data.interpretation,
          formData: formData
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setAssessmentType(null);
      }
    }
  };

  return (
      <div>
        {step === 1 && (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                What would you like to assess?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => handleTypeSelect('heart')}
                    className="flex items-center justify-center p-6 border-2 border-teal-200 rounded-xl hover:bg-teal-50 transition-colors"
                >
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
                      Assess your risk factors for heart attack and cardiovascular diseases
                    </p>
                  </div>
                </button>
                <button
                    onClick={() => handleTypeSelect('cancer')}
                    className="flex items-center justify-center p-6 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-colors"
                >
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
            </div>
        )}

        {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <button
                    type="button"
                    onClick={goBack}
                    className="text-teal-500 flex items-center mb-4"
                >
                  <ChevronRight className="h-4 w-4 transform rotate-180 mr-1" />
                  Back
                </button>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {assessmentType === 'heart' ? 'Heart Disease Risk Assessment' : 'Cancer Risk Assessment'}
                </h3>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <p className="text-sm text-amber-700">
                      This assessment is for informational purposes only and does not replace professional medical advice.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
              )}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        min="18"
                        max="120"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                  </div>
                </div>

                {assessmentType === 'cancer' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Smoking Status
                        </label>
                        <select
                            name="smoking"
                            value={formData.smoking}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select option</option>
                          <option value="never">Never smoked</option>
                          <option value="former">Former smoker</option>
                          <option value="current">Current smoker</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          BMI (Body Mass Index)
                        </label>
                        <select
                            name="bmi"
                            value={formData.bmi}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select BMI range</option>
                          <option value="underweight">Underweight (BMI &lt; 18.5)</option>
                          <option value="normal">Normal weight (BMI 18.5-24.9)</option>
                          <option value="overweight">Overweight (BMI 25-29.9)</option>
                          <option value="obese">Obese (BMI ≥ 30)</option>
                          <option value="unknown">I don't know my BMI</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Genetic Risk / Family History
                        </label>
                        <select
                            name="geneticRisk"
                            value={formData.geneticRisk}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select option</option>
                          <option value="none">No known family history of cancer</option>
                          <option value="distant">Distant relatives with cancer</option>
                          <option value="close">Close relatives with cancer (parents, siblings)</option>
                          <option value="multiple">Multiple family members with cancer</option>
                          <option value="genetic-mutation">Known genetic mutation (BRCA, etc.)</option>
                          <option value="unknown">Unknown family history</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Physical Activity Level
                        </label>
                        <select
                            name="physicalActivity"
                            value={formData.physicalActivity}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select activity level</option>
                          <option value="sedentary">Sedentary (little to no exercise)</option>
                          <option value="light">Light activity (1-2 days/week)</option>
                          <option value="moderate">Moderate activity (3-5 days/week)</option>
                          <option value="vigorous">Vigorous activity (6-7 days/week)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alcohol Intake
                        </label>
                        <select
                            name="alcoholIntake"
                            value={formData.alcoholIntake}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select alcohol consumption</option>
                          <option value="none">None / Never drink alcohol</option>
                          <option value="occasional">Occasional (1-2 drinks per week)</option>
                          <option value="light">Light (≤1 drink per day)</option>
                          <option value="moderate">Moderate (2-3 drinks per day)</option>
                          <option value="heavy">Heavy (≥4 drinks per day)</option>
                          <option value="binge">Binge drinking pattern</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cancer History
                        </label>
                        <select
                            name="cancerHistory"
                            value={formData.cancerHistory}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select option</option>
                          <option value="none">No previous cancer diagnosis</option>
                          <option value="benign">Previous benign tumors only</option>
                          <option value="cancer-treated">Previous cancer diagnosis (treated)</option>
                          <option value="cancer-ongoing">Current cancer treatment</option>
                          <option value="precancerous">Previous precancerous conditions</option>
                        </select>
                      </div>
                    </>
                ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chest Pain Type
                        </label>
                        <select
                            name="chestPainType"
                            value={formData.chestPainType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select chest pain type</option>
                          <option value="0">Typical angina</option>
                          <option value="1">Atypical angina</option>
                          <option value="2">Non-anginal pain</option>
                          <option value="3">Asymptomatic</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resting Blood Pressure (mm Hg)
                          </label>
                          <input
                              type="number"
                              name="restingBP"
                              value={formData.restingBP}
                              onChange={handleInputChange}
                              required
                              min="80"
                              max="200"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Serum Cholesterol (mg/dl)
                          </label>
                          <input
                              type="number"
                              name="cholesterol"
                              value={formData.cholesterol}
                              onChange={handleInputChange}
                              required
                              min="100"
                              max="600"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fasting Blood Sugar &gt; 120 mg/dl
                        </label>
                        <select
                            name="fastingBloodSugar"
                            value={formData.fastingBloodSugar}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select option</option>
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resting ECG Results
                        </label>
                        <select
                            name="restingECG"
                            value={formData.restingECG}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select ECG result</option>
                          <option value="0">Normal</option>
                          <option value="1">ST-T wave abnormality</option>
                          <option value="2">Probable or definite left ventricular hypertrophy</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Heart Rate Achieved
                        </label>
                        <input
                            type="number"
                            name="maxHeartRate"
                            value={formData.maxHeartRate}
                            onChange={handleInputChange}
                            required
                            min="60"
                            max="220"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Exercise Induced Angina
                        </label>
                        <select
                            name="exerciseAngina"
                            value={formData.exerciseAngina}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select option</option>
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ST Depression Induced by Exercise
                        </label>
                        <input
                            type="number"
                            name="stDepression"
                            value={formData.stDepression}
                            onChange={handleInputChange}
                            required
                            step="0.1"
                            min="0"
                            max="10"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Slope of Peak Exercise ST Segment
                        </label>
                        <select
                            name="stSlope"
                            value={formData.stSlope}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select slope</option>
                          <option value="0">Upsloping</option>
                          <option value="1">Flat</option>
                          <option value="2">Downsloping</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Major Vessels Colored by Fluoroscopy (0-3)
                        </label>
                        <select
                            name="majorVessels"
                            value={formData.majorVessels}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select number of vessels</option>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thalassemia
                        </label>
                        <select
                            name="thalassemia"
                            value={formData.thalassemia}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select thalassemia result</option>
                          <option value="1">Normal</option>
                          <option value="2">Fixed defect</option>
                          <option value="3">Reversible defect</option>
                        </select>
                      </div>
                    </>
                )}
              </div>

              <div className="mt-8">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-medium rounded-lg hover:from-teal-500 hover:to-teal-600 shadow-sm transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Processing...' : 'Get My Results'}
                </button>
              </div>
            </form>
        )}
      </div>
  );
};

export default RiskAssessmentForm;