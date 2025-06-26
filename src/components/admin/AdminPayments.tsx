import { useState } from 'react';
import {Search, Filter, Eye, Download, Calendar, DollarSign, Clock, RefreshCcw} from 'lucide-react';
// Mock payment data
const paymentsData = [{
  id: 1,
  patientName: 'John Smith',
  doctorName: 'Dr. Sarah Johnson',
  appointmentDate: '2023-05-15',
  appointmentTime: '10:30 AM',
  amount: 2750,
  status: 'completed',
  paymentMethod: 'Credit Card',
  transactionId: 'TXN78945612',
  date: '2023-05-14'
}, {
  id: 2,
  patientName: 'Sarah Johnson',
  doctorName: 'Dr. Michael Chen',
  appointmentDate: '2023-05-22',
  appointmentTime: '2:15 PM',
  amount: 3500,
  status: 'completed',
  paymentMethod: 'PayPal',
  transactionId: 'TXN45612378',
  date: '2023-05-20'
}, {
  id: 3,
  patientName: 'Michael Brown',
  doctorName: 'Dr. Emily Rodriguez',
  appointmentDate: '2023-05-18',
  appointmentTime: '9:00 AM',
  amount: 2500,
  status: 'pending',
  paymentMethod: 'Bank Transfer',
  transactionId: 'TXN12378456',
  date: '2023-05-16'
}, {
  id: 4,
  patientName: 'Emily Davis',
  doctorName: 'Dr. James Wilson',
  appointmentDate: '2023-05-10',
  appointmentTime: '11:30 AM',
  amount: 3200,
  status: 'refunded',
  paymentMethod: 'Credit Card',
  transactionId: 'TXN36547891',
  date: '2023-05-08'
}, {
  id: 5,
  patientName: 'Robert Wilson',
  doctorName: 'Dr. Sarah Johnson',
  appointmentDate: '2023-05-05',
  appointmentTime: '3:45 PM',
  amount: 2750,
  status: 'completed',
  paymentMethod: 'Credit Card',
  transactionId: 'TXN96325874',
  date: '2023-05-04'
}, {
  id: 6,
  patientName: 'Jennifer Lee',
  doctorName: 'Dr. Michael Chen',
  appointmentDate: '2023-05-25',
  appointmentTime: '1:00 PM',
  amount: 3500,
  status: 'pending',
  paymentMethod: 'PayPal',
  transactionId: 'TXN74125896',
  date: '2023-05-23'
}];
const AdminPayments = () => {
  const [payments] = useState(paymentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  // Filter payments based on search term, status, and date
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || payment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) || payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesDate = !dateFilter || payment.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  // Format currency
  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toFixed(2)}`;
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-xl font-semibold">Payment Management</h1>
        <p className="text-indigo-100">
          View and manage all payment transactions
        </p>
      </div>
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search by patient, doctor, or transaction ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 mr-2">Status:</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 mr-2">Date:</span>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold mt-1">Rs. 18,200.00</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-2xl font-semibold mt-1">Rs. 6,000.00</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Refunds</p>
                <p className="text-2xl font-semibold mt-1">Rs. 3,200.00</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <RefreshCcw className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? filteredPayments.map(payment => <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.doctorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.appointmentDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.appointmentTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                    No payments found matching your criteria
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredPayments.length}</span> of{' '}
            <span className="font-medium">{filteredPayments.length}</span>{' '}
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
export default AdminPayments;