"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Droplet, 
  Zap, 
  Brush, 
  GraduationCap, 
  Home, 
  HeartPulse,
  Smartphone,
  ArrowRight,
  Check,
  DollarSign,
  Star,
  Clock,
  Users,
  Shield,
  Award,
  TrendingUp,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useState } from 'react';

type CategoryKey = 'home' | 'plumbing' | 'electrical' | 'renovation' | 'cleaning' | 'tutoring' | 'tech' | 'wellness';

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('home');
  
  const categories = [
    { id: 'home', name: 'Home Services', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { id: 'plumbing', name: 'Plumbing', icon: Droplet, color: 'from-blue-600 to-indigo-600' },
    { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { id: 'renovation', name: 'Renovation', icon: Wrench, color: 'from-gray-600 to-gray-800' },
    { id: 'cleaning', name: 'Cleaning', icon: Brush, color: 'from-green-500 to-emerald-500' },
    { id: 'tutoring', name: 'Tutoring', icon: GraduationCap, color: 'from-purple-500 to-pink-500' },
    { id: 'tech', name: 'Tech Support', icon: Smartphone, color: 'from-indigo-500 to-purple-500' },
    { id: 'wellness', name: 'Wellness', icon: HeartPulse, color: 'from-red-500 to-pink-500' }
  ];

  const serviceExamples = {
    home: [
      { name: 'Handyman Services', price: '$65 - $120/hr', description: 'General repairs and installations', features: ['Same-day service', 'Licensed professionals', 'Warranty included'] },
      { name: 'Furniture Assembly', price: '$80 - $200', description: 'Flat-pack furniture setup', features: ['Expert assembly', 'Quality assurance', 'Clean workspace'] },
      { name: 'TV Mounting', price: '$100 - $250', description: 'Wall mounting and setup', features: ['Professional mounting', 'Cable management', 'Safety guaranteed'] },
      { name: 'Smart Home Setup', price: '$120 - $350', description: 'Device installation and configuration', features: ['Latest technology', 'Integration support', 'Training included'] }
    ],
    plumbing: [
      { name: 'Leak Repair', price: '$150 - $450', description: 'Fix leaking pipes or faucets', features: ['Emergency service', 'Leak detection', 'Preventive maintenance'] },
      { name: 'Toilet Installation', price: '$200 - $600', description: 'Remove old and install new toilet', features: ['Professional installation', 'Water efficiency', 'Clean removal'] },
      { name: 'Water Heater Repair', price: '$250 - $800', description: 'Diagnose and fix water heater issues', features: ['24/7 emergency', 'Expert diagnosis', 'Energy efficient'] },
      { name: 'Drain Cleaning', price: '$120 - $350', description: 'Unclog sinks, showers, or tubs', features: ['Advanced equipment', 'Root cause analysis', 'Prevention tips'] }
    ],
    electrical: [
      { name: 'Light Fixture Installation', price: '$100 - $300', description: 'Replace or install new fixtures', features: ['LED upgrades', 'Safety compliance', 'Energy efficient'] },
      { name: 'Outlet/Switch Replacement', price: '$80 - $200', description: 'Update old or faulty outlets', features: ['Code compliance', 'Safety testing', 'Modern upgrades'] },
      { name: 'Circuit Breaker Repair', price: '$250 - $600', description: 'Diagnose and fix breaker issues', features: ['Expert diagnosis', 'Safety first', 'Preventive care'] },
      { name: 'Whole House Rewiring', price: '$3,000 - $8,000', description: 'Complete electrical system update', features: ['Full inspection', 'Modern standards', 'Safety upgrade'] }
    ],
    renovation: [
      { name: 'Bathroom Remodel', price: '$8,000 - $25,000', description: 'Complete bathroom renovation', features: ['Custom design', 'Quality materials', 'Timeline guarantee'] },
      { name: 'Kitchen Upgrade', price: '$12,000 - $35,000', description: 'Cabinets, countertops, fixtures', features: ['Modern design', 'Durable materials', 'Functionality focus'] },
      { name: 'Flooring Installation', price: '$1,500 - $5,000', description: 'Hardwood, laminate, or tile', features: ['Expert installation', 'Material selection', 'Warranty included'] },
      { name: 'Deck Building', price: '$4,000 - $15,000', description: 'Wood or composite deck construction', features: ['Custom design', 'Weather resistant', 'Safety compliance'] }
    ],
    cleaning: [
      { name: 'Deep House Cleaning', price: '$200 - $500', description: 'Thorough whole-house cleaning', features: ['Eco-friendly products', 'Attention to detail', 'Satisfaction guarantee'] },
      { name: 'Move-In/Move-Out Clean', price: '$250 - $600', description: 'Complete cleaning for transitions', features: ['Comprehensive service', 'Flexible scheduling', 'Quality assurance'] },
      { name: 'Commercial Cleaning', price: '$35 - $70/hr', description: 'Office or retail space maintenance', features: ['Regular scheduling', 'Professional staff', 'Custom plans'] },
      { name: 'Carpet Cleaning', price: '$120 - $300', description: 'Professional steam cleaning', features: ['Deep cleaning', 'Stain removal', 'Odor elimination'] }
    ],
    tutoring: [
      { name: 'Math Tutoring', price: '$40 - $80/hr', description: 'Elementary to college level', features: ['Personalized approach', 'Progress tracking', 'Flexible scheduling'] },
      { name: 'Language Lessons', price: '$35 - $75/hr', description: 'ESL, Spanish, French, etc.', features: ['Native speakers', 'Conversation focus', 'Cultural context'] },
      { name: 'Test Preparation', price: '$50 - $120/hr', description: 'SAT, ACT, GRE prep', features: ['Practice tests', 'Strategy coaching', 'Score improvement'] },
      { name: 'Music Lessons', price: '$45 - $100/hr', description: 'Piano, guitar, voice instruction', features: ['Individual attention', 'Performance opportunities', 'Skill progression'] }
    ],
    tech: [
      { name: 'Computer Repair', price: '$80 - $250', description: 'Diagnose and fix hardware issues', features: ['Expert diagnosis', 'Quality parts', 'Warranty included'] },
      { name: 'Virus Removal', price: '$100 - $300', description: 'Malware and virus cleanup', features: ['Complete removal', 'Security updates', 'Prevention tips'] },
      { name: 'Home Network Setup', price: '$150 - $500', description: 'Router installation and configuration', features: ['Optimal coverage', 'Security setup', 'Device integration'] },
      { name: 'Smart Device Setup', price: '$80 - $200', description: 'Install and configure smart home devices', features: ['Latest devices', 'Integration support', 'User training'] }
    ],
    wellness: [
      { name: 'Massage Therapy', price: '$70 - $150/hr', description: 'Swedish, deep tissue, sports', features: ['Licensed therapists', 'Customized sessions', 'Relaxing environment'] },
      { name: 'Personal Training', price: '$60 - $120/hr', description: 'Custom fitness programs', features: ['Personalized plans', 'Progress tracking', 'Motivation support'] },
      { name: 'Yoga Instruction', price: '$50 - $100/hr', description: 'Private or small group sessions', features: ['All skill levels', 'Mind-body focus', 'Flexible scheduling'] },
      { name: 'Nutrition Coaching', price: '$80 - $150/hr', description: 'Personalized meal planning', features: ['Custom plans', 'Health goals', 'Ongoing support'] }
    ]
  };

  const pricingModels = [
    {
      title: "Hourly Rate",
      icon: Clock,
      description: "Pay for the exact time spent on your project",
      bestFor: "Small tasks and consultations",
      average: "$65 - $150/hr",
      features: ["Transparent billing", "No hidden costs", "Flexible scheduling"]
    },
    {
      title: "Fixed Price",
      icon: DollarSign,
      description: "Know the total cost upfront with no surprises",
      bestFor: "Well-defined projects with clear scope",
      average: "$100 - $15,000+",
      features: ["No surprise costs", "Project timeline", "Quality guarantee"]
    },
    {
      title: "Subscription",
      icon: TrendingUp,
      description: "Regular service at predictable monthly rates",
      bestFor: "Ongoing maintenance and regular services",
      average: "$99 - $299/month",
      features: ["Consistent service", "Priority scheduling", "Cost savings"]
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Licensed & Insured",
      description: "All our professionals are fully licensed, bonded, and insured for your peace of mind."
    },
    {
      icon: Star,
      title: "5-Star Rated",
      description: "Consistently rated 5 stars by thousands of satisfied customers across all platforms."
    },
    {
      icon: Clock,
      title: "Same-Day Service",
      description: "Emergency services available with same-day response for urgent repairs and issues."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Vetted professionals with years of experience and specialized training in their fields."
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee with free follow-up visits if you're not completely satisfied."
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer support and emergency services when you need them most."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with skilled professionals for all your home, business, and personal service needs. 
              Quality, reliability, and satisfaction guaranteed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                View Pricing
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our Service Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From home repairs to personal wellness, we offer comprehensive services across all major categories
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                variants={itemVariants}
                onClick={() => setActiveCategory(category.id as CategoryKey)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </motion.button>
            ))}
          </motion.div>

          {/* Service Examples */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {categories.find(c => c.id === activeCategory)?.name} Services
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceExamples[activeCategory].map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                  <p className="text-2xl font-bold text-indigo-600 mb-2">{service.price}</p>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Book Now
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Models */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Flexible Pricing Options
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the pricing model that works best for your needs and budget
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {pricingModels.map((model, index) => (
              <motion.div
                key={model.title}
                variants={itemVariants}
                className={`bg-white p-8 rounded-2xl border-2 shadow-lg ${
                  index === 1 ? 'border-indigo-500 scale-105' : 'border-gray-200'
                }`}
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${
                    index === 1 ? 'from-indigo-500 to-purple-500' : 'from-gray-500 to-gray-600'
                  } flex items-center justify-center`}>
                    <model.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{model.title}</h3>
                  <p className="text-gray-600 mb-4">{model.description}</p>
                  <p className="text-3xl font-bold text-indigo-600 mb-2">{model.average}</p>
                  <p className="text-sm text-gray-500">{model.bestFor}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {model.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-600">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    index === 1
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {index === 1 ? 'Get Started' : 'Learn More'}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to delivering exceptional service and building lasting relationships with our customers
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {whyChooseUs.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust SkillConnect for their service needs. 
              Get started today and experience the difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book a Service
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
