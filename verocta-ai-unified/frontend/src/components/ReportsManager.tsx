import React, { useState, useEffect } from 'react'
import { apiClient } from '../utils/api'
import { 
  DocumentTextIcon, 
  TrashIcon, 
  EyeIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface Report {
  id: number
  title: string
  created_at: string
  spend_score: number
  status: string
  insights: {
    waste_percentage: number
    duplicate_expenses: number
    spending_spikes: number
    savings_opportunities: number
    recommendations: string[]
  }
  data: {
    transactions?: number
    total_amount?: number
    categories?: number
  }
}

const ReportsManager: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await apiClient.get('/reports')
      setReports(response.data.reports)
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteReport = async (reportId: number) => {
    if (!confirm('Are you sure you want to delete this report?')) return
    
    try {
      await apiClient.delete(`/reports/${reportId}`)
      setReports(reports.filter(r => r.id !== reportId))
    } catch (error) {
      console.error('Failed to delete report:', error)
    }
  }

  const createSampleReport = async () => {
    try {
      const response = await apiClient.post('/reports', {
        title: `Sample Report ${new Date().toLocaleDateString()}`,
        data: {
          transactions: Math.floor(Math.random() * 1000) + 100,
          total_amount: Math.floor(Math.random() * 100000) + 10000,
          categories: Math.floor(Math.random() * 20) + 5
        }
      })
      setReports([response.data.report, ...reports])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create report:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Sample Report
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(report.spend_score)}`}>
                {report.spend_score}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transactions:</span>
                <span className="text-gray-900">{report.data.transactions?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount:</span>
                <span className="text-gray-900">{report.data.total_amount ? formatCurrency(report.data.total_amount) : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Waste:</span>
                <span className="text-red-600">{report.insights.waste_percentage}%</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setSelectedReport(report)}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View Details
              </button>
              <button
                onClick={() => deleteReport(report.id)}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new report.</p>
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedReport.title}</h3>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SpendScore */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">SpendScore™</h4>
                    <div className="flex items-center">
                      <div className={`text-3xl font-bold ${getScoreColor(selectedReport.spend_score).split(' ')[0]}`}>
                        {selectedReport.spend_score}
                      </div>
                      <ChartBarIcon className="h-8 w-8 ml-2 text-gray-400" />
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Key Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Waste Percentage:</span>
                        <span className="text-red-600">{selectedReport.insights.waste_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duplicate Expenses:</span>
                        <span>{selectedReport.insights.duplicate_expenses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spending Spikes:</span>
                        <span>{selectedReport.insights.spending_spikes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Savings Opportunities:</span>
                        <span className="text-green-600">{selectedReport.insights.savings_opportunities}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">AI Recommendations</h4>
                  <ul className="space-y-2">
                    {selectedReport.insights.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3"></span>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Sample Report</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This will create a sample financial report with mock data for demonstration purposes.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createSampleReport}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsManager