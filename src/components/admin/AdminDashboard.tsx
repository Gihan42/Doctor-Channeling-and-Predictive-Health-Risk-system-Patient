import { Users, Calendar, DollarSign, UserPlus, Activity, TrendingUp, TrendingDown } from 'lucide-react';
const AdminDashboard = () => {
  // Mock statistics data
  const stats = [{
    name: 'Total Users',
    value: '3,854',
    icon: <Users className="h-6 w-6 text-blue-500" />,
    change: '+12%',
    trend: 'up'
  }, {
    name: 'Appointments',
    value: '1,342',
    icon: <Calendar className="h-6 w-6 text-green-500" />,
    change: '+8%',
    trend: 'up'
  }, {
    name: 'Revenue',
    value: '$28,650',
    icon: <DollarSign className="h-6 w-6 text-yellow-500" />,
    change: '+24%',
    trend: 'up'
  }, {
    name: 'Doctors',
    value: '42',
    icon: <UserPlus className="h-6 w-6 text-purple-500" />,
    change: '-3%',
    trend: 'down'
  }];
  // Mock recent activities
  const recentActivities = [{
    id: 1,
    action: 'New appointment',
    user: 'John Smith',
    time: '10 minutes ago',
    type: 'appointment'
  }, {
    id: 2,
    action: 'Payment received',
    user: 'Sarah Johnson',
    amount: '$150',
    time: '1 hour ago',
    type: 'payment'
  }, {
    id: 3,
    action: 'New user registered',
    user: 'Michael Brown',
    time: '2 hours ago',
    type: 'user'
  }, {
    id: 4,
    action: 'Doctor added',
    user: 'Dr. Emily Rodriguez',
    time: '5 hours ago',
    type: 'doctor'
  }, {
    id: 5,
    action: 'Appointment cancelled',
    user: 'Robert Wilson',
    time: '1 day ago',
    type: 'appointment'
  }];
  return <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500 mr-1" /> : <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
              <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} from last month
              </span>
            </div>
          </div>)}
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Appointments Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            {/* Placeholder for chart */}
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-gray-500">Appointment statistics chart</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Revenue Analysis</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            {/* Placeholder for chart */}
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-gray-500">Revenue analytics chart</p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivities.map(activity => <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${activity.type === 'appointment' ? 'bg-blue-500' : activity.type === 'payment' ? 'bg-green-500' : activity.type === 'user' ? 'bg-yellow-500' : 'bg-purple-500'}`}></span>
                      <span className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {activity.amount ? `Amount: ${activity.amount}` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.time}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>;
};
export default AdminDashboard;