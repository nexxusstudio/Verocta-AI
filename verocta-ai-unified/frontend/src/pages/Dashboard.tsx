import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  CloudArrowUpIcon,
  CurrencyDollarIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { name: 'Total Reports', value: '12', icon: DocumentTextIcon, change: '+2.1%' },
    { name: 'SpendScore Average', value: '78.5', icon: ChartBarIcon, change: '+4.3%' },
    { name: 'Cost Savings', value: '$24,580', icon: CurrencyDollarIcon, change: '+12.5%' },
    { name: 'Active Users', value: '8', icon: UsersIcon, change: '+1' },
  ]

  const recentReports = [
    { id: 1, name: 'Q1 Financial Analysis', date: '2025-03-15', score: 82, status: 'completed' },
    { id: 2, name: 'March Expense Review', date: '2025-03-10', score: 75, status: 'completed' },
    { id: 3, name: 'Vendor Analysis Report', date: '2025-03-08', score: 89, status: 'completed' },
    { id: 4, name: 'February Insights', date: '2025-02-28', score: 76, status: 'completed' },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Reports</h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SpendScore
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.score >= 80 ? 'bg-green-100 text-green-800' :
                        report.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPlaceholderContent = (title: string, description: string) => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
        Coming Soon
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img className="h-8 w-auto" src="/assets/images/verocta-logo.png" alt="Verocta" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'reports', name: 'Reports', icon: DocumentTextIcon },
              { id: 'upload', name: 'Upload Data', icon: CloudArrowUpIcon },
              { id: 'insights', name: 'Insights Engine', icon: ChartBarIcon },
              { id: 'payments', name: 'Payments', icon: CurrencyDollarIcon },
              { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'reports' && renderPlaceholderContent(
          'Reports Management',
          'View, manage, and generate financial analysis reports with AI-powered insights.'
        )}
        {activeTab === 'upload' && renderPlaceholderContent(
          'CSV & Google Sheets Integration',
          'Upload CSV files or connect Google Sheets for automated data ingestion and mapping.'
        )}
        {activeTab === 'insights' && renderPlaceholderContent(
          'SpendScore™ Insights Engine',
          'Advanced analytics including waste detection, duplicates, spikes, forecasting, and benchmarking.'
        )}
        {activeTab === 'payments' && renderPlaceholderContent(
          'Stripe Multi-Currency Payments',
          'Manage subscriptions and payments across USD, GBP, CAD, AUD, and NZD currencies.'
        )}
        {activeTab === 'settings' && renderPlaceholderContent(
          'Account Settings',
          'Configure your account preferences, API settings, and notification preferences.'
        )}
      </div>
    </div>
  )
}

export default Dashboard