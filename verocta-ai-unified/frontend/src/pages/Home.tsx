import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, SparklesIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline'

const Home: React.FC = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Solutions',
      description: 'Cutting-edge artificial intelligence that transforms your business operations and decision-making processes.'
    },
    {
      icon: ChartBarIcon,
      title: 'Data Analytics',
      description: 'Advanced analytics and insights that help you understand your data and make informed decisions.'
    },
    {
      icon: CogIcon,
      title: 'Custom Development',
      description: 'Tailored AI solutions designed specifically for your unique business requirements and challenges.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Business with{' '}
            <span className="text-gradient">Advanced AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            VeroctaAI delivers cutting-edge artificial intelligence solutions that drive innovation, 
            efficiency, and growth for modern businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services" className="btn-primary text-lg px-8 py-3">
              Explore Services
              <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link to="/contact" className="btn-secondary text-lg px-8 py-3">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VeroctaAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with deep industry expertise to deliver 
              AI solutions that truly make a difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how VeroctaAI can help transform your business with 
            the power of artificial intelligence.
          </p>
          <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
