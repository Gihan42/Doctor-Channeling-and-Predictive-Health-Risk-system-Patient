import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, DownloadIcon, PrinterIcon, MailIcon, CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const AppointmentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const {
    doctor,
    date,
    timeSlot,
    medicalCenter,
    paymentAmount,
    paymentMethod,
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

  const handleDownloadPDF = async () => {
    if (!appointmentDetails) {
      toast.error('Please confirm appointment first');
      return;
    }

    const printContent = document.getElementById('print-content');
    if (!printContent) {
      toast.error('Could not generate PDF');
      return;
    }

    try {
      // Import dynamically to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');

      // Create a clone of the print content to avoid affecting the original
      const contentClone = printContent.cloneNode(true) as HTMLElement;
      contentClone.style.visibility = 'visible';
      contentClone.style.position = 'absolute';
      contentClone.style.left = '-9999px';
      document.body.appendChild(contentClone);

      // Generate canvas from HTML
      const canvas = await html2canvas.default(contentClone, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      // Remove the clone from DOM
      document.body.removeChild(contentClone);

      // Calculate PDF dimensions
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`Appointment-Confirmation-${doctor.name}-${date}.pdf`);
      toast.success('Appointment details downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handlePrint = () => {
    if (!appointmentDetails) {
      toast.error('Please confirm appointment first');
      return;
    }

    const printContent = document.getElementById('print-content');
    if (printContent) {
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Appointment Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .grid { display: grid; }
              .gap-6 { gap: 1.5rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-6 { margin-bottom: 1.5rem; }
              .pb-2 { padding-bottom: 0.5rem; }
              .border-b { border-bottom: 1px solid #e5e7eb; }
              .text-2xl { font-size: 1.5rem; line-height: 2rem; }
              .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
              .font-bold { font-weight: 700; }
              .font-semibold { font-weight: 600; }
              .font-medium { font-weight: 500; }
              .text-blue-600 { color: #2563eb; }
              .text-green-600 { color: #16a34a; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.focus();
      setTimeout(() => {
        printWindow?.print();
        printWindow?.close();
      }, 500);
    } else {
      window.print();
    }
  };

  const handleEmailConfirmation = async () => {
    if (!appointmentDetails) {
      toast.error('Please confirm appointment first');
      return;
    }

    setIsSendingEmail(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      console.log(userEmail)
      if (!userEmail) {
        toast.error('User email not found');
        return;
      }

      // Prepare template parameters
      const templateParams = {
        to_email: userEmail,
        doctor_name: doctor.name,
        specialization: doctor.specialization,
        appointment_date: formatDate(date),
        appointment_time: timeSlot,
        appointment_time_short: appointmentDetails?.appointmentTime || timeSlot,
        location: medicalCenter,
        channel_number: appointmentDetails?.channelNumber || 0,
        room_id: appointmentDetails?.roomId || 'N/A',
        payment_method: paymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal',
        amount_paid: `Rs. ${paymentAmount?.toFixed(2)}`,
        payment_status: 'Completed',
        transaction_id: `TXN${Math.floor(Math.random() * 1000000)}`,
        patient_name: localStorage.getItem('userName') || 'Patient'
      };

      // Replace these with your actual EmailJS credentials
      const serviceId = 'service_woa7734';
      const templateId = 'template_fvglk02';
      const publicKey = 'RpFx4AYQy_EW22Odl';

      // Send email using EmailJS
      const response = await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
      );

      if (response.status === 200) {
        toast.success('Confirmation email sent successfully');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send confirmation email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCreateAppointment = async () => {
    try {
      setIsCreating(true);

      // Get data from storage
      const token = localStorage.getItem('jwt');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        navigate('/login');
        return;
      }

      const doctorId = sessionStorage.getItem('selectedDoctorId');
      const patientId = localStorage.getItem('id');
      const patientName = localStorage.getItem('userName');
      const paymentId = localStorage.getItem("paymentId")
      const dayOfWeek = sessionStorage.getItem("selectedDay")
      const mediCenterIdStr = sessionStorage.getItem("medicalCenterId");
      const mediCenterId = mediCenterIdStr ? parseInt(mediCenterIdStr, 10) : null;

      const appointmentDateStr = sessionStorage.getItem("selectedDate");
      let formattedAppointmentDate = "2025-06-24"; // Default fallback

      if (appointmentDateStr) {
        const appointmentDate = new Date(appointmentDateStr);
        if (!isNaN(appointmentDate.getTime())) { // Check if valid date
          formattedAppointmentDate =
              `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, '0')}-${String(appointmentDate.getDate()).padStart(2, '0')}`;
        }
      }

      const now = new Date();
      const bookingDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const appointmentData = {
        id: 0,
        patientId: patientId ? parseInt(patientId) : 0,
        patientName: patientName || '',
        doctorId: doctorId ? parseInt(doctorId) : 0,
        medicleCenterId: mediCenterId,
        roomId: 0,
        sheduleId: 0,
        appointmentDate: formattedAppointmentDate,
        appointmentTime: "",
        channelNumber: 1,
        bookingDate: bookingDate,
        appointmentStatus: "PAID",
        paymentId: paymentId,
        dayOfWeek: dayOfWeek
      };

      const api = axios.create({
        baseURL: 'http://localhost:8080/api/v1',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const response = await api.post('/appointment/create', appointmentData);

      if (response.data.code === 200) {
        toast.success('Appointment created successfully!');
        setAppointmentDetails(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to create appointment');
      }
    } catch (error: any) {
      console.error('Error creating appointment:', error);

      if (error.response) {
        console.error('Backend error:', error.response.data);
        if (error.response.status === 400) {
          toast.error(`Validation error: ${JSON.stringify(error.response.data)}`);
        } else if (error.response.status === 403) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error(error.response.data.message || 'Failed to create appointment');
        }
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  if (!doctor || !date || !timeSlot) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <CheckCircleIcon className="h-10 w-10 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No appointment details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Please go back and make an appointment.
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
                  <div className="text-sm font-medium">Appointment Time</div>
                  <div className="text-sm font-bold text-gray-900">
                    {appointmentDetails?.appointmentTime || "0:00"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium">Channel Number</div>
                  <div className="text-xl font-bold text-blue-600">
                    {appointmentDetails?.channelNumber || 0}
                  </div>
                  {appointmentDetails?.roomId && (
                      <div className="text-sm font-medium mt-1">Room ID: {appointmentDetails.roomId}</div>
                  )}
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

          {/* Hidden content for printing/PDF */}
          <div className="hidden">
            <div id="print-content" className="p-4">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <div className="text-2xl font-bold text-blue-600">MediCare</div>
                <div className="text-right">
                  <div className="text-sm">Appointment Confirmation</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between">
                  <div>Appointment Time:</div>
                  <div>{appointmentDetails?.appointmentTime || timeSlot}</div>
                </div>
                <div className="flex justify-between">
                  <div>Channel Number:</div>
                  <div>{appointmentDetails?.channelNumber || 0}</div>
                </div>
                {appointmentDetails?.roomId && (
                    <div className="flex justify-between">
                      <div>Room ID:</div>
                      <div>{appointmentDetails.roomId}</div>
                    </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Appointment Details</h2>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Doctor:</span> {doctor.name}
                    </div>
                    <div>
                      <span className="font-medium">Specialization:</span> {doctor.specialization}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {formatDate(date)}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {timeSlot}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {medicalCenter}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{paymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Paid:</span>
                      <span>Rs. {paymentAmount?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className="text-green-600">Completed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span>TXN{Math.floor(Math.random() * 1000000)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!appointmentDetails ? (
                <button
                    onClick={handleCreateAppointment}
                    disabled={isCreating}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400"
                >
                  {isCreating ? 'Creating...' : 'Confirm Appointment'}
                </button>
            ) : null}

            <button
                onClick={handleDownloadPDF}
                disabled={!appointmentDetails}
                className={`flex items-center px-4 py-2 text-white rounded-md ${appointmentDetails ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'}`}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download PDF
            </button>

            <button
                onClick={handlePrint}
                disabled={!appointmentDetails}
                className={`flex items-center px-4 py-2 text-white rounded-md ${appointmentDetails ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>

            <button
                onClick={handleEmailConfirmation}
                disabled={!appointmentDetails || isSendingEmail}
                className={`flex items-center px-4 py-2 text-white rounded-md ${appointmentDetails ? 'bg-green-600 hover:bg-green-700' : 'bg-green-400 cursor-not-allowed'}`}
            >
              <MailIcon className="h-4 w-4 mr-2" />
              {isSendingEmail ? 'Sending...' : 'Email Confirmation'}
            </button>
          </div>
          <div className="mt-6 text-center">
            <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
  );
};

export default AppointmentConfirmation;