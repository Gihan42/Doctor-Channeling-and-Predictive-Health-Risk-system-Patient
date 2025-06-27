import { useNavigate } from 'react-router-dom';
import { Heart, Activity, UserCheck, MessageSquare, Calendar } from 'lucide-react';
import RiskAssessmentForm from '../components/health/RiskAssessmentForm';
import { useEffect, useRef, useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // References for sections to observe
  const sectionRefs = {
    hero: useRef(null),
    features: useRef(null),
    riskAssessment: useRef(null),
    testimonials: useRef(null),
    cta: useRef(null),
  };

  // Function to validate JWT token
  const validateToken = () => {
    try {
      const token =  localStorage.getItem('jwt') ;

      if (!token) {
        setIsTokenValid(false);
        setIsCheckingToken(false);
        return;
      }

      // Decode JWT token to check expiration
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        setIsTokenValid(false);
        setIsCheckingToken(false);
        return;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired, remove it
        localStorage.removeItem('token');
        localStorage.removeItem('jwt');
        localStorage.removeItem('authToken');
        setIsTokenValid(false);
        setIsCheckingToken(false);
        return;
      }

      // Token is valid
      setIsTokenValid(true);
      setIsCheckingToken(false);
    } catch (error) {
      console.error('Error validating token:', error);
      // If there's an error parsing the token, consider it invalid
      localStorage.removeItem('token');
      localStorage.removeItem('jwt');
      localStorage.removeItem('authToken');
      setIsTokenValid(false);
      setIsCheckingToken(false);
    }
  };

  // Handle Channel a Doctor button click
  const handleChannelDoctorClick = () => {
    if (isTokenValid) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  useEffect(() => {
    // Validate token on component mount
    validateToken();

    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-on-scroll');
              // Optional: Stop observing after animation triggers to improve performance
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2, // Trigger when 20% of the section is visible
          rootMargin: '0px 0px -50px 0px', // Slight offset for smoother triggering
        }
    );

    // Observe each section
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    // Cleanup observer on component unmount
    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  return (
      <div className="w-full">
        {/* Hero Section */}
        <section
            ref={sectionRefs.hero}
            className="bg-gradient-to-r from-teal-50 to-blue-50 text-gray-800 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 animate-slide-in-left">
                  Specialized Healthcare for Heart and Cancer Patients
                </h1>
                <p className="text-xl mb-8 text-gray-600 animate-slide-in-left animation-delay-200">
                  Early detection and specialized care can save lives. Check your
                  risk factors and connect with specialists through our advanced
                  channeling system.
                </p>
                <div className="flex flex-wrap gap-4 animate-slide-in-left animation-delay-400">
                  <button
                      onClick={() =>
                          document.getElementById('risk-assessment')?.scrollIntoView({
                            behavior: 'smooth',
                          })
                      }
                      className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg shadow-sm hover:shadow-md transition-all border border-teal-100 hover:scale-105 hover:-translate-y-1 transform duration-300"
                  >
                    Check My Health
                  </button>
                  <button
                      onClick={handleChannelDoctorClick}
                      disabled={isCheckingToken}
                      className="px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:from-teal-500 hover:to-teal-600 transition-all hover:scale-105 hover:-translate-y-1 transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingToken ? 'Loading...' : 'Channel a Doctor'}
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Doctor with patient"
                    className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500 hover:scale-105 transform animate-slide-in-right"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={sectionRefs.features} className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in-up">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 animate-fade-in-up animation-delay-100 hover:scale-105 hover:-translate-y-2 transform duration-300 group">
                <div className="bg-teal-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors duration-300 group-hover:scale-110 transform">
                  <Heart className="h-6 w-6 text-teal-500 group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Risk Assessment
                </h3>
                <p className="text-gray-600">
                  Check your risk factors for heart disease and cancer with our
                  AI-powered assessment tool.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 animate-fade-in-up animation-delay-200 hover:scale-105 hover:-translate-y-2 transform duration-300 group">
                <div className="bg-green-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors duration-300 group-hover:scale-110 transform">
                  <Activity className="h-6 w-6 text-green-500 group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Specialized Care
                </h3>
                <p className="text-gray-600">
                  Connect with specialists in cardiology and oncology for
                  personalized treatment plans.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 animate-fade-in-up animation-delay-300 hover:scale-105 hover:-translate-y-2 transform duration-300 group">
                <div className="bg-purple-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors duration-300 group-hover:scale-110 transform">
                  <MessageSquare className="h-6 w-6 text-purple-500 group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Health Assistant
                </h3>
                <p className="text-gray-600">
                  Get answers to your health questions with our AI-powered chatbot
                  assistant.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 animate-fade-in-up animation-delay-400 hover:scale-105 hover:-translate-y-2 transform duration-300 group">
                <div className="bg-pink-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors duration-300 group-hover:scale-110 transform">
                  <Calendar className="h-6 w-6 text-pink-500 group-hover:animate-pulse" />
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
        <section
            id="risk-assessment"
            ref={sectionRefs.riskAssessment}
            className="py-16 bg-gray-50"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 animate-fade-in-up">
                Check Your Health Risk
              </h2>
              <p className="text-lg text-gray-600 animate-fade-in-up">
                Answer a few questions to assess your risk for heart disease or
                cancer. No registration required.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 animate-fade-in-up animation-delay-200 hover:shadow-md transition-shadow duration-300">
              <RiskAssessmentForm />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section ref={sectionRefs.testimonials} className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in-up">
              Patient Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-teal-50 p-6 rounded-xl animate-fade-in-up animation-delay-100 hover:scale-105 hover:-translate-y-2 transform transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <UserCheck className="h-5 w-5 text-teal-500 mr-2 animate-bounce" />
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
              <div className="bg-green-50 p-6 rounded-xl animate-fade-in-up animation-delay-200 hover:scale-105 hover:-translate-y-2 transform transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <UserCheck className="h-5 w-5 text-green-500 mr-2 animate-bounce animation-delay-100" />
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
              <div className="bg-purple-50 p-6 rounded-xl animate-fade-in-up animation-delay-300 hover:scale-105 hover:-translate-y-2 transform transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <UserCheck className="h-5 w-5 text-purple-500 mr-2 animate-bounce animation-delay-200" />
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
        <section
            ref={sectionRefs.cta}
            className="py-16 bg-gradient-to-r from-teal-500 to-teal-600 text-white overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6 animate-fade-in-up">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-teal-50 animate-fade-in-up animation-delay-200">
              {isTokenValid
                  ? "Access your dashboard to manage appointments and track your health progress."
                  : "Register today to book appointments with specialists, track your health progress, and get personalized care."
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-400">
              <button
                  onClick={handleChannelDoctorClick}
                  disabled={isCheckingToken}
                  className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg hover:shadow-md transition-all hover:scale-105 hover:-translate-y-1 transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingToken
                    ? 'Loading...'
                    : isTokenValid
                        ? 'Go to Dashboard'
                        : 'Create an Account'
                }
              </button>
              <button
                  onClick={() => navigate('/chatbot')}
                  className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg border border-teal-400 hover:bg-teal-700 transition-all hover:scale-105 hover:-translate-y-1 transform duration-300"
              >
                Ask Health Assistant
              </button>
            </div>
          </div>
        </section>

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /* Initially hide elements with animations */
          .animate-fade-in-up,
          .animate-slide-in-left,
          .animate-slide-in-right {
            opacity: 0;
            transform: translateY(30px); /* Default for fadeInUp */
          }

          .animate-slide-in-left {
            transform: translateX(-50px);
          }

          .animate-slide-in-right {
            transform: translateX(50px);
          }

          /* Apply animations when section is in view */
          .animate-on-scroll .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .animate-on-scroll .animate-slide-in-left {
            animation: slideInLeft 0.8s ease-out forwards;
          }

          .animate-on-scroll .animate-slide-in-right {
            animation: slideInRight 0.8s ease-out forwards;
          }

          .animation-delay-100 {
            animation-delay: 0.1s;
          }

          .animation-delay-200 {
            animation-delay: 0.2s;
          }

          .animation-delay-300 {
            animation-delay: 0.3s;
          }

          .animation-delay-400 {
            animation-delay: 0.4s;
          }

          /* Smooth scroll behavior */
          html {
            scroll-behavior: smooth;
          }
        `}</style>
      </div>
  );
};

export default LandingPage;