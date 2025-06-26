import  { useState } from 'react';
import { Search, Filter, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import { toast } from 'sonner';
// Mock doctor data
const doctorsData = [{
  id: 1,
  name: 'Dr. Sarah Johnson',
  specialty: 'Cardiology',
  medicalCenter: 'Heart Care Center',
  email: 'sarah.j@example.com',
  phone: '(555) 123-4567',
  experience: '15 years',
  status: 'active',
  appointments: 125
}, {
  id: 2,
  name: 'Dr. Michael Chen',
  specialty: 'Oncology',
  medicalCenter: 'Cancer Treatment Institute',
  email: 'michael.c@example.com',
  phone: '(555) 234-5678',
  experience: '12 years',
  status: 'active',
  appointments: 98
}, {
  id: 3,
  name: 'Dr. Emily Rodriguez',
  specialty: 'Cardiology',
  medicalCenter: 'General Hospital',
  email: 'emily.r@example.com',
  phone: '(555) 345-6789',
  experience: '10 years',
  status: 'active',
  appointments: 87
}, {
  id: 4,
  name: 'Dr. James Wilson',
  specialty: 'Oncology',
  medicalCenter: 'Medical Research Center',
  email: 'james.w@example.com',
  phone: '(555) 456-7890',
  experience: '18 years',
  status: 'inactive',
  appointments: 0
}, {
  id: 5,
  name: 'Dr. Robert Thomas',
  specialty: 'Neurology',
  medicalCenter: 'General Hospital',
  email: 'robert.t@example.com',
  phone: '(555) 567-8901',
  experience: '20 years',
  status: 'active',
  appointments: 112
}, {
  id: 6,
  name: 'Dr. Lisa Adams',
  specialty: 'Endocrinology',
  medicalCenter: 'Medical Research Center',
  email: 'lisa.a@example.com',
  phone: '(555) 678-9012',
  experience: '8 years',
  status: 'active',
  appointments: 65
}];
const AdminDoctors = () => {
  const [doctors, setDoctors] = useState(doctorsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  // Get unique specialties for filter dropdown
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
  // Filter doctors based on search term, specialty and status
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.medicalCenter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });
  const handleAddDoctor = () => {
    setIsAddDoctorModalOpen(true);
  };
  const handleViewDoctor = (doctorId: number) => {
    // In a real app, this would navigate to a doctor detail page
    toast.info(`Viewing doctor ${doctorId}`);
  };
  const handleEditDoctor = (doctorId: number) => {
    // In a real app, this would open an edit form
    toast.info(`Editing doctor ${doctorId}`);
  };
  const handleDeleteClick = (doctorId: number) => {
    setSelectedDoctor(doctorId);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = () => {
    if (selectedDoctor) {
      // Filter out the deleted doctor
      setDoctors(doctors.filter(doctor => doctor.id !== selectedDoctor));
      toast.success('Doctor removed successfully');
      setIsDeleteModalOpen(false);
      setSelectedDoctor(null);
    }
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-xl font-semibold">Doctor Management</h1>
        <p className="text-indigo-100">View and manage healthcare providers</p>
      </div>
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search doctors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 mr-2">Specialty:</span>
            <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">All</option>
              {specialties.map((specialty, index) => <option key={index} value={specialty}>
                  {specialty}
                </option>)}
            </select>
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 mr-2">Status:</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button onClick={handleAddDoctor} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Doctor
          </button>
        </div>
        {/* Doctors Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Center
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
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
              {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {doctor.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.specialty}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.medicalCenter}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doctor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.experience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleViewDoctor(doctor.id)} className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEditDoctor(doctor.id)} className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(doctor.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No doctors found matching your criteria
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredDoctors.length}</span> of{' '}
            <span className="font-medium">{filteredDoctors.length}</span>{' '}
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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Removal</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to remove this doctor from the system? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Remove
              </button>
            </div>
          </div>
        </div>}
      {/* Add Doctor Modal - Simplified for demo */}
      {isAddDoctorModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Doctor</h3>
            <p className="mb-4 text-gray-600">
              This is a placeholder for the add doctor form.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsAddDoctorModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => {
            setIsAddDoctorModalOpen(false);
            toast.success('Doctor added successfully');
          }} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Add Doctor
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export default AdminDoctors;