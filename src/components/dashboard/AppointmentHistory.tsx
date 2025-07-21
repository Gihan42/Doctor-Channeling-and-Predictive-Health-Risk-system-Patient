import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, SearchIcon, FilterIcon } from 'lucide-react';

interface Appointment {
  channelingRoomId: number;
  appointmentStatus: string;
  appointmentDate: string;
  appointmentTime: string;
  channelingNumber: number;
  medicalCenterName: string;
  doctorName: string;
  notes?: string;
}

const AppointmentHistory = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Completed'>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const patientId = localStorage.getItem('id');
        const token = localStorage.getItem('jwt');
        if (!patientId) {
          throw new Error('Patient ID not found in local storage');
        }
        if (!token) {
          throw new Error('Authentication token not found');
        }
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
          setAppointments(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch appointments');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Get unique specialties for filter dropdown (not available in your API response)
  // const specialties = Array.from(new Set(appointments.map(app => app.specialty)));

  // Filter appointments based on search term and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch =
        appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.medicalCenterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.appointmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display (assuming your time is in HH:MM:SS format)
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
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
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
    );
  }

  return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-xl font-semibold">Appointment History</h1>
          <p className="text-blue-100">View and manage your appointments</p>
        </div>
        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                  type="text"
                  placeholder="Search by doctor or medical center"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <FilterIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 mr-2">Status:</span>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as 'all' | 'Pending' | 'Completed')}
                    className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/dashboard/appointment/${appointment.channelingRoomId}`)}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 className="font-medium">{appointment.doctorName}</h3>
                          <p className="text-sm text-gray-500">
                            {appointment.medicalCenterName}
                          </p>
                        </div>
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${
                                appointment.appointmentStatus === 'Completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                    {appointment.appointmentStatus}
                  </span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{formatTime(appointment.appointmentTime)}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Channeling Number: {appointment.channelingNumber}
                      </div>
                      {appointment.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </p>
                          </div>
                      )}
                    </div>
                ))}
              </div>
          ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-10 w-10 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No appointments found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'You have no appointment history yet'}
                </p>
                <div className="mt-6">
                  <button
                      onClick={() => navigate('/dashboard/channel')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default AppointmentHistory;