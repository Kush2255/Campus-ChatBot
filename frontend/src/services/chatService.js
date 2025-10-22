import api from './api'

export const chatService = {
  // Send message to AI chatbot
  sendMessage: async (message, sessionId = null, category = null) => {
    const response = await api.post('/chat/message', {
      message,
      sessionId,
      category,
    })
    return response.data
  },

  // Get chat history
  getChatHistory: async (page = 0, size = 20) => {
    const response = await api.get('/chat/history', {
      params: { page, size },
    })
    return response.data
  },

  // Get specific chat session
  getChatSession: async (sessionId) => {
    const response = await api.get(`/chat/session/${sessionId}`)
    return response.data
  },

  // Delete chat session
  deleteChatSession: async (sessionId) => {
    const response = await api.delete(`/chat/session/${sessionId}`)
    return response.data
  },

  // Get all user sessions
  getUserSessions: async () => {
    const response = await api.get('/chat/sessions')
    return response.data
  },

  // Submit feedback for AI response
  submitFeedback: async (messageId, feedback) => {
    const response = await api.post('/chat/feedback', {
      messageId,
      feedback, // 'positive' or 'negative'
    })
    return response.data
  },

  // Get chat categories
  getCategories: async () => {
    const response = await api.get('/chat/categories')
    return response.data
  },

  // Search chat history
  searchChatHistory: async (query, filters = {}) => {
    const response = await api.post('/chat/search', {
      query,
      ...filters,
    })
    return response.data
  },

  // Export chat history
  exportChatHistory: async (format = 'pdf') => {
    const response = await api.get('/chat/export', {
      params: { format },
      responseType: 'blob',
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `chat-history.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    return response.data
  },

  // Export single session
  exportSession: async (sessionId, format = 'pdf') => {
    const response = await api.get(`/chat/session/${sessionId}/export`, {
      params: { format },
      responseType: 'blob',
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `conversation-${sessionId}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    return response.data
  },

  // Get suggested questions
  getSuggestedQuestions: async (category = null) => {
    const response = await api.get('/chat/suggestions', {
      params: { category },
    })
    return response.data
  },
}
