import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, SearchIcon, FilterIcon } from 'lucide-react';
// Mock data for appointments
const appointments = [{
  id: 1,
  doctorName: 'Dr. Sarah Johnson',
  specialty: 'Cardiologist',
  medicalCenter: 'Heart Care Center',
  date: '2023-05-15',
  time: '10:30 AM',
  status: 'completed',
  notes: 'Follow-up in 3 months. Continue with current medication.'
}, {
  id: 2,
  doctorName: 'Dr. Michael Chen',
  specialty: 'Oncologist',
  medicalCenter: 'Cancer Treatment Institute',
  date: '2023-05-22',
  time: '2:15 PM',
  status: 'upcoming',
  notes: ''
}, {
  id: 3,
  doctorName: 'Dr. Emily Rodriguez',
  specialty: 'Cardiologist',
  medicalCenter: 'General Hospital',
  date: '2023-04-10',
  time: '9:00 AM',
  status: 'completed',
  notes: 'Blood pressure has improved. Continue with diet and exercise plan.'
}, {
  id: 4,
  doctorName: 'Dr. James Wilson',
  specialty: 'Oncologist',
  medicalCenter: 'Medical Research Center',
  date: '2023-06-05',
  time: '11:30 AM',
  status: 'upcoming',
  notes: ''
}, {
  id: 5,
  doctorName: 'Dr. Sarah Johnson',
  specialty: 'Cardiologist',
  medicalCenter: 'Heart Care Center',
  date: '2023-03-20',
  time: '3:45 PM',
  status: 'completed',
  notes: 'ECG results normal. Reduced medication dosage.'
}];
const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  // Get unique specialties for filter dropdown
  const specialties = Array.from(new Set(appointments.map(app => app.specialty)));
  // Filter appointments based on search term, status, and specialty
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) || appointment.medicalCenter.toLowerCase().includes(searchTerm.toLowerCase()) || appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesSpecialty = specialtyFilter === 'all' || appointment.specialty === specialtyFilter;
    return matchesSearch && matchesStatus && matchesSpecialty;
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
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
            <input type="text" placeholder="Search by doctor, location, or specialty" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <FilterIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 mr-2">Status:</span>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as 'all' | 'upcoming' | 'completed')} className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center">
              <FilterIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 mr-2">Specialty:</span>
              <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All</option>
                {specialties.map((specialty, index) => <option key={index} value={specialty}>
                    {specialty}
                  </option>)}
              </select>
            </div>
          </div>
        </div>
        {/* Appointments List */}
        {filteredAppointments.length > 0 ? <div className="space-y-4">
            {filteredAppointments.map(appointment => <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/appointment/${appointment.id}`)}>
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h3 className="font-medium">{appointment.doctorName}</h3>
                    <p className="text-sm text-gray-500">
                      {appointment.specialty}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {appointment.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {appointment.medicalCenter}
                </div>
                {appointment.notes && <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span>{' '}
                      {appointment.notes}
                    </p>
                  </div>}
              </div>)}
          </div> : <div className="text-center py-8">
            <CalendarIcon className="h-10 w-10 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No appointments found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || specialtyFilter !== 'all' ? 'Try adjusting your search or filters' : 'You have no appointment history yet'}
            </p>
            <div className="mt-6">
              <button onClick={() => navigate('/dashboard/channel')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Book Appointment
              </button>
            </div>
          </div>}
      </div>
    </div>;
};
export default AppointmentHistory;