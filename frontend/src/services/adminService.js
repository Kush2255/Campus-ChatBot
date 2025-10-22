import api from './api'

export const adminService = {
  // Dashboard Analytics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats')
    return response.data
  },

  getQueryAnalytics: async (startDate, endDate) => {
    const response = await api.get('/admin/analytics/queries', {
      params: { startDate, endDate },
    })
    return response.data
  },

  getUserAnalytics: async (startDate, endDate) => {
    const response = await api.get('/admin/analytics/users', {
      params: { startDate, endDate },
    })
    return response.data
  },

  // User Management
  getAllUsers: async (page = 0, size = 20, search = '') => {
    const response = await api.get('/admin/users', {
      params: { page, size, search },
    })
    return response.data
  },

  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`)
    return response.data
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData)
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  toggleUserStatus: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/toggle-status`)
    return response.data
  },

  // FAQ Management
  getAllFAQs: async (page = 0, size = 20, category = null) => {
    const response = await api.get('/admin/faq', {
      params: { page, size, category },
    })
    return response.data
  },

  createFAQ: async (faqData) => {
    const response = await api.post('/admin/faq', faqData)
    return response.data
  },

  updateFAQ: async (faqId, faqData) => {
    const response = await api.put(`/admin/faq/${faqId}`, faqData)
    return response.data
  },

  deleteFAQ: async (faqId) => {
    const response = await api.delete(`/admin/faq/${faqId}`)
    return response.data
  },

  bulkImportFAQs: async (formData) => {
    const response = await api.post('/admin/faq/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Support Tickets
  getAllTickets: async (page = 0, size = 20, status = null) => {
    const response = await api.get('/admin/tickets', {
      params: { page, size, status },
    })
    return response.data
  },

  updateTicketStatus: async (ticketId, status) => {
    const response = await api.patch(`/admin/tickets/${ticketId}/status`, { status })
    return response.data
  },

  assignTicket: async (ticketId, adminId) => {
    const response = await api.patch(`/admin/tickets/${ticketId}/assign`, { adminId })
    return response.data
  },

  // System Settings
  getSystemSettings: async () => {
    const response = await api.get('/admin/settings')
    return response.data
  },

  updateSystemSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings)
    return response.data
  },

  // Groq API Configuration
  updateGroqConfig: async (config) => {
    const response = await api.put('/admin/settings/groq', config)
    return response.data
  },

  testGroqConnection: async () => {
    const response = await api.post('/admin/settings/groq/test')
    return response.data
  },

  // Reports & Exports
  exportUsersReport: async (format = 'csv') => {
    const response = await api.get('/admin/reports/users', {
      params: { format },
      responseType: 'blob',
    })
    return response.data
  },

  exportQueriesReport: async (startDate, endDate, format = 'csv') => {
    const response = await api.get('/admin/reports/queries', {
      params: { startDate, endDate, format },
      responseType: 'blob',
    })
    return response.data
  },

  exportAnalyticsReport: async (startDate, endDate, format = 'csv') => {
    const response = await api.get('/admin/reports/analytics', {
      params: { startDate, endDate, format },
      responseType: 'blob',
    })
    return response.data
  },

  // System Logs
  getSystemLogs: async (page = 0, size = 50, level = null) => {
    const response = await api.get('/admin/logs', {
      params: { page, size, level },
    })
    return response.data
  },

  clearSystemLogs: async (olderThanDays = 30) => {
    const response = await api.delete('/admin/logs', {
      params: { olderThanDays },
    })
    return response.data
  },

  // Content Management
  getCourses: async () => {
    const response = await api.get('/admin/courses')
    return response.data
  },

  createCourse: async (courseData) => {
    const response = await api.post('/admin/courses', courseData)
    return response.data
  },

  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/admin/courses/${courseId}`, courseData)
    return response.data
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete(`/admin/courses/${courseId}`)
    return response.data
  },

  getDepartments: async () => {
    const response = await api.get('/admin/departments')
    return response.data
  },

  createDepartment: async (deptData) => {
    const response = await api.post('/admin/departments', deptData)
    return response.data
  },

  updateDepartment: async (deptId, deptData) => {
    const response = await api.put(`/admin/departments/${deptId}`, deptData)
    return response.data
  },

  deleteDepartment: async (deptId) => {
    const response = await api.delete(`/admin/departments/${deptId}`)
    return response.data
  },
}
