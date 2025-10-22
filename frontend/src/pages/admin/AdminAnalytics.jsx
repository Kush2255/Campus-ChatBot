import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Calendar, TrendingUp, Users, MessageSquare } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, subDays } from 'date-fns'
import toast from 'react-hot-toast'

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('7days')
  const [loading, setLoading] = useState(false)

  const queryTrendData = [
    { date: 'Jan 1', queries: 45, users: 23 },
    { date: 'Jan 2', queries: 52, users: 28 },
    { date: 'Jan 3', queries: 68, users: 35 },
    { date: 'Jan 4', queries: 58, users: 31 },
    { date: 'Jan 5', queries: 75, users: 42 },
    { date: 'Jan 6', queries: 62, users: 36 },
    { date: 'Jan 7', queries: 88, users: 48 },
  ]

  const categoryPerformance = [
    { category: 'Admissions', queries: 245, satisfaction: 92 },
    { category: 'Courses', queries: 189, satisfaction: 88 },
    { category: 'Fees', queries: 167, satisfaction: 85 },
    { category: 'Placements', queries: 143, satisfaction: 90 },
    { category: 'Campus Life', queries: 128, satisfaction: 87 },
  ]

  const responseTimeData = [
    { hour: '00:00', avgTime: 1.2 },
    { hour: '04:00', avgTime: 0.9 },
    { hour: '08:00', avgTime: 1.5 },
    { hour: '12:00', avgTime: 1.8 },
    { hour: '16:00', avgTime: 1.6 },
    { hour: '20:00', avgTime: 1.3 },
  ]

  const userEngagement = [
    { name: 'New Users', value: 145, color: '#3b82f6' },
    { name: 'Returning Users', value: 298, color: '#10b981' },
    { name: 'Inactive Users', value: 67, color: '#f59e0b' },
  ]

  const handleExport = async () => {
    try {
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd')
      const endDate = format(new Date(), 'yyyy-MM-dd')
      const blob = await adminService.exportAnalyticsReport(startDate, endDate, 'csv')
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Analytics report exported')
    } catch (error) {
      toast.error('Failed to export report')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Detailed insights and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { title: 'Total Queries', value: '1,247', change: '+12.5%', icon: MessageSquare, color: 'blue' },
          { title: 'Active Users', value: '298', change: '+8.2%', icon: Users, color: 'green' },
          { title: 'Avg Response Time', value: '1.2s', change: '-0.3s', icon: TrendingUp, color: 'purple' },
          { title: 'Satisfaction Rate', value: '89%', change: '+2.1%', icon: TrendingUp, color: 'orange' },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${metric.color}-100 dark:bg-${metric.color}-900/30 rounded-xl flex items-center justify-center`}>
                <metric.icon size={24} className={`text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
              <span className={`text-sm font-medium ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Query Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-6">Query & User Trends</h2>
        <ResponsiveContainer width="100%" height={350}>
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
            <Line type="monotone" dataKey="queries" stroke="#3b82f6" strokeWidth={3} name="Queries" />
            <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} name="Active Users" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6">Category Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="category" stroke="#6b7280" />
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
              <Bar dataKey="queries" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Queries" />
              <Bar dataKey="satisfaction" fill="#10b981" radius={[8, 8, 0, 0]} name="Satisfaction %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6">User Engagement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userEngagement}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userEngagement.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Response Time Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-6">Response Time Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="hour" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Line
              type="monotone"
              dataKey="avgTime"
              stroke="#f59e0b"
              strokeWidth={3}
              name="Avg Response Time (s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

export default AdminAnalytics
