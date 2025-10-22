import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { adminService } from '../../services/adminService'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQueries: 0,
    activeUsers: 0,
    avgResponseTime: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const data = await adminService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for charts
  const queryTrendData = [
    { date: 'Mon', queries: 45, responses: 43 },
    { date: 'Tue', queries: 52, responses: 50 },
    { date: 'Wed', queries: 68, responses: 65 },
    { date: 'Thu', queries: 58, responses: 56 },
    { date: 'Fri', queries: 75, responses: 72 },
    { date: 'Sat', queries: 62, responses: 60 },
    { date: 'Sun', queries: 48, responses: 46 },
  ]

  const categoryData = [
    { name: 'Admissions', value: 245, color: '#3b82f6' },
    { name: 'Courses', value: 189, color: '#10b981' },
    { name: 'Fees', value: 167, color: '#f59e0b' },
    { name: 'Placements', value: 143, color: '#8b5cf6' },
    { name: 'Campus Life', value: 128, color: '#ec4899' },
  ]

  const userGrowthData = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 145 },
    { month: 'Mar', users: 178 },
    { month: 'Apr', users: 210 },
    { month: 'May', users: 256 },
    { month: 'Jun', users: 298 },
  ]

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 298,
      change: '+12.5%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Queries',
      value: stats.totalQueries || 1247,
      change: '+8.2%',
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers || 156,
      change: '+5.4%',
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Avg Response Time',
      value: `${stats.avgResponseTime || 1.2}s`,
      change: '-0.3s',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
  ]

  const recentActivity = [
    { user: 'John Doe', action: 'Asked about admissions', time: '2 min ago', status: 'success' },
    { user: 'Jane Smith', action: 'Inquired about fees', time: '5 min ago', status: 'success' },
    { user: 'Mike Johnson', action: 'Query about placements', time: '8 min ago', status: 'success' },
    { user: 'Sarah Williams', action: 'Campus facilities question', time: '12 min ago', status: 'pending' },
    { user: 'Tom Brown', action: 'Course information request', time: '15 min ago', status: 'success' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage CampusConnect platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} className={stat.textColor} />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Query Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6">Query Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={queryTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="queries"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="responses"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6">Query Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* User Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-6">User Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                {activity.status === 'success' ? (
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
