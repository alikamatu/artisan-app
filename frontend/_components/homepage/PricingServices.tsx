"use client";

import { motion } from 'framer-motion';
import { 
  Wrench, 
  Droplet, 
  Zap, 
  Brush, 
  GraduationCap, 
  Home, 
  Settings, 
  HeartPulse,
  Smartphone,
  ArrowRight,
  Check,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';

type CategoryKey = 'home' | 'plumbing' | 'electrical' | 'renovation' | 'cleaning' | 'tutoring' | 'tech' | 'wellness';

export default function PricingServices() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('home');
  
  const categories = [
    { id: 'home', name: 'Home Services', icon: Home },
    { id: 'plumbing', name: 'Plumbing', icon: Droplet },
    { id: 'electrical', name: 'Electrical', icon: Zap },
    { id: 'renovation', name: 'Renovation', icon: Wrench },
    { id: 'cleaning', name: 'Cleaning', icon: Brush },
    { id: 'tutoring', name: 'Tutoring', icon: GraduationCap },
    { id: 'tech', name: 'Tech Support', icon: Smartphone },
    { id: 'wellness', name: 'Wellness', icon: HeartPulse }
  ];

  const serviceExamples = {
    home: [
      { name: 'Handyman Services', price: '$65 - $120/hr', description: 'General repairs and installations' },
      { name: 'Furniture Assembly', price: '$80 - $200', description: 'Flat-pack furniture setup' },
      { name: 'TV Mounting', price: '$100 - $250', description: 'Wall mounting and setup' },
      { name: 'Smart Home Setup', price: '$120 - $350', description: 'Device installation and configuration' }
    ],
    plumbing: [
      { name: 'Leak Repair', price: '$150 - $450', description: 'Fix leaking pipes or faucets' },
      { name: 'Toilet Installation', price: '$200 - $600', description: 'Remove old and install new toilet' },
      { name: 'Water Heater Repair', price: '$250 - $800', description: 'Diagnose and fix water heater issues' },
      { name: 'Drain Cleaning', price: '$120 - $350', description: 'Unclog sinks, showers, or tubs' }
    ],
    electrical: [
      { name: 'Light Fixture Installation', price: '$100 - $300', description: 'Replace or install new fixtures' },
      { name: 'Outlet/Switch Replacement', price: '$80 - $200', description: 'Update old or faulty outlets' },
      { name: 'Circuit Breaker Repair', price: '$250 - $600', description: 'Diagnose and fix breaker issues' },
      { name: 'Whole House Rewiring', price: '$3,000 - $8,000', description: 'Complete electrical system update' }
    ],
    renovation: [
      { name: 'Bathroom Remodel', price: '$8,000 - $25,000', description: 'Complete bathroom renovation' },
      { name: 'Kitchen Upgrade', price: '$12,000 - $35,000', description: 'Cabinets, countertops, fixtures' },
      { name: 'Flooring Installation', price: '$1,500 - $5,000', description: 'Hardwood, laminate, or tile' },
      { name: 'Deck Building', price: '$4,000 - $15,000', description: 'Wood or composite deck construction' }
    ],
    cleaning: [
      { name: 'Deep House Cleaning', price: '$200 - $500', description: 'Thorough whole-house cleaning' },
      { name: 'Move-In/Move-Out Clean', price: '$250 - $600', description: 'Complete cleaning for transitions' },
      { name: 'Commercial Cleaning', price: '$35 - $70/hr', description: 'Office or retail space maintenance' },
      { name: 'Carpet Cleaning', price: '$120 - $300', description: 'Professional steam cleaning' }
    ],
    tutoring: [
      { name: 'Math Tutoring', price: '$40 - $80/hr', description: 'Elementary to college level' },
      { name: 'Language Lessons', price: '$35 - $75/hr', description: 'ESL, Spanish, French, etc.' },
      { name: 'Test Preparation', price: '$50 - $120/hr', description: 'SAT, ACT, GRE prep' },
      { name: 'Music Lessons', price: '$45 - $100/hr', description: 'Piano, guitar, voice instruction' }
    ],
    tech: [
      { name: 'Computer Repair', price: '$80 - $250', description: 'Diagnose and fix hardware issues' },
      { name: 'Virus Removal', price: '$100 - $300', description: 'Malware and virus cleanup' },
      { name: 'Home Network Setup', price: '$150 - $500', description: 'Router installation and configuration' },
      { name: 'Smart Device Setup', price: '$80 - $200', description: 'Install and configure smart home devices' }
    ],
    wellness: [
      { name: 'Massage Therapy', price: '$70 - $150/hr', description: 'Swedish, deep tissue, sports' },
      { name: 'Personal Training', price: '$60 - $120/hr', description: 'Custom fitness programs' },
      { name: 'Yoga Instruction', price: '$50 - $100/hr', description: 'Private or small group sessions' },
      { name: 'Nutrition Coaching', price: '$80 - $150/hr', description: 'Personalized meal planning' }
    ]
  };

  const pricingModels = [
    {
      title: "Hourly Rate",
      icon: Settings,
      description: "Pay for the exact time spent on your project",
      bestFor: "Small tasks and consultations",
      average: "$65 - $150/hr"
    },
    {
      title: "Fixed Price",
      icon: DollarSign,
      description: "Know the total cost upfront with no surprises",
      bestFor: "Well-defined projects with clear scope",
      average: "$100 - $15,000+"
    },
    {
      title: "Package Deals",
      icon: Check,
      description: "Bundled services at discounted rates",
      bestFor: "Multiple services or ongoing maintenance",
      average: "Save 15-30%"
    }
  ];

  return (
    <section className="relative py-24 w-full overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-100 rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-100 rounded-full blur-[120px] opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full mb-5"
          >
            <DollarSign className="h-5 w-5" />
            <p className="text-sm font-medium">PRICING TRANSPARENCY</p>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Clear Pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Every Service</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            No hidden fees. Browse average costs for services in your area
          </motion.p>
        </div>

        {/* Pricing Models */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-12">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
            >
              Flexible Pricing Models
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Choose the payment structure that works best for your project
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingModels.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-5">
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
                    <model.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 ml-4">{model.title}</h4>
                </div>
                
                <p className="text-gray-600 mb-6">{model.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Best for:</p>
                  <p className="text-gray-800 font-medium">{model.bestFor}</p>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500">Average cost:</p>
                  <p className="text-xl font-bold text-indigo-600">{model.average}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Explore Service Categories
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our most popular categories and typical pricing
            </p>
          </motion.div>
          
          {/* Category Navigation */}
          <div className="mb-10">
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id as CategoryKey)}
                    className={`px-5 py-3 rounded-xl flex items-center transition-all ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <category.icon className="h-5 w-5 mr-2" />
                    <span className="font-medium whitespace-nowrap">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceExamples[activeCategory].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-gray-900">{service.name}</h4>
                    <div className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold rounded-full">
                      {service.price}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <button className="text-indigo-600 font-medium flex items-center">
                      View details <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                      Book Now
                    </button>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span>24+ professionals available</span>
                  </div>
                  <span className="text-sm text-gray-500">Response time: <span className="font-medium">Under 2 hours</span></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Calculator */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-500 rounded-full blur-[80px] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Estimate Your Project Cost</h3>
                <p className="text-gray-600 mb-6">
                  Get an instant estimate based on similar projects in your area
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                    <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option>Select a service</option>
                      {serviceExamples[activeCategory].map((service, index) => (
                        <option key={index}>{service.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Size</label>
                    <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option>Small (1-2 hours)</option>
                      <option>Medium (Half day)</option>
                      <option>Large (Full day)</option>
                      <option>Extra Large (Multiple days)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location (Zip Code)</label>
                    <input 
                      type="text" 
                      placeholder="Enter your zip code" 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <button className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                    Calculate Estimate
                  </button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-gray-900">Estimated Cost</h4>
                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                      Average Range
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Service Cost</span>
                      <span className="font-medium">$250 - $600</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Materials</span>
                      <span className="font-medium">$80 - $200</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-medium">$25</span>
                    </div>
                    <div className="h-px bg-gray-200 my-4"></div>
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total Estimate</span>
                      <span className="text-xl font-bold text-indigo-600">$355 - $825</span>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <p className="text-indigo-700 flex items-start">
                      <span className="bg-indigo-100 rounded-full p-1 mr-2">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </span>
                      <span>This estimate includes all fees. Actual pricing may vary based on specific project requirements.</span>
                    </p>
                  </div>
                  
                  <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-gray-200 rounded-xl text-indigo-600 font-medium hover:bg-white transition-colors">
                    View Detailed Breakdown
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/homepage/grid-pattern.svg')] bg-[length:60px_60px] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[120px] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="lg:w-2/3 text-center lg:text-left">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-6"
                >
                  Ready to Start Your Project?
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-lg text-indigo-200 mb-8"
                >
                  Connect with verified professionals in your area today
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <button className="px-6 py-3.5 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center justify-center">
                    Browse Professionals
                  </button>
                  <button className="px-6 py-3.5 bg-indigo-800 text-white font-semibold rounded-full hover:bg-indigo-900 transition-all duration-300 flex items-center justify-center">
                    Post a Job
                  </button>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:w-1/3 flex justify-center"
              >
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl">
                    <DollarSign className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute -top-4 -left-4 bg-white px-4 py-2 rounded-full shadow-lg">
                    <span className="font-bold text-indigo-600">$0</span>
                    <span className="text-gray-600 ml-1">Booking Fee</span>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                    <span className="font-bold text-indigo-600">100%</span>
                    <span className="text-gray-600 ml-1">Payment Protection</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const Star = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);