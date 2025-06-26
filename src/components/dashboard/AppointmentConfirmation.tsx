import  { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, DownloadIcon, PrinterIcon, MailIcon, CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
const AppointmentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const {
    doctor,
    date,
    timeSlot,
    medicalCenter,
    paymentAmount,
    paymentMethod,
    channelNumber
  } = location.state || {};
  // Format date for display
  const formatDate = (date: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    // For demo purposes, we'll just show a toast
    toast.success('Appointment details downloaded successfully');
  };
  const handlePrint = () => {
    window.print();
  };
  const handleEmailConfirmation = () => {
    toast.success('Confirmation email sent successfully');
  };
  if (!doctor || !date || !timeSlot) {
    return <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <CheckCircleIcon className="h-10 w-10 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No appointment details
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please go back and make an appointment.
          </p>
          <div className="mt-6">
            <button onClick={() => navigate('/dashboard/channel')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Channel Doctor
            </button>
          </div>
        </div>
      </div>;
  }
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-600 p-6 text-white">
        <div className="flex items-center">
          <CheckCircleIcon className="h-8 w-8 mr-3" />
          <div>
            <h1 className="text-xl font-semibold">Appointment Confirmed</h1>
            <p className="text-green-100">
              Your appointment has been successfully booked
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* PDF Preview */}
        <div className="mb-6 border rounded-lg overflow-hidden" ref={pdfRef}>
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 mr-2">
                  MediCare
                </span>
                <span className="text-sm text-gray-500">
                  Appointment Confirmation
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Channel Number</div>
                <div className="text-xl font-bold text-blue-600">
                  {channelNumber}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Appointment Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium">{doctor.name}</p>
                      <p className="text-xs text-gray-500">
                        {doctor.specialization}
                      </p>
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
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Payment Method
                    </span>
                    <span className="text-sm font-medium">
                      {paymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount Paid</span>
                    <span className="text-sm font-medium">
                      Rs. {paymentAmount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Payment Status
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      Completed
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Transaction ID
                    </span>
                    <span className="text-sm font-medium">
                      TXN{Math.floor(Math.random() * 1000000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-3">Important Information</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  • Please arrive 15 minutes before your appointment time.
                </li>
                <li>• Bring your ID and any relevant medical records.</li>
                <li>• Wear a mask and follow COVID-19 safety protocols.</li>
                <li>
                  • You can track your queue position on the day of appointment.
                </li>
                <li>
                  • For cancellations, please contact us at least 24 hours in
                  advance.
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 p-4 border-t text-center text-xs text-gray-500">
            This is an electronically generated confirmation and doesn't require
            a signature.
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownloadPDF} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download PDF
          </button>
          <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </button>
          <button onClick={handleEmailConfirmation} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <MailIcon className="h-4 w-4 mr-2" />
            Email Confirmation
          </button>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-800 font-medium">
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>;
};
export default AppointmentConfirmation;