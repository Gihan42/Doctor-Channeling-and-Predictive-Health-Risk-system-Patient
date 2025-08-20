import { useNavigate } from 'react-router-dom';
import { Heart, Activity, UserCheck, MessageSquare, Calendar, X, CheckCircle, AlertCircle } from 'lucide-react';
import RiskAssessmentForm from '../components/health/RiskAssessmentForm';
import { useEffect, useRef, useState } from 'react';

// Type declarations
declare global {
  interface Window {
    toastTimeout: NodeJS.Timeout | null;
  }
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

interface PatientReview {
  patientReviewId: number;
  date: string;
  comment: string;
  status: string;
  patientName: string;
  viewed: boolean;
}

interface ApiResponse {
  code: number;
  message: string;
  data: PatientReview[];
}

interface CommentData {
  patientReviewId: number;
  comment: string;
  patientId: number;
  date: string;
  viewed: boolean;
  status: string;
}

const LandingPage = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [patientReviews, setPatientReviews] = useState<PatientReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Initialize window property
  window.toastTimeout = null;

  // References for sections to observe
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    riskAssessment: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
    cta: useRef<HTMLDivElement>(null),
  };

  // Fetch patient reviews
  const fetchPatientReviews = async () => {
    setIsLoadingReviews(true);
    setReviewsError(null);
    
    try {
      const response = await fetch(`${baseUrl}comments/getAllReviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient reviews');
      }

      const data: ApiResponse = await response.json();
      setPatientReviews(data.data || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setReviewsError(error.message);
      } else {
        setReviewsError('An unknown error occurred');
      }
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Show toast notification with auto-dismiss
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    if (window.toastTimeout) {
      clearTimeout(window.toastTimeout);
    }
    window.toastTimeout = setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Function to validate JWT token
  const validateToken = () => {
    try {
      const token = localStorage.getItem('jwt');

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

  // Get today's date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const patientId = localStorage.getItem('id');
      if (!patientId) {
        throw new Error('You need to be logged in to submit a comment');
      }

      const commentData: CommentData = {
        patientReviewId: 0,
        comment: comment,
        patientId: parseInt(patientId),
        date: getCurrentDate(),
        viewed: false,
        status: "ACTIVE"
      };

      const response = await fetch(`${baseUrl}comments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`
        },
        body: JSON.stringify(commentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit comment');
      }

      // Success - reset form and close modal
      setComment('');
      setIsModalOpen(false);
      setSubmitError(null);
      fetchPatientReviews(); // Refresh reviews after submission
      showToast('Your comment has been submitted successfully.', 'success');
      
    } catch (error: unknown) {
      let errorMessage = 'An error occurred while submitting your comment';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error submitting comment:', error);
      setSubmitError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close toast manually
  const closeToast = () => {
    if (window.toastTimeout) {
      clearTimeout(window.toastTimeout);
    }
    setToast(null);
  };

  // Helper function to get CTA button text
  const getCtaButtonText = () => {
    if (isCheckingToken) return 'Loading...';
    return isTokenValid ? 'Channel Your Doctor' : 'Create an Account';
  };

  useEffect(() => {
    // Validate token on component mount
    validateToken();
    fetchPatientReviews();

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
      // Clear toast timeout on unmount
      if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
      }
    };
  }, []);

  return (
    <div className="w-full relative">
      {/* Enhanced Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl transition-all duration-500 transform ${
          toast.type === 'success' 
            ? 'bg-white border-l-4 border-black text-black' 
            : 'bg-black border-l-4 border-gray-400 text-white'
        } flex items-center max-w-md animate-toast-slide-in`}>
          <div className="mr-3 flex-shrink-0">
            {toast.type === 'success' ? (
              <CheckCircle className="h-6 w-6 text-black" />
            ) : (
              <AlertCircle className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button 
            onClick={closeToast}
            className={`ml-3 flex-shrink-0 transition-colors duration-200 ${
              toast.type === 'success' 
                ? 'text-black hover:text-gray-600' 
                : 'text-white hover:text-gray-300'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

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
                  {getCtaButtonText()}
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
          
          {isLoadingReviews ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : reviewsError ? (
            <div className="text-center py-8 text-red-500">
              <p>Failed to load patient stories. Please try again later.</p>
              <button 
                onClick={fetchPatientReviews}
                className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                Retry
              </button>
            </div>
          ) : patientReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {patientReviews.map((review, index) => (
                <div 
                  key={review.patientReviewId} 
                  className={`bg-teal-50 p-6 rounded-xl animate-fade-in-up animation-delay-${(index % 3 + 1) * 100} hover:scale-105 hover:-translate-y-2 transform transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-center mb-4">
                    <UserCheck className="h-5 w-5 text-teal-500 mr-2 animate-bounce" />
                    <h3 className="font-semibold text-gray-800">
                      {review.patientName}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No patient stories available yet.</p>
            </div>
          )}
          
          <div className="text-center mt-12 animate-fade-in-up animation-delay-400">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-white text-teal-600 font-medium rounded-lg hover:bg-teal-600 transition-all
               hover:scale-105 hover:-translate-y-1 transform duration-300 border-2 border-teal-400 hover:text-white"
            >
              Share Your Story
            </button>
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
              {getCtaButtonText()}
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

      {/* Comment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-modal-enter">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Share Your Story</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSubmitError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCommentSubmit}>
              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Experience
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Tell us about your experience with our services..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmitError(null);
                  }}
                  className="mr-3 px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center min-w-20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
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

        .animate-modal-enter {
          animation: modalEnter 0.3s ease-out forwards;
        }

        .animate-toast-slide-in {
          animation: toastSlideIn 0.5s ease-out forwards;
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