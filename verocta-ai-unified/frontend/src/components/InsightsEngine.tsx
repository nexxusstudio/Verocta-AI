import React, { useState, useEffect } from 'react'
import { apiClient } from '@utils/api'
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface InsightData {
  spendScore: number
  wastePercentage: number
  duplicateExpenses: number
  spendingSpikes: number
  savingsOpportunities: number
  totalProcessed: number
  recommendations: string[]
  categories: Array<{
    name: string
    amount: number
    percentage: number
    trend: 'up' | 'down' | 'stable'
  }>
  forecast: Array<{
    month: string
    predicted: number
    actual?: number
  }>
}

const InsightsEngine: React.FC = () => {
  const [insights, setInsights] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState('overview')

  useEffect(() => {
    generateMockInsights()
  }, [])

  const generateMockInsights = async () => {
    // Simulate API call delay
    setTimeout(() => {
      const mockInsights: InsightData = {
        spendScore: 78,
        wastePercentage: 12.4,
        duplicateExpenses: 23,
        spendingSpikes: 5,
        savingsOpportunities: 8,
        totalProcessed: 125000,
        recommendations: [
          'Consolidate software subscriptions to save ~$2,400/year',
          'Implement approval workflow for expenses >$500',
          'Renegotiate terms with top 3 vendors for 15% discount',
          'Automate recurring payments to reduce processing fees',
          'Review and cancel unused subscriptions saving $890/month'
        ],
        categories: [
          { name: 'Software & SaaS', amount: 25000, percentage: 20, trend: 'up' },
          { name: 'Office Supplies', amount: 18000, percentage: 14.4, trend: 'down' },
          { name: 'Marketing', amount: 22000, percentage: 17.6, trend: 'up' },
          { name: 'Travel', amount: 15000, percentage: 12, trend: 'stable' },
          { name: 'Utilities', amount: 12000, percentage: 9.6, trend: 'stable' },
          { name: 'Other', amount: 33000, percentage: 26.4, trend: 'up' }
        ],
        forecast: [
          { month: 'Jan', predicted: 95000, actual: 92000 },
          { month: 'Feb', predicted: 88000, actual: 91000 },
          { month: 'Mar', predicted: 102000, actual: 98000 },
          { month: 'Apr', predicted: 96000 },
          { month: 'May', predicted: 104000 },
          { month: 'Jun', predicted: 99000 }
        ]
      }
      setInsights(mockInsights)
      setLoading(false)
    }, 1000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />
      case 'down':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-green-500" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!insights) return null

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">SpendScore™ Insights Engine</h2>
        <p className="mt-2 text-gray-600">AI-powered financial intelligence and optimization</p>
      </div>

      {/* Main SpendScore */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white text-center">
        <ChartBarIcon className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-3xl font-bold mb-2">{insights.spendScore}</h3>
        <p className="text-indigo-100">Overall SpendScore™</p>
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-3">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-1000"
            style={{ width: `${insights.spendScore}%` }}
          ></div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Waste Detected</p>
              <p className="text-2xl font-bold text-red-600">{insights.wastePercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DocumentDuplicateIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Duplicates</p>
              <p className="text-2xl font-bold text-orange-600">{insights.duplicateExpenses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUpIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Spending Spikes</p>
              <p className="text-2xl font-bold text-blue-600">{insights.spendingSpikes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Savings Opps</p>
              <p className="text-2xl font-bold text-green-600">{insights.savingsOpportunities}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h3>
        <div className="space-y-4">
          {insights.categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-24 text-sm text-gray-600">{category.name}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-indigo-600 rounded-full h-3 transition-all duration-1000"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-900">
                  ${category.amount.toLocaleString()}
                </div>
                <div className="w-12 text-sm text-gray-600">
                  {category.percentage}%
                </div>
                <div className="w-8 flex justify-center">
                  {getTrendIcon(category.trend)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <LightBulbIcon className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-medium text-gray-900 ml-2">AI Recommendations</h3>
        </div>
        <div className="space-y-3">
          {insights.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <p className="ml-3 text-sm text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Potential Annual Savings: $18,400</strong> by implementing these recommendations
          </p>
        </div>
      </div>

      {/* Forecasting */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">6-Month Spending Forecast</h3>
        <div className="grid grid-cols-6 gap-4">
          {insights.forecast.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-sm text-gray-600 mb-2">{item.month}</div>
              <div className="relative h-20 bg-gray-100 rounded">
                <div 
                  className="absolute bottom-0 w-full bg-indigo-600 rounded transition-all duration-1000"
                  style={{ height: `${(item.predicted / 120000) * 100}%` }}
                ></div>
                {item.actual && (
                  <div 
                    className="absolute bottom-0 w-1 bg-green-500 left-1/2 transform -translate-x-1/2"
                    style={{ height: `${(item.actual / 120000) * 100}%` }}
                  ></div>
                )}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                ${Math.round(item.predicted / 1000)}k
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <div className="flex items-center mr-6">
            <div className="w-3 h-3 bg-indigo-600 rounded mr-2"></div>
            Predicted
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            Actual
          </div>
        </div>
      </div>

      {/* Benchmarking */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Industry Benchmarking</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">Better</div>
            <div className="text-sm text-gray-600">vs. Industry Average</div>
            <div className="text-xs text-gray-500 mt-1">Software waste: 8% vs 15%</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">Average</div>
            <div className="text-sm text-gray-600">Expense Processing</div>
            <div className="text-xs text-gray-500 mt-1">3.2 days vs 3.1 days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">Top 25%</div>
            <div className="text-sm text-gray-600">Cost Optimization</div>
            <div className="text-xs text-gray-500 mt-1">12.4% savings identified</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsightsEngine