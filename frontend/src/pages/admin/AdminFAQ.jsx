import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Search, X, Save } from 'lucide-react'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Admissions',
  })

  const categories = ['All', 'Admissions', 'Courses', 'Fees', 'Placements', 'Campus Life', 'Faculty', 'Events', 'Facilities']

  useEffect(() => {
    loadFAQs()
  }, [selectedCategory])

  const loadFAQs = async () => {
    try {
      const data = await adminService.getAllFAQs(0, 100, selectedCategory === 'All' ? null : selectedCategory)
      setFaqs(data.content || [])
    } catch (error) {
      toast.error('Failed to load FAQs')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingFaq) {
        await adminService.updateFAQ(editingFaq.id, formData)
        toast.success('FAQ updated successfully')
      } else {
        await adminService.createFAQ(formData)
        toast.success('FAQ created successfully')
      }
      setShowModal(false)
      setEditingFaq(null)
      setFormData({ question: '', answer: '', category: 'Admissions' })
      loadFAQs()
    } catch (error) {
      toast.error('Failed to save FAQ')
    }
  }

  const handleEdit = (faq) => {
    setEditingFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    })
    setShowModal(true)
  }

  const handleDelete = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return

    try {
      await adminService.deleteFAQ(faqId)
      toast.success('FAQ deleted successfully')
      loadFAQs()
    } catch (error) {
      toast.error('Failed to delete FAQ')
    }
  }

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">FAQ Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage frequently asked questions</p>
        </div>
        <button
          onClick={() => {
            setEditingFaq(null)
            setFormData({ question: '', answer: '', category: 'Admissions' })
            setShowModal(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add FAQ
        </button>
      </div>

      <div className="card">
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
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

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                      required
                    >
                      {categories.filter(c => c !== 'All').map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      placeholder="Enter the question..."
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Answer</label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      placeholder="Enter the answer..."
                      rows={6}
                      className="input-field resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="submit" className="btn-primary flex items-center gap-2">
                      <Save size={20} />
                      {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminFAQ
