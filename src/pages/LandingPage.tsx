import { useNavigate } from 'react-router-dom';
import { HeartPulseIcon, Activity, UserCheck, MessageSquare, Calendar } from 'lucide-react';
import RiskAssessmentForm from '../components/health/RiskAssessmentForm';
const LandingPage = () => {
  const navigate = useNavigate();
  return <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-50 to-blue-50 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                Specialized Healthcare for Heart and Cancer Patients
              </h1>
              <p className="text-xl mb-8 text-gray-600">
                Early detection and specialized care can save lives. Check your
                risk factors and connect with specialists through our advanced
                channeling system.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => document.getElementById('risk-assessment')?.scrollIntoView({
                behavior: 'smooth'
              })} className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg shadow-sm hover:shadow-md transition-all border border-teal-100">
                  Check My Health
                </button>
                <button onClick={() => navigate('/register')} className="px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:from-teal-500 hover:to-teal-600 transition-all">
                  Channel a Doctor
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Doctor with patient" className="rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="bg-teal-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <HeartPulseIcon className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Risk Assessment
              </h3>
              <p className="text-gray-600">
                Check your risk factors for heart disease and cancer with our
                AI-powered assessment tool.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="bg-green-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Specialized Care
              </h3>
              <p className="text-gray-600">
                Connect with specialists in cardiology and oncology for
                personalized treatment plans.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="bg-purple-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Health Assistant
              </h3>
              <p className="text-gray-600">
                Get answers to your health questions with our AI-powered chatbot
                assistant.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="bg-pink-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Easy Appointments
              </h3>
              <p className="text-gray-600">
                Book, manage, and track your doctor appointments with our
                channeling system.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Risk Assessment Section */}
      <section id="risk-assessment" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Check Your Health Risk
            </h2>
            <p className="text-lg text-gray-600">
              Answer a few questions to assess your risk for heart disease or
              cancer. No registration required.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <RiskAssessmentForm />
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Patient Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-teal-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <UserCheck className="h-5 w-5 text-teal-500 mr-2" />
                <h3 className="font-semibold text-gray-800">
                  Early Detection Success
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                "The risk assessment tool flagged my symptoms as high risk for
                heart disease. I followed up with a specialist through the app
                and received timely treatment."
              </p>
              <p className="font-medium text-gray-700">- James Wilson, 58</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-semibold text-gray-800">
                  Convenient Appointments
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                "As a cancer patient, I need regular check-ups. This system
                makes booking appointments so much easier, and I can track my
                queue position in real-time."
              </p>
              <p className="font-medium text-gray-700">- Sarah Johnson, 45</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <UserCheck className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="font-semibold text-gray-800">
                  Helpful Health Assistant
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                "The chatbot helped me understand my medication side effects and
                when I should contact my doctor. It's like having a nurse
                available 24/7."
              </p>
              <p className="font-medium text-gray-700">- Michael Brown, 62</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-teal-50">
            Register today to book appointments with specialists, track your
            health progress, and get personalized care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/register')} className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg hover:shadow-md transition-all">
              Create an Account
            </button>
            <button onClick={() => navigate('/chatbot')} className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg border border-teal-400 hover:bg-teal-700 transition-all">
              Ask Health Assistant
            </button>
          </div>
        </div>
      </section>
    </div>;
};
export default LandingPage;