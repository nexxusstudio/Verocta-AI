import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, ChartBarIcon, CurrencyDollarIcon, DocumentChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline'

const Home: React.FC = () => {
  const features = [
    {
      icon: ChartBarIcon,
      title: 'SpendScore™ Analytics',
      description: 'Get your financial health score (0-100) with actionable insights to optimize spending patterns.'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Waste Detection',
      description: 'Automatically identify duplicate subscriptions, unused services, and spending anomalies.'
    },
    {
      icon: DocumentChartBarIcon,
      title: 'Smart Reports',
      description: 'Generate comprehensive PDF reports with charts, recommendations, and forecasting.'
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered Insights',
      description: 'Advanced analytics with category breakdowns, trends, and optimization recommendations.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/src/assets/verocta-logo.svg" alt="Verocta" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900">Verocta</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Optimize Your Business Spending with{' '}
            <span className="text-blue-600">AI-Powered Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Verocta analyzes your financial data to identify waste, track spending patterns, 
            and provide actionable recommendations to reduce costs and improve efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center">
              Start Free Trial
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Financial Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand, optimize, and control your business spending.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-8">
            Trusted by finance teams at growing companies
          </h3>
          <div className="flex items-center justify-center space-x-8 opacity-50">
            <div className="bg-gray-200 h-8 w-24 rounded"></div>
            <div className="bg-gray-200 h-8 w-24 rounded"></div>
            <div className="bg-gray-200 h-8 w-24 rounded"></div>
            <div className="bg-gray-200 h-8 w-24 rounded"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to optimize your spending?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses already saving money with Verocta's AI-powered insights.
          </p>
          <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/src/assets/verocta-logo.svg" alt="Verocta" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-white">Verocta</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Verocta. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home