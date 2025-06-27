
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, ArrowRightIcon, BellIcon, AlertCircleIcon } from 'lucide-react';
import { useEffect,useState  } from 'react';
const DashboardHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  // Mock upcoming appointments
  const upcomingAppointments = [{
    id: 1,
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2023-05-15',
    time: '10:30 AM',
    location: 'Heart Care Center',
    status: 'confirmed'
  }, {
    id: 2,
    doctorName: 'Dr. Michael Chen',
    specialty: 'Oncologist',
    date: '2023-05-22',
    time: '2:15 PM',
    location: 'Cancer Treatment Institute',
    status: 'pending'
  }];

  const fetchDashboardData = () => {
    const storedName = localStorage.getItem('userName') || 'User';
    setUserName(storedName);
    console.log(`Dashboard loaded. Welcome, ${storedName}`);
  };

  useEffect(() => {
    fetchDashboardData();
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
  return <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {userName}</h1>
            <p className="text-gray-600 mt-1">
              Here's an overview of your upcoming appointments and health
              status.
            </p>
          </div>
          <button onClick={() => navigate('/dashboard/channel')} className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-lg hover:from-teal-500 hover:to-teal-600 shadow-sm transition-all flex items-center">
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
        <button onClick={() => navigate('/')} className="mt-4 text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center">
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
          <button onClick={() => navigate('/dashboard/history')} className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center">
            View All
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        {upcomingAppointments.length > 0 ? <div className="space-y-4">
            {upcomingAppointments.map(appointment => <div key={appointment.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm" onClick={() => navigate(`/dashboard/appointment/${appointment.id}`)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {appointment.doctorName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {appointment.specialty}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {appointment.location}
                </div>
              </div>)}
          </div> : <div className="text-center py-8">
            <ClockIcon className="h-10 w-10 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No upcoming appointments
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by booking your first appointment.
            </p>
            <div className="mt-6">
              <button onClick={() => navigate('/dashboard/channel')} className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-lg hover:from-teal-500 hover:to-teal-600 shadow-sm transition-all">
                Book Appointment
              </button>
            </div>
          </div>}
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
                Walking 30 minutes daily can significantly improve your heart
                health.
              </p>
              <p className="mt-1 text-xs text-gray-400">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default DashboardHome;