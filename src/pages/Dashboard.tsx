import { Routes, Route, useNavigate } from 'react-router-dom';
import { CalendarIcon, UserIcon, ClockIcon, SettingsIcon } from 'lucide-react';
import DashboardHome from '../components/dashboard/DashboardHome';
import DoctorChanneling from '../components/dashboard/DoctorChanneling';
import AppointmentHistory from '../components/dashboard/AppointmentHistory';
import AppointmentDetails from '../components/dashboard/AppointmentDetails';
import UserProfile from '../components/dashboard/UserProfile';
import PaymentPage from '../components/dashboard/PaymentPage';
import AppointmentConfirmation from '../components/dashboard/AppointmentConfirmation';



const Dashboard = () => {
  const navigate = useNavigate();
  const menuItems = [{
    name: 'Dashboard',
    icon: <CalendarIcon className="h-5 w-5" />,
    path: ''
  }, {
    name: 'Channel Doctor',
    icon: <UserIcon className="h-5 w-5" />,
    path: 'channel'
  }, {
    name: 'Appointment History',
    icon: <ClockIcon className="h-5 w-5" />,
    path: 'history'
  }, {
    name: 'Profile',
    icon: <SettingsIcon className="h-5 w-5" />,
    path: 'profile'
  }];

  return <div className="bg-gray-50 min-h-screen mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <h2 className="text-lg font-semibold">Patient Dashboard</h2>
                <p className="text-sm text-teal-100">
                  Manage your appointments
                </p>
              </div>
              <nav className="p-2">
                {menuItems.map(item => <button key={item.name} onClick={() => navigate(`/dashboard/${item.path}`)} className="w-full flex items-center px-4 py-3 text-left text-gray-600 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition-colors">
                    <span className="text-gray-500 mr-3">{item.icon}</span>
                    {item.name}
                  </button>)}
              </nav>
              <div className="p-4 border-t border-gray-100">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <h3 className="text-sm font-medium text-teal-800">
                    Need Help?
                  </h3>
                  <p className="text-xs text-teal-600 mt-1">
                    Contact our support team for assistance with your
                    appointments or account.
                  </p>
                  <button onClick={() => navigate('/chatbot')} className="mt-2 w-full text-center px-3 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white text-xs font-medium rounded-lg hover:from-teal-500 hover:to-teal-600 transition-all">
                    Ask Health Assistant
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/channel" element={<DoctorChanneling />} />
              <Route path="/history" element={<AppointmentHistory />} />
              <Route path="/appointment/:id" element={<AppointmentDetails />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/confirmation" element={<AppointmentConfirmation />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;