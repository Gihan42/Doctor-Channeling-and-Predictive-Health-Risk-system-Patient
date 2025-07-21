import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon, FileTextIcon, DownloadIcon, PrinterIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  channelingRoomId: number;
  appointmentStatus: string;
  appointmentDate: string;
  appointmentTime: string;
  channelingNumber: number;
  medicalCenterName: string;
  doctorName: string;
  doctorImage?: string;
  address?: string;
  queueStatus?: string;
  estimatedWaitTime?: string;
  notes?: string;
  prescription?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  medicalRecords?: {
    date: string;
    type: string;
    result: string;
    notes: string;
  }[];
}

const AppointmentDetails = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const patientId = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        if (!patientId) {
          throw new Error('Patient ID not found in localStorage');
        }

        if (!token) {
          throw new Error('Authentication token not found');
        }

        // First, fetch all appointments for the patient
        const response = await fetch(
            `${baseUrl}appointment/getAppointmentDetailsByPatientId?patientId=${patientId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 200) {
          // Find the specific appointment by channelingRoomId
          const specificAppointment = data.data.find(
              (appointment: Appointment) => appointment.channelingRoomId.toString() === id
          );

          if (specificAppointment) {
            setAppointment(specificAppointment);
          } else {
            throw new Error('Appointment not found');
          }
        } else {
          throw new Error(data.message || 'Failed to fetch appointment details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time (assuming HH:MM:SS format)
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleDownloadRecords = () => {
    toast.success('Medical records downloaded successfully');
  };

  const handlePrintDetails = () => {
    window.print();
  };

  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
          `${baseUrl}appointment/cancelAppointment`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              appointmentId: id,
              reason: cancelReason
            })
          }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code === 200) {
        toast.success('Appointment cancelled successfully');
        setIsCancelModalOpen(false);
        navigate('/dashboard/history');
      } else {
        throw new Error(data.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel appointment');
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
    );
  }

  if (!appointment) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-gray-500 mb-4">Appointment not found</div>
          <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
    );
  }

  return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Appointment Details</h1>
            <div>
            <span className={`text-xs px-2 py-1 rounded-full ${
                appointment.appointmentStatus === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.appointmentStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
            }`}>
              {appointment.appointmentStatus}
            </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Doctor and Appointment Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start">
                <img
                    src={appointment.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'}
                    alt={appointment.doctorName}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">
                    {appointment.doctorName}
                  </h2>
                  <p className="text-gray-600">Doctor</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{formatTime(appointment.appointmentTime)}</span>
                </div>
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p>{appointment.medicalCenterName}</p>
                    <p className="text-sm text-gray-500">{appointment.address || 'No address provided'}</p>
                  </div>
                </div>
                {appointment.appointmentStatus === 'Pending' && (
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h3 className="font-medium text-blue-800 mb-2">
                        Queue Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-600">Channel Number</p>
                          <p className="text-lg font-semibold text-blue-700">
                            {appointment.channelingNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Current Status</p>
                          <p className="text-lg font-semibold text-blue-700">
                            {appointment.queueStatus || 'Not available'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Estimated Wait Time</p>
                        <p className="text-blue-700">
                          {appointment.estimatedWaitTime || 'Not available'}
                        </p>
                      </div>
                    </div>
                )}
              </div>
              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                    onClick={handlePrintDetails}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print Details
                </button>
                {appointment.appointmentStatus === 'Pending' && (
                    <button
                        onClick={() => setIsCancelModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <XIcon className="h-4 w-4 mr-2" />
                      Cancel Appointment
                    </button>
                )}
              </div>
            </div>
            {/* Medical Records */}
            <div className="lg:col-span-1">
              {appointment.appointmentStatus === 'Completed' ? (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Medical Records</h3>
                      <button
                          onClick={handleDownloadRecords}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                    {appointment.prescription && appointment.prescription.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Prescription</h4>
                          <ul className="space-y-2">
                            {appointment.prescription.map((med, index) => (
                                <li key={index} className="text-sm border-l-2 border-blue-500 pl-3 py-1">
                                  <div className="font-medium">
                                    {med.name} ({med.dosage})
                                  </div>
                                  <div className="text-gray-600">
                                    {med.frequency} for {med.duration}
                                  </div>
                                </li>
                            ))}
                          </ul>
                        </div>
                    )}
                    {appointment.medicalRecords && appointment.medicalRecords.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Test Results</h4>
                          <ul className="space-y-3">
                            {appointment.medicalRecords.map((record, index) => (
                                <li key={index} className="text-sm">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{record.type}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        record.result === 'Normal'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                              {record.result}
                            </span>
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    {new Date(record.date).toLocaleDateString()}
                                  </div>
                                  {record.notes && (
                                      <div className="text-gray-600 mt-1">
                                        {record.notes}
                                      </div>
                                  )}
                                </li>
                            ))}
                          </ul>
                        </div>
                    )}
                    {appointment.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">Doctor's Notes</h4>
                          <p className="text-sm text-gray-600">{appointment.notes}</p>
                        </div>
                    )}
                  </div>
              ) : (
                  <div className="border rounded-lg p-6 text-center">
                    <FileTextIcon className="h-8 w-8 text-gray-400 mx-auto" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No medical records yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Medical records will be available after your appointment.
                    </p>
                  </div>
              )}
            </div>
          </div>
        </div>
        {/* Cancel Appointment Modal */}

        {isCancelModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Cancel Appointment</h3>
                  <button
                      onClick={() => setIsCancelModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="mb-4 text-gray-600">
                  Are you sure you want to cancel your appointment with{' '}
                  {appointment.doctorName} on {formatDate(appointment.appointmentDate)} at{' '}
                  {formatTime(appointment.appointmentTime)}?
                </p>
                <div className="mb-4">
                  <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for cancellation
                  </label>
                  <textarea
                      id="cancelReason"
                      rows={3}
                      value={cancelReason}
                      onChange={e => setCancelReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please provide a reason for cancellation"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                      onClick={() => setIsCancelModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Keep Appointment
                  </button>
                  <button
                      onClick={handleCancelAppointment}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AppointmentDetails;