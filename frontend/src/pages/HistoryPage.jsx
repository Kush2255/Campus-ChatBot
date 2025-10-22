import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Calendar,
  MessageSquare,
  Trash2,
  Download,
  Filter,
  X,
} from 'lucide-react'
import { chatService } from '../services/chatService'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const HistoryPage = () => {
  const [sessions, setSessions] = useState([])
  const [filteredSessions, setFilteredSessions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  const categories = [
    'All',
    'Admissions',
    'Courses',
    'Fees',
    'Placements',
    'Campus Life',
    'Faculty',
    'Events',
    'Facilities',
  ]

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    filterSessions()
  }, [searchQuery, selectedCategory, sessions])

  const loadHistory = async () => {
    try {
      const data = await chatService.getUserSessions()
      setSessions(data)
      setFilteredSessions(data)
    } catch (error) {
      toast.error('Failed to load chat history')
    } finally {
      setLoading(false)
    }
  }

  const filterSessions = () => {
    let filtered = [...sessions]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (session) =>
          session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(
        (session) => session.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setFilteredSessions(filtered)
  }

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return
    }

    try {
      await chatService.deleteChatSession(sessionId)
      setSessions(sessions.filter((s) => s.id !== sessionId))
      toast.success('Conversation deleted')
    } catch (error) {
      toast.error('Failed to delete conversation')
    }
  }

  const handleExport = async () => {
    try {
      await chatService.exportChatHistory('pdf')
      toast.success('Chat history exported as PDF')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export chat history')
    }
  }

  const handleExportSession = async (sessionId, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await chatService.exportSession(sessionId, 'pdf')
      toast.success('Conversation exported as PDF')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export conversation')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chat History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and manage your past conversations
          </p>
        </div>
        <button
          onClick={handleExport}
          className="btn-primary flex items-center gap-2"
        >
          <Download size={20} />
          Export as PDF
        </button>
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="input-field pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Filter size={20} className="text-gray-400 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  (category === 'All' && !selectedCategory) ||
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">No conversations found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || selectedCategory
                ? 'Try adjusting your search or filters'
                : 'Start chatting to see your history here!'}
            </p>
            {!searchQuery && !selectedCategory && (
              <Link to="/chat" className="btn-primary">
                Start New Chat
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-soft-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={24} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <Link
                      to={`/chat?session=${session.id}`}
                      className="flex-1 min-w-0"
                    >
                      <h3 className="font-bold text-lg mb-1 truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {session.title || 'Untitled Conversation'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {session.lastMessage || 'No messages yet'}
                      </p>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleExportSession(session.id, e)}
                        className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex-shrink-0"
                        title="Export conversation"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                        title="Delete conversation"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{format(new Date(session.updatedAt), 'MMM d, yyyy')}</span>
                    </div>
                    {session.category && (
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">
                        {session.category}
                      </span>
                    )}
                    <span>{session.messageCount || 0} messages</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination (if needed) */}
      {filteredSessions.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          <button className="btn-secondary px-4 py-2">Previous</button>
          <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
            Page 1 of 1
          </span>
          <button className="btn-secondary px-4 py-2">Next</button>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
