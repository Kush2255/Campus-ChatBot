import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import {
  Send,
  Mic,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Loader2,
  RotateCcw,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChatStore } from '../store/chatStore'
import { chatService } from '../services/chatService'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)
  const { messages, isTyping, selectedCategory, addMessage, setTyping, setCategory } = useChatStore()

  const categories = [
    { id: 'admissions', label: 'Admissions', color: 'bg-blue-500' },
    { id: 'courses', label: 'Courses', color: 'bg-green-500' },
    { id: 'fees', label: 'Fees & Scholarships', color: 'bg-yellow-500' },
    { id: 'placements', label: 'Placements', color: 'bg-purple-500' },
    { id: 'campus', label: 'Campus Life', color: 'bg-pink-500' },
    { id: 'faculty', label: 'Faculty', color: 'bg-indigo-500' },
    { id: 'events', label: 'Events', color: 'bg-red-500' },
    { id: 'facilities', label: 'Facilities', color: 'bg-teal-500' },
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    loadSuggestions()
  }, [selectedCategory])

  useEffect(() => {
    const question = searchParams.get('question')
    if (question) {
      setInput(question)
      // Auto-send the question
      setTimeout(() => {
        handleSendMessage(question)
        setSearchParams({}) // Clear the URL parameter
      }, 500)
    }
  }, [searchParams])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadSuggestions = async () => {
    try {
      const data = await chatService.getSuggestedQuestions(selectedCategory)
      setSuggestions(data)
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }

  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim()) return

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    }

    addMessage(userMessage)
    setInput('')
    setTyping(true)

    try {
      const response = await chatService.sendMessage(messageText, null, selectedCategory)
      
      const aiMessage = {
        id: response.id,
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
        category: response.category,
      }

      addMessage(aiMessage)
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      })
    } finally {
      setTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFeedback = async (messageId, feedback) => {
    try {
      await chatService.submitFeedback(messageId, feedback)
      toast.success('Thank you for your feedback!')
    } catch (error) {
      toast.error('Failed to submit feedback')
    }
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  const handleCategorySelect = (categoryId) => {
    setCategory(categoryId === selectedCategory ? null : categoryId)
  }

  const handleNewChat = () => {
    if (window.confirm('Start a new conversation? Current chat will be saved to history.')) {
      window.location.reload()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 rounded-t-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Assistant</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            className="btn-ghost flex items-center gap-2"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? `${category.color} text-white shadow-md`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to CampusConnect!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              I'm your AI assistant. Ask me anything about admissions, courses, fees, placements, campus life, and more!
            </p>

            {/* Suggested Questions */}
            {suggestions.length > 0 && (
              <div className="w-full max-w-2xl">
                <p className="text-sm font-medium mb-3">Try asking:</p>
                <div className="grid gap-2">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left p-4 bg-white dark:bg-gray-900 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-800"
                    >
                      <p className="text-sm">{suggestion}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gradient-to-br from-primary-500 to-accent-600 text-white'
                    }`}>
                      {message.role === 'user' ? 'U' : <Sparkles size={16} />}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1">
                      <div className={message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                        {message.role === 'assistant' ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            className="markdown-content"
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>

                      {/* Timestamp & Feedback */}
                      <div className={`flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
                        
                        {message.role === 'assistant' && message.id && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleFeedback(message.id, 'positive')}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                              title="Helpful"
                            >
                              <ThumbsUp size={14} />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, 'negative')}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                              title="Not helpful"
                            >
                              <ThumbsDown size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white">
                    <Sparkles size={16} />
                  </div>
                  <div className="chat-bubble-ai">
                    <div className="typing-indicator flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
                      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
                      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 rounded-b-2xl">
        <div className="flex items-end gap-2">
          {/* File Upload */}
          <button
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors flex-shrink-0"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about the college..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 max-h-32"
              style={{ minHeight: '48px' }}
            />
          </div>

          {/* Voice Input */}
          <button
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors flex-shrink-0"
            title="Voice input"
          >
            <Mic size={20} />
          </button>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0"
          >
            {isTyping ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          CampusConnect AI may make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  )
}

export default ChatPage
