import  { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Users, Calendar, DollarSign, UserPlus, Map, BarChart2, Home } from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUsers from '../components/admin/AdminUsers';
import AdminAppointments from '../components/admin/AdminAppointments';
import AdminPayments from '../components/admin/AdminPayments';
import AdminDoctors from '../components/admin/AdminDoctors';
import AdminMedicalCenters from '../components/admin/AdminMedicalCenters';
const AdminPanel = () => {
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/admin');
  const menuItems = [{
    name: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    path: '/admin'
  }, {
    name: 'Users',
    icon: <Users className="h-5 w-5" />,
    path: '/admin/users'
  }, {
    name: 'Appointments',
    icon: <Calendar className="h-5 w-5" />,
    path: '/admin/appointments'
  }, {
    name: 'Payments',
    icon: <DollarSign className="h-5 w-5" />,
    path: '/admin/payments'
  }, {
    name: 'Doctors',
    icon: <UserPlus className="h-5 w-5" />,
    path: '/admin/doctors'
  }, {
    name: 'Medical Centers',
    icon: <Map className="h-5 w-5" />,
    path: '/admin/centers'
  }];
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    navigate(path);
  };
  return <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-indigo-600 text-white">
                <h2 className="text-lg font-semibold">Admin Panel</h2>
                <p className="text-sm text-indigo-100">System Management</p>
              </div>
              <nav className="p-2">
                {menuItems.map(item => <button key={item.name} onClick={() => handleNavigate(item.path)} className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${currentPath === item.path ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'}`}>
                    <span className={`mr-3 ${currentPath === item.path ? 'text-indigo-500' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </button>)}
              </nav>
              <div className="p-4 border-t">
                <div className="p-3 bg-indigo-50 rounded-md">
                  <div className="flex items-center">
                    <BarChart2 className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="text-sm font-medium text-indigo-800">
                      Analytics Overview
                    </h3>
                  </div>
                  <p className="text-xs text-indigo-600 mt-1">
                    System activity is 15% higher than last week
                  </p>
                  <button onClick={() => handleNavigate('/admin')} className="mt-2 w-full text-center px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/appointments" element={<AdminAppointments />} />
              <Route path="/payments" element={<AdminPayments />} />
              <Route path="/doctors" element={<AdminDoctors />} />
              <Route path="/centers" element={<AdminMedicalCenters />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>;
};
export default AdminPanel;