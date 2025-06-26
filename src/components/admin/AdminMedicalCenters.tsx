import  { useState } from 'react';
import { Search, Filter, Edit, Trash2, Plus, MapPin, Eye } from 'lucide-react';
import { toast } from 'sonner';
// Mock medical centers data
const medicalCentersData = [{
  id: 1,
  name: 'Heart Care Center',
  address: '123 Medical Ave, City',
  phone: '(555) 123-4567',
  email: 'info@heartcarecenter.com',
  specialties: ['Cardiology', 'Vascular Surgery'],
  doctors: 12,
  status: 'active'
}, {
  id: 2,
  name: 'Cancer Treatment Institute',
  address: '456 Health St, City',
  phone: '(555) 234-5678',
  email: 'info@cancertreatment.com',
  specialties: ['Oncology', 'Radiology', 'Hematology'],
  doctors: 18,
  status: 'active'
}, {
  id: 3,
  name: 'General Hospital',
  address: '789 Care Blvd, City',
  phone: '(555) 345-6789',
  email: 'info@generalhospital.com',
  specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
  doctors: 45,
  status: 'active'
}, {
  id: 4,
  name: 'Medical Research Center',
  address: '101 Science Dr, City',
  phone: '(555) 456-7890',
  email: 'info@medicalresearch.com',
  specialties: ['Oncology', 'Endocrinology', 'Neurology'],
  doctors: 20,
  status: 'inactive'
}, {
  id: 5,
  name: "Children's Medical Center",
  address: '202 Kids Way, City',
  phone: '(555) 567-8901',
  email: 'info@childrensmedical.com',
  specialties: ['Pediatrics', 'Pediatric Surgery', 'Child Psychology'],
  doctors: 15,
  status: 'active'
}];
const AdminMedicalCenters = () => {
  const [medicalCenters, setMedicalCenters] = useState(medicalCentersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddCenterModalOpen, setIsAddCenterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
  // Filter medical centers based on search term and status
  const filteredCenters = medicalCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) || center.address.toLowerCase().includes(searchTerm.toLowerCase()) || center.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || center.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const handleAddCenter = () => {
    setIsAddCenterModalOpen(true);
  };
  const handleViewCenter = (centerId: number) => {
    // In a real app, this would navigate to a center detail page
    toast.info(`Viewing medical center ${centerId}`);
  };
  const handleEditCenter = (centerId: number) => {
    // In a real app, this would open an edit form
    toast.info(`Editing medical center ${centerId}`);
  };
  const handleDeleteClick = (centerId: number) => {
    setSelectedCenter(centerId);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = () => {
    if (selectedCenter) {
      // Filter out the deleted center
      setMedicalCenters(medicalCenters.filter(center => center.id !== selectedCenter));
      toast.success('Medical center removed successfully');
      setIsDeleteModalOpen(false);
      setSelectedCenter(null);
    }
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-xl font-semibold">Medical Center Management</h1>
        <p className="text-indigo-100">View and manage healthcare facilities</p>
      </div>
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search medical centers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
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
          <button onClick={handleAddCenter} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Medical Center
          </button>
        </div>
        {/* Medical Centers Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialties
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctors
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
              {filteredCenters.length > 0 ? filteredCenters.map(center => <tr key={center.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {center.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-1" />
                        <div className="text-sm text-gray-900">
                          {center.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {center.phone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {center.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {center.specialties.map((specialty, index) => <span key={index} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                            {specialty}
                          </span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {center.doctors}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${center.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {center.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleViewCenter(center.id)} className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEditCenter(center.id)} className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(center.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No medical centers found matching your criteria
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredCenters.length}</span> of{' '}
            <span className="font-medium">{filteredCenters.length}</span>{' '}
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
              Are you sure you want to remove this medical center from the
              system? This action cannot be undone.
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
      {/* Add Center Modal - Simplified for demo */}
      {isAddCenterModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Add New Medical Center
            </h3>
            <p className="mb-4 text-gray-600">
              This is a placeholder for the add medical center form.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsAddCenterModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => {
            setIsAddCenterModalOpen(false);
            toast.success('Medical center added successfully');
          }} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Add Center
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export default AdminMedicalCenters;