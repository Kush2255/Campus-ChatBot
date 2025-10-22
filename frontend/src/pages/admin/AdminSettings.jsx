import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, TestTube, Key, Mail, Database, Shield } from 'lucide-react'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('groq')
  const [loading, setLoading] = useState(false)
  
  const [groqConfig, setGroqConfig] = useState({
    apiKey: '',
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    maxTokens: 1024,
  })

  const [emailConfig, setEmailConfig] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    username: '',
    password: '',
  })

  const tabs = [
    { id: 'groq', label: 'Groq API', icon: Key },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const handleSaveGroqConfig = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await adminService.updateGroqConfig(groqConfig)
      toast.success('Groq API configuration saved')
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleTestGroqConnection = async () => {
    setLoading(true)

    try {
      await adminService.testGroqConnection()
      toast.success('Groq API connection successful!')
    } catch (error) {
      toast.error('Failed to connect to Groq API')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEmailConfig = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await adminService.updateSystemSettings({ email: emailConfig })
      toast.success('Email configuration saved')
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">System Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure system-wide settings</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-800 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Groq API Tab */}
        {activeTab === 'groq' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Groq API Configuration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure your Groq API settings for AI-powered responses
              </p>
            </div>

            <form onSubmit={handleSaveGroqConfig} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={groqConfig.apiKey}
                  onChange={(e) => setGroqConfig({ ...groqConfig, apiKey: e.target.value })}
                  placeholder="gsk_..."
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from{' '}
                  <a
                    href="https://console.groq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Groq Console
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={groqConfig.model}
                  onChange={(e) => setGroqConfig({ ...groqConfig, model: e.target.value })}
                  className="input-field"
                >
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B (Recommended)</option>
                  <option value="llama2-70b-4096">Llama 2 70B</option>
                  <option value="gemma-7b-it">Gemma 7B</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={groqConfig.temperature}
                    onChange={(e) => setGroqConfig({ ...groqConfig, temperature: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">Controls randomness (0-2)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Tokens</label>
                  <input
                    type="number"
                    value={groqConfig.maxTokens}
                    onChange={(e) => setGroqConfig({ ...groqConfig, maxTokens: parseInt(e.target.value) })}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum response length</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={20} />
                  Save Configuration
                </button>
                <button
                  type="button"
                  onClick={handleTestGroqConnection}
                  disabled={loading}
                  className="btn-secondary flex items-center gap-2"
                >
                  <TestTube size={20} />
                  Test Connection
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Email Settings Tab */}
        {activeTab === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Email Configuration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure SMTP settings for sending emails
              </p>
            </div>

            <form onSubmit={handleSaveEmailConfig} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={emailConfig.host}
                    onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Port</label>
                  <input
                    type="number"
                    value={emailConfig.port}
                    onChange={(e) => setEmailConfig({ ...emailConfig, port: parseInt(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Username</label>
                <input
                  type="email"
                  value={emailConfig.username}
                  onChange={(e) => setEmailConfig({ ...emailConfig, username: e.target.value })}
                  placeholder="your-email@gmail.com"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Password / App Password</label>
                <input
                  type="password"
                  value={emailConfig.password}
                  onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                  placeholder="••••••••••••••••"
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  For Gmail, use an{' '}
                  <a
                    href="https://support.google.com/accounts/answer/185833"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    App Password
                  </a>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Save size={20} />
                Save Configuration
              </button>
            </form>
          </motion.div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Database Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage database backups and maintenance
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="font-semibold mb-2">Database Status</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Connection</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Database Size</p>
                    <p className="font-medium">45.2 MB</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Last Backup</p>
                    <p className="font-medium">2 hours ago</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="btn-primary">Create Backup</button>
                <button className="btn-secondary">Restore Backup</button>
                <button className="btn-secondary">Optimize Database</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Security Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure security and authentication settings
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Require Email Verification', description: 'Users must verify email before accessing' },
                { title: 'Enable Two-Factor Authentication', description: 'Add extra security layer for admins' },
                { title: 'Session Timeout', description: 'Auto logout after 30 minutes of inactivity' },
                { title: 'IP Whitelist', description: 'Restrict admin access to specific IPs' },
              ].map((setting) => (
                <div key={setting.title} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-medium mb-1">{setting.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminSettings
