import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { setUserRole } from '../features/auth/authSlice';

import { 

  Chart as ChartJS,

  CategoryScale,

  LinearScale,

  PointElement,

  LineElement,

  BarElement,

  Title,

  Tooltip,

  Legend,

  ArcElement

} from 'chart.js';

import { Line, Bar, Doughnut } from 'react-chartjs-2';

import { 

  Users, 

  FileText, 

  MessageCircle, 

  TrendingUp, 

  TrendingDown

} from 'lucide-react';

import api from '../utils/api';



// Register Chart.js components

ChartJS.register(

  CategoryScale,

  LinearScale,

  PointElement,

  LineElement,

  BarElement,

  Title,

  Tooltip,

  Legend,

  ArcElement

);



const AdminDashboard = () => {

  const { userRole } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');

  const [users, setUsers] = useState([]);



  useEffect(() => {

    // Fetch user role if not available

    const fetchUserRole = async () => {

      if (!userRole) {

        try {

          const response = await api.get('/api/profile');

          if (response.data && response.data.user) {

            dispatch(setUserRole(response.data.user.role));

          }

        } catch (error) {

          console.error('Error fetching user role:', error);

        }

      }

    };

    

    fetchUserRole();

    fetchDashboardStats();

  }, [userRole, dispatch]);



  const fetchDashboardStats = async () => {

    try {

      const response = await api.get('/api/admin/dashboard/stats');

      setStats(response.data);

      setError(null);

    } catch (error) {

      console.error('Error fetching dashboard stats:', error);

      setError('Failed to load dashboard statistics');

    } finally {

      setLoading(false);

    }

  };



  const fetchUsers = async () => {

    try {

      const response = await api.get('/api/admin/users');

      setUsers(response.data.users);

    } catch (error) {

      console.error('Error fetching users:', error);

    }

  };



  const handleTabChange = (tab) => {

    setActiveTab(tab);

    if (tab === 'users') {

      fetchUsers();

    }

  };



  if (loading) {

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>

      </div>

    );

  }



  if (error) {

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>

          <p className="text-gray-600 mb-4">{error}</p>

          <button 

            onClick={() => {

              setLoading(true);

              setError(null);

              fetchDashboardStats();

            }}

            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"

          >

            Retry

          </button>

        </div>

      </div>

    );

  }



  if (!stats) {

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>

          <p className="text-gray-600">Dashboard statistics could not be loaded.</p>

        </div>

      </div>

    );

  }



  const chartOptions = {

    responsive: true,

    plugins: {

      legend: {

        position: 'top',

      },

    },

    scales: {

      y: {

        beginAtZero: true,

      },

    },

  };



  const userChartData = {

    labels: stats.charts.userStatsByMonth.map(item => item.month),

    datasets: [

      {

        label: 'New Users',

        data: stats.charts.userStatsByMonth.map(item => item.count),

        borderColor: 'rgb(251, 146, 60)',

        backgroundColor: 'rgba(251, 146, 60, 0.1)',

        tension: 0.1,

      },

    ],

  };



  const postChartData = {

    labels: stats.charts.postStatsByMonth.map(item => item.month),

    datasets: [

      {

        label: 'New Posts',

        data: stats.charts.postStatsByMonth.map(item => item.count),

        backgroundColor: 'rgba(34, 197, 94, 0.8)',

        borderColor: 'rgb(34, 197, 94)',

        borderWidth: 1,

      },

    ],

  };



  const contentDistributionData = {

    labels: ['Posts', 'Comments'],

    datasets: [

      {

        data: [stats.stats.totalPosts, stats.stats.totalComments],

        backgroundColor: [

          'rgba(251, 146, 60, 0.8)',

          'rgba(34, 197, 94, 0.8)',

        ],

        borderColor: [

          'rgb(251, 146, 60)',

          'rgb(34, 197, 94)',

        ],

        borderWidth: 1,

      },

    ],

  };



  return (

    <div className="min-h-screen bg-gray-50">

      {/* Header */}

      <div className="bg-white shadow-sm border-b">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center py-6">

            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

            <div className="flex space-x-4">

              <button

                onClick={() => setActiveTab('dashboard')}

                className={`px-4 py-2 rounded-lg font-medium ${

                  activeTab === 'dashboard'

                    ? 'bg-orange-600 text-white'

                    : 'text-gray-600 hover:text-gray-900'

                }`}

              >

                Dashboard

              </button>

              <button

                onClick={() => handleTabChange('users')}

                className={`px-4 py-2 rounded-lg font-medium ${

                  activeTab === 'users'

                    ? 'bg-orange-600 text-white'

                    : 'text-gray-600 hover:text-gray-900'

                }`}

              >

                Users

              </button>

            </div>

          </div>

        </div>

      </div>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {activeTab === 'dashboard' && (

          <div className="space-y-8">

            {/* Stats Cards */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="bg-white rounded-lg shadow p-6">

                <div className="flex items-center">

                  <div className="p-2 bg-orange-100 rounded-lg">

                    <Users className="h-6 w-6 text-orange-600" />

                  </div>

                  <div className="ml-4">

                    <p className="text-sm font-medium text-gray-600">Total Users</p>

                    <p className="text-2xl font-bold text-gray-900">{stats.stats.totalUsers}</p>

                    <div className="flex items-center mt-1">

                      {stats.stats.userGrowthPercentage >= 0 ? (

                        <TrendingUp className="h-4 w-4 text-green-500" />

                      ) : (

                        <TrendingDown className="h-4 w-4 text-red-500" />

                      )}

                      <span className={`text-sm ml-1 ${

                        stats.stats.userGrowthPercentage >= 0 ? 'text-green-500' : 'text-red-500'

                      }`}>

                        {Math.abs(stats.stats.userGrowthPercentage)}%

                      </span>

                    </div>

                  </div>

                </div>

              </div>



              <div className="bg-white rounded-lg shadow p-6">

                <div className="flex items-center">

                  <div className="p-2 bg-green-100 rounded-lg">

                    <FileText className="h-6 w-6 text-green-600" />

                  </div>

                  <div className="ml-4">

                    <p className="text-sm font-medium text-gray-600">Total Posts</p>

                    <p className="text-2xl font-bold text-gray-900">{stats.stats.totalPosts}</p>

                    <div className="flex items-center mt-1">

                      {stats.stats.postGrowthPercentage >= 0 ? (

                        <TrendingUp className="h-4 w-4 text-green-500" />

                      ) : (

                        <TrendingDown className="h-4 w-4 text-red-500" />

                      )}

                      <span className={`text-sm ml-1 ${

                        stats.stats.postGrowthPercentage >= 0 ? 'text-green-500' : 'text-red-500'

                      }`}>

                        {Math.abs(stats.stats.postGrowthPercentage)}%

                      </span>

                    </div>

                  </div>

                </div>

              </div>



              <div className="bg-white rounded-lg shadow p-6">

                <div className="flex items-center">

                  <div className="p-2 bg-purple-100 rounded-lg">

                    <MessageCircle className="h-6 w-6 text-purple-600" />

                  </div>

                  <div className="ml-4">

                    <p className="text-sm font-medium text-gray-600">Total Comments</p>

                    <p className="text-2xl font-bold text-gray-900">{stats.stats.totalComments}</p>

                  </div>

                </div>

              </div>

            </div>



            {/* Charts */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <div className="bg-white rounded-lg shadow p-6">

                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>

                <Line data={userChartData} options={chartOptions} />

              </div>



              <div className="bg-white rounded-lg shadow p-6">

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Growth</h3>

                <Bar data={postChartData} options={chartOptions} />

              </div>

            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <div className="bg-white rounded-lg shadow p-6">

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Distribution</h3>

                <Doughnut data={contentDistributionData} options={chartOptions} />

              </div>



              <div className="bg-white rounded-lg shadow p-6">

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>

                <div className="space-y-3">

                  {stats.recentUsers.map((user) => (

                    <div key={user._id} className="flex items-center space-x-3">

                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">

                        <Users className="h-4 w-4 text-gray-600" />

                      </div>

                      <div>

                        <p className="text-sm font-medium text-gray-900">

                          {user.profile?.username || user.email}

                        </p>

                        <p className="text-xs text-gray-500">

                          {new Date(user.createdAt).toLocaleDateString()}

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        )}



        {activeTab === 'users' && (

          <div className="space-y-6">

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>

            </div>



            <div className="bg-white rounded-lg shadow overflow-hidden">

              <div className="px-6 py-4 border-b border-gray-200">

                <h3 className="text-lg font-semibold text-gray-900">All Users</h3>

              </div>

              <div className="overflow-x-auto">

                <table className="min-w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Email

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Username

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Role

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Status

                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        Joined

                      </th>

                    </tr>

                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">

                    {users.map((user) => (

                      <tr key={user._id}>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">

                          {user.email}

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                          {user.profile?.username || 'N/A'}

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${

                            user.role === 'superadmin' 

                              ? 'bg-purple-100 text-purple-800'

                              : user.role === 'admin'

                              ? 'bg-orange-100 text-orange-800'

                              : 'bg-gray-100 text-gray-800'

                          }`}>

                            {user.role}

                          </span>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${

                            user.isActive 

                              ? 'bg-green-100 text-green-800' 

                              : 'bg-red-100 text-red-800'

                          }`}>

                            {user.isActive ? 'Active' : 'Inactive'}

                          </span>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                          {new Date(user.createdAt).toLocaleDateString()}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};



export default AdminDashboard;