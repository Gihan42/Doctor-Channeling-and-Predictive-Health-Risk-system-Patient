import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCardIcon, CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from 'lucide-react';

interface PaymentRequest {
  medicalCenterId: number;
  doctorId: number;
  patientId: number;
  amount: number;
  paymentMethod: 'card' | 'paypal';
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    doctor,
    date,
    timeSlot,
    medicalCenter,
    medicalCenterId,
    medicalCenterFee = 0,
    doctorFee = 0
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Calculate fees based on passed values
  const totalFee = medicalCenterFee + doctorFee;



  const formatDate = (date: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const createPayment = async (method: 'card' | 'paypal') => {
    try {
      setIsProcessing(true);
      setPaymentError(null);

      const token = localStorage.getItem('jwt');
      const patientId = localStorage.getItem('id');

      if (!token || !patientId) {
        throw new Error('Authentication required. Please login.');
      }

      // Store payment details in localStorage before redirecting
      localStorage.setItem('pendingPayment', JSON.stringify({
        doctor,
        date,
        timeSlot,
        medicalCenter,
        paymentAmount: totalFee,
        paymentMethod: method
      }));

      const paymentData: PaymentRequest = {
        medicalCenterId,
        doctorId: doctor.id,
        patientId: parseInt(patientId),
        amount: totalFee,
        paymentMethod: method
      };

      const response = await fetch('http://localhost:8080/api/v1/payment/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const data = await response.json();

      if (data.code === 200) {
        // For both card and PayPal, redirect to the session URL
        if (data.data?.sessionUrl) {
          window.location.href = data.data.sessionUrl;
        } else {
          throw new Error('No payment session URL received');
        }
      } else {
        throw new Error(data.message || 'Payment failed');
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Payment processing failed');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = () => {
    createPayment('card');
  };

  const handlePayPalPayment = () => {
    createPayment('paypal');
  };

  if (!doctor || !date || !timeSlot) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <CreditCardIcon className="h-10 w-10 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No appointment details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Please go back and select a doctor, date, and time slot.
            </p>
            <div className="mt-6">
              <button
                  onClick={() => navigate('/dashboard/channel')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Channel Doctor
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-xl font-semibold">Payment</h1>
          <p className="text-blue-100">Complete your appointment booking</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointment Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-4">Appointment Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <p className="text-sm">{formatDate(date)}</p>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <p className="text-sm">{timeSlot}</p>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <p className="text-sm">{medicalCenter}</p>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Doctor Fee</span>
                    <span className="text-sm">Rs. {doctorFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medical Center Fee</span>
                    <span className="text-sm">Rs. {medicalCenterFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>Rs. {totalFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <h2 className="font-semibold mb-4">Payment Method</h2>
              {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                    {paymentError}
                  </div>
              )}
              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border rounded-lg flex items-center justify-center ${
                          paymentMethod === 'card'
                              ? 'bg-blue-50 border-blue-500'
                              : 'border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <CreditCardIcon className="h-5 w-5 mr-2 text-gray-600" />
                    <span>Credit/Debit Card</span>
                  </button>
                  <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 border rounded-lg flex items-center justify-center ${
                          paymentMethod === 'paypal'
                              ? 'bg-blue-50 border-blue-500'
                              : 'border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 8.25C19.5 11.0709 17.0709 13.5 14.25 13.5H10.5C10.0858 13.5 9.75 13.8358 9.75 14.25C9.75 14.6642 10.0858 15 10.5 15H15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17H10.5C9.5335 17 8.75 16.2165 8.75 15.25V14.25C8.75 13.2835 9.5335 12.5 10.5 12.5H14.25C16.4591 12.5 18.25 10.7091 18.25 8.5C18.25 6.29086 16.4591 4.5 14.25 4.5H5C4.44772 4.5 4 4.94772 4 5.5C4 6.05228 4.44772 6.5 5 6.5H14.25C15.3546 6.5 16.25 7.39543 16.25 8.5C16.25 9.60457 15.3546 10.5 14.25 10.5H6.5C5.94772 10.5 5.5 10.0523 5.5 9.5C5.5 8.94772 5.94772 8.5 6.5 8.5H12.75C13.3023 8.5 13.75 8.05228 13.75 7.5C13.75 6.94772 13.3023 6.5 12.75 6.5H6.5C5.11929 6.5 4 7.61929 4 9C4 10.3807 5.11929 11.5 6.5 11.5H14.25C16.5972 11.5 18.5 9.59721 18.5 7.25" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>PayPal</span>
                  </button>
                </div>

                {/* Credit Card Payment */}
                {paymentMethod === 'card' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-sm text-blue-700">
                          You will be redirected to Stripe's secure payment page to complete
                          your payment of Rs. {totalFee.toFixed(2)}.
                        </p>
                      </div>
                      <button
                          onClick={handleCardPayment}
                          disabled={isProcessing}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
                      >
                        {isProcessing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Redirecting to Stripe...
                            </>
                        ) : `Pay Rs. ${totalFee.toFixed(2)} with Card`}
                      </button>
                    </div>
                )}

                {/* PayPal Payment */}
                {paymentMethod === 'paypal' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-sm text-blue-700">
                          You will be redirected to PayPal to complete the payment
                          of Rs. {totalFee.toFixed(2)}.
                        </p>
                      </div>
                      <button
                          onClick={handlePayPalPayment}
                          disabled={isProcessing}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
                      >
                        {isProcessing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Redirecting to PayPal...
                            </>
                        ) : 'Continue to PayPal'}
                      </button>
                    </div>
                )}

                {!paymentMethod && (
                    <div className="py-8 text-center text-gray-500">
                      Please select a payment method to continue.
                    </div>
                )}

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Your payment is secure and encrypted. By proceeding, you agree
                    to our Terms of Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PaymentPage;