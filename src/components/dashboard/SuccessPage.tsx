import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Get session_id from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (sessionId) {
            // Retrieve pending payment details from localStorage
            const pendingPaymentStr = localStorage.getItem('pendingPayment');

            if (pendingPaymentStr) {
                const pendingPayment = JSON.parse(pendingPaymentStr);

                // Clear the pending payment from localStorage
                localStorage.removeItem('pendingPayment');

                // Navigate to confirmation page with all the details
                navigate('/dashboard/confirmation', {
                    state: {
                        doctor: pendingPayment.doctor,
                        date: pendingPayment.date,
                        timeSlot: pendingPayment.timeSlot,
                        medicalCenter: pendingPayment.medicalCenter,
                        medicalCenterId: pendingPayment.medicalCenterId,
                        paymentAmount: pendingPayment.paymentAmount,
                        paymentMethod: pendingPayment.paymentMethod,
                        channelNumber: Math.floor(Math.random() * 100) + 1, // Random channel number
                        sessionId: sessionId
                    }
                });
            } else {
                // No pending payment found, redirect to dashboard
                console.error('No pending payment details found');
                navigate('/dashboard');
            }
        } else {
            // No session ID, redirect to dashboard
            console.error('No session ID found');
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Payment Successful!
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Processing your appointment booking...
                        </p>
                        <div className="mt-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;