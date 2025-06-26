import  { useState } from 'react';
import { Search, Filter, Calendar, CheckCircle, XCircle, Edit, Eye } from 'lucide-react';
// Mock appointment data
const appointmentsData = [{
  id: 1,
  patientName: 'John Smith',
  doctorName: 'Dr. Sarah Johnson',
  specialty: 'Cardiology',
  date: '2023-05-15',
  time: '10:30 AM',
  status: 'completed',
  medicalCenter: 'Heart Care Center'
}, {
  id: 2,
  patientName: 'Sarah Johnson',
  doctorName: 'Dr. Michael Chen',
  specialty: 'Oncology',
  date: '2023-05-22',
  time: '2:15 PM',
  status: 'upcoming',
  medicalCenter: 'Cancer Treatment Institute'
}, {
  id: 3,
  patientName: 'Michael Brown',
  doctorName: 'Dr. Emily Rodriguez',
  specialty: 'Cardiology',
  date: '2023-05-18',
  time: '9:00 AM',
  status: 'upcoming',
  medicalCenter: 'General Hospital'
}, {
  id: 4,
  patientName: 'Emily Davis',
  doctorName: 'Dr. James Wilson',
  specialty: 'Oncology',
  date: '2023-05-10',
  time: '11:30 AM',
  status: 'cancelled',
  medicalCenter: 'Medical Research Center'
}, {
  id: 5,
  patientName: 'Robert Wilson',
  doctorName: 'Dr. Sarah Johnson',
  specialty: 'Cardiology',
  date: '2023-05-05',
  time: '3:45 PM',
  status: 'completed',
  medicalCenter: 'Heart Care Center'
}, {
  id: 6,
  patientName: 'Jennifer Lee',
  doctorName: 'Dr. Michael Chen',
  specialty: 'Oncology',
  date: '2023-05-25',
  time: '1:00 PM',
  status: 'upcoming',
  medicalCenter: 'Cancer Treatment Institute'
}];
const AdminAppointments = () => {
  const [appointments] = useState(appointmentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  // Filter appointments based on search term, status, and date
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) || appointment.medicalCenter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesDate = !dateFilter || appointment.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-xl font-semibold">Appointment Management</h1>
        <p className="text-indigo-100">View and manage all appointments</p>
      </div>
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search appointments..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 mr-2">Status:</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 mr-2">Date:</span>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Center
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? filteredAppointments.map(appointment => <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patientName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.doctorName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.specialty}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(appointment.date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.medicalCenter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {appointment.status === 'upcoming' && <>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>}
                      </div>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No appointments found matching your criteria
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredAppointments.length}</span>{' '}
            of{' '}
            <span className="font-medium">{filteredAppointments.length}</span>{' '}
            results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default AdminAppointments;