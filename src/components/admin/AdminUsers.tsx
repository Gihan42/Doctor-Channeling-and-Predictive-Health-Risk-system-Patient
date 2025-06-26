import  { useState } from 'react';
import { Search, Filter, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import { toast } from 'sonner';
// Mock user data
const usersData = [{
  id: 1,
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '(555) 123-4567',
  registeredDate: '2023-01-15',
  status: 'active',
  appointments: 8
}, {
  id: 2,
  name: 'Sarah Johnson',
  email: 'sarah.j@example.com',
  phone: '(555) 234-5678',
  registeredDate: '2023-02-20',
  status: 'active',
  appointments: 5
}, {
  id: 3,
  name: 'Michael Brown',
  email: 'michael.b@example.com',
  phone: '(555) 345-6789',
  registeredDate: '2023-03-10',
  status: 'inactive',
  appointments: 0
}, {
  id: 4,
  name: 'Emily Davis',
  email: 'emily.d@example.com',
  phone: '(555) 456-7890',
  registeredDate: '2023-03-25',
  status: 'active',
  appointments: 3
}, {
  id: 5,
  name: 'Robert Wilson',
  email: 'robert.w@example.com',
  phone: '(555) 567-8901',
  registeredDate: '2023-04-05',
  status: 'active',
  appointments: 2
}, {
  id: 6,
  name: 'Jennifer Lee',
  email: 'jennifer.l@example.com',
  phone: '(555) 678-9012',
  registeredDate: '2023-04-15',
  status: 'inactive',
  appointments: 0
}];
const AdminUsers = () => {
  const [users, setUsers] = useState(usersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  // Filter users based on search term and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };
  const handleViewUser = (userId: number) => {
    // In a real app, this would navigate to a user detail page
    toast.info(`Viewing user ${userId}`);
  };
  const handleEditUser = (userId: number) => {
    // In a real app, this would open an edit form
    toast.info(`Editing user ${userId}`);
  };
  const handleDeleteClick = (userId: number) => {
    setSelectedUser(userId);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = () => {
    if (selectedUser) {
      // Filter out the deleted user
      setUsers(users.filter(user => user.id !== selectedUser));
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-xl font-semibold">User Management</h1>
        <p className="text-indigo-100">View and manage system users</p>
      </div>
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
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
          <button onClick={handleAddUser} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? filteredUsers.map(user => <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.registeredDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.appointments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleViewUser(user.id)} className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEditUser(user.id)} className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching your criteria
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{filteredUsers.length}</span> results
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
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>}
      {/* Add User Modal - Simplified for demo */}
      {isAddUserModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <p className="mb-4 text-gray-600">
              This is a placeholder for the add user form.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsAddUserModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => {
            setIsAddUserModalOpen(false);
            toast.success('User added successfully');
          }} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Add User
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export default AdminUsers;