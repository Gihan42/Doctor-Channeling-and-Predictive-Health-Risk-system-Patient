import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, ArrowRightIcon, BellIcon, AlertCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Appointment {
  channelingRoomId: number;
  appointmentStatus: string;
  appointmentDate: string;
  appointmentTime: string;
  channelingNumber: number;
  medicalCenterName: string;
  doctorName: string;
}

const DashboardHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointmentsByPatientId = async () => {
    try {
      const patientId = localStorage.getItem('id');
      const token = localStorage.getItem('jwt');

      if (!patientId) {
        throw new Error('Patient ID not found in localStorage');
      }

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
          `http://localhost:8080/api/v1/appointment/getAppointmentDetailsByPatientId?patientId=${patientId}`,
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
        // Filter for upcoming appointments (today and future dates)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = data.data.filter((appointment: Appointment) => {
          const appointmentDate = new Date(appointment.appointmentDate);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate >= today;
        });

        // Sort by date and time
        upcoming.sort((a: Appointment, b: Appointment) => {
          const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
          const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
          return dateA.getTime() - dateB.getTime();
        });

        setUpcomingAppointments(upcoming);
      } else {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = () => {
    const storedName = localStorage.getItem('userName') || 'User';
    setUserName(storedName);
    console.log(`Dashboard loaded. Welcome, ${storedName}`);
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAppointmentsByPatientId();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {userName}</h1>
              <p className="text-gray-600 mt-1">
                Here's an overview of your upcoming appointments and health status.
              </p>
            </div>
            <button
                onClick={() => navigate('/dashboard/channel')}
                className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-lg hover:from-teal-500 hover:to-teal-600 shadow-sm transition-all flex items-center"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              New Appointment
            </button>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Your Health Status
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex">
              <AlertCircleIcon className="h-5 w-5 text-amber-500 mr-2" />
              <div>
                <p className="text-sm text-amber-700 font-medium">
                  Medium Risk: Heart Disease
                </p>
                <p className="text-sm text-amber-600">
                  Based on your last risk assessment on May 1, 2023. Consider
                  scheduling a follow-up with a cardiologist.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Last Blood Pressure
              </h3>
              <p className="text-lg font-semibold text-gray-800">120/80 mmHg</p>
              <p className="text-xs text-gray-500">Recorded on May 5, 2023</p>
            </div>
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Last Cholesterol Check
              </h3>
              <p className="text-lg font-semibold text-gray-800">185 mg/dL</p>
              <p className="text-xs text-gray-500">Recorded on April 15, 2023</p>
            </div>
          </div>
          <button
              onClick={() => navigate('/')}
              className="mt-4 text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
          >
            Take New Risk Assessment
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Upcoming Appointments
            </h2>
            <button
                onClick={() => navigate('/dashboard/history')}
                className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
            >
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>

          {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
              </div>
          ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">Error loading appointments</div>
                <p className="text-sm text-gray-500">{error}</p>
                <button
                    onClick={fetchAppointmentsByPatientId}
                    className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  Retry
                </button>
              </div>
          ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment, index) => (
                    <div
                        key={`${appointment.channelingRoomId}-${index}`}
                        className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                        onClick={() => navigate(`/dashboard/appointment/${appointment.channelingRoomId}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {appointment.medicalCenterName}
                          </p>
                        </div>
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
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{formatTime(appointment.appointmentTime)}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Queue Number: {appointment.channelingNumber}
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <div className="text-center py-8">
                <ClockIcon className="h-10 w-10 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No upcoming appointments
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by booking your first appointment.
                </p>
                <div className="mt-6">
                  <button
                      onClick={() => navigate('/dashboard/channel')}
                      className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-lg hover:from-teal-500 hover:to-teal-600 shadow-sm transition-all"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            3 New
          </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start p-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0">
                <BellIcon className="h-5 w-5 text-teal-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  Appointment reminder
                </p>
                <p className="text-sm text-gray-600">
                  Your appointment with Dr. Sarah Johnson is tomorrow at 10:30 AM.
                </p>
                <p className="mt-1 text-xs text-gray-400">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0">
                <BellIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  Medication reminder
                </p>
                <p className="text-sm text-gray-600">
                  Don't forget to take your evening medication at 8:00 PM.
                </p>
                <p className="mt-1 text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0">
                <BellIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Health tip</p>
                <p className="text-sm text-gray-600">
                  Walking 30 minutes daily can significantly improve your heart health.
                </p>
                <p className="mt-1 text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DashboardHome;