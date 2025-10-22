import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Calendar,
  BookOpen,
  X,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { chatService } from '../services/chatService'
import { format } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DashboardPage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalQueries: 0,
    todayQueries: 0,
    avgResponseTime: 0,
  })
  const [recentSessions, setRecentSessions] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTopicsModal, setShowTopicsModal] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const sessionsResponse = await chatService.getUserSessions()
      
      // Handle different response structures (array, object with data/content property, or null)
      let sessionsData = []
      if (Array.isArray(sessionsResponse)) {
        sessionsData = sessionsResponse
      } else if (sessionsResponse?.data && Array.isArray(sessionsResponse.data)) {
        sessionsData = sessionsResponse.data
      } else if (sessionsResponse?.content && Array.isArray(sessionsResponse.content)) {
        sessionsData = sessionsResponse.content
      }

      setRecentSessions(sessionsData.slice(0, 5))
      
      // Mock stats - replace with actual API call
      setStats({
        totalQueries: sessionsData.length * 5,
        todayQueries: 12,
        avgResponseTime: 1.2,
      })

      // Mock chart data - replace with actual API call
      setChartData([
        { date: 'Mon', queries: 5 },
        { date: 'Tue', queries: 8 },
        { date: 'Wed', queries: 12 },
        { date: 'Thu', queries: 7 },
        { date: 'Fri', queries: 15 },
        { date: 'Sat', queries: 10 },
        { date: 'Sun', queries: 6 },
      ])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      // Set default values even on error
      setRecentSessions([])
      setStats({
        totalQueries: 0,
        todayQueries: 12,
        avgResponseTime: 1.2,
      })
      setChartData([
        { date: 'Mon', queries: 5 },
        { date: 'Tue', queries: 8 },
        { date: 'Wed', queries: 12 },
        { date: 'Thu', queries: 7 },
        { date: 'Fri', queries: 15 },
        { date: 'Sat', queries: 10 },
        { date: 'Sun', queries: 6 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const popularQuestions = [
    { category: 'Admissions', question: 'What are the eligibility criteria for B.Tech admission at IARE?' },
    { category: 'Admissions', question: 'What is the admission process and important dates?' },
    { category: 'Courses', question: 'What B.Tech specializations are offered at IARE?' },
    { category: 'Courses', question: 'Tell me about CSE (AI & ML) program' },
    { category: 'Fees', question: 'What is the fee structure for B.Tech programs?' },
    { category: 'Fees', question: 'Are there any scholarships available?' },
    { category: 'Placements', question: 'What is the highest and average package at IARE?' },
    { category: 'Placements', question: 'Which companies visit IARE for placements?' },
    { category: 'Campus Life', question: 'What facilities are available on campus?' },
    { category: 'Campus Life', question: 'Tell me about hostel facilities' },
  ]

  const quickActions = [
    {
      title: 'Start New Chat',
      description: 'Ask anything about the college',
      icon: MessageSquare,
      link: '/chat',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'View History',
      description: 'Browse your past conversations',
      icon: Clock,
      link: '/history',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Explore Topics',
      description: 'Discover popular questions',
      icon: BookOpen,
      onClick: () => setShowTopicsModal(true),
      color: 'from-green-500 to-green-600',
    },
  ]

  const popularTopics = [
    { title: 'Admission Process', queries: 245 },
    { title: 'Course Details', queries: 189 },
    { title: 'Fee Structure', queries: 167 },
    { title: 'Placement Records', queries: 143 },
    { title: 'Campus Facilities', queries: 128 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-white/90 mb-6">
            Ready to explore? Ask me anything about your college journey.
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <Sparkles size={20} />
            Start Chatting
            <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <MessageSquare size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              +12 today
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.totalQueries}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Queries</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              +8.2%
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.todayQueries}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Queries Today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              Fast
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stats.avgResponseTime}s</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            {action.link ? (
              <Link
                to={action.link}
                className="card hover:shadow-soft-lg transition-all duration-200 group h-full flex flex-col"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{action.description}</p>
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="card hover:shadow-soft-lg transition-all duration-200 group h-full flex flex-col text-left w-full"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{action.description}</p>
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
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
              <Line
                type="monotone"
                dataKey="queries"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Popular Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-6">Popular Topics</h2>
          <div className="space-y-4">
            {popularTopics.map((topic, index) => (
              <div key={topic.title} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium">{topic.title}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {topic.queries} queries
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Conversations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Conversations</h2>
          <Link
            to="/history"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {!Array.isArray(recentSessions) || recentSessions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No conversations yet. Start chatting to see your history here!
            </p>
            <Link to="/chat" className="btn-primary">
              Start First Chat
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <Link
                key={session.id}
                to={`/chat?session=${session.id}`}
                className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 truncate">
                      {session.title || 'Untitled Conversation'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {session.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>{format(new Date(session.updatedAt), 'MMM d')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Popular Questions Modal */}
      {showTopicsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold">Popular Questions</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Click any question to start a conversation
                </p>
              </div>
              <button
                onClick={() => setShowTopicsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              <div className="space-y-4">
                {popularQuestions.map((item, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      navigate(`/chat?question=${encodeURIComponent(item.question)}`)
                      setShowTopicsModal(false)
                    }}
                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MessageSquare size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded text-xs font-medium mb-2">
                          {item.category}
                        </span>
                        <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {item.question}
                        </p>
                      </div>
                      <ArrowRight size={20} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
