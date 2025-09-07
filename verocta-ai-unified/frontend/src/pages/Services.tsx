import React from 'react'
import { Link } from 'react-router-dom'
import { 
  CogIcon, 
  ChartBarIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  CloudIcon,
  CpuChipIcon 
} from '@heroicons/react/24/outline'

const Services: React.FC = () => {
  const services = [
    {
      icon: CogIcon,
      title: 'AI Consulting',
      description: 'Strategic guidance on AI implementation, technology selection, and digital transformation.',
      features: ['AI Strategy Development', 'Technology Assessment', 'Implementation Roadmap', 'Change Management'],
      price: 'Custom Quote'
    },
    {
      icon: ChartBarIcon,
      title: 'Data Analytics',
      description: 'Advanced analytics and business intelligence solutions powered by AI.',
      features: ['Predictive Analytics', 'Business Intelligence', 'Data Visualization', 'Performance Metrics'],
      price: 'From $5,000'
    },
    {
      icon: SparklesIcon,
      title: 'Machine Learning',
      description: 'Custom machine learning models and algorithms for your specific business needs.',
      features: ['Custom ML Models', 'Algorithm Development', 'Model Training', 'Performance Optimization'],
      price: 'From $10,000'
    },
    {
      icon: ShieldCheckIcon,
      title: 'AI Security',
      description: 'Comprehensive security solutions for AI systems and data protection.',
      features: ['AI Model Security', 'Data Privacy', 'Compliance', 'Threat Detection'],
      price: 'From $7,500'
    },
    {
      icon: CloudIcon,
      title: 'Cloud AI Solutions',
      description: 'Scalable AI solutions deployed on cloud infrastructure.',
      features: ['Cloud Deployment', 'Scalability', 'Cost Optimization', '24/7 Monitoring'],
      price: 'From $3,000/month'
    },
    {
      icon: CpuChipIcon,
      title: 'Custom AI Development',
      description: 'Tailored AI solutions designed specifically for your unique requirements.',
      features: ['Custom Development', 'Integration', 'Testing', 'Deployment'],
      price: 'Custom Quote'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive AI solutions designed to transform your business operations, 
            enhance decision-making, and drive sustainable growth.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-lg font-semibold text-primary-600 mb-4">
                    {service.price}
                  </p>
                  <Link 
                    to="/contact" 
                    className="btn-primary w-full text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A proven methodology that ensures successful AI implementation and 
              maximum return on investment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600">
                We analyze your business needs and identify AI opportunities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategy</h3>
              <p className="text-gray-600">
                We develop a comprehensive AI strategy and implementation plan.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Development</h3>
              <p className="text-gray-600">
                We build and deploy your AI solution with rigorous testing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimization</h3>
              <p className="text-gray-600">
                We continuously monitor and optimize your AI solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how our AI services can help you achieve your business goals 
            and stay ahead of the competition.
          </p>
          <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Services
