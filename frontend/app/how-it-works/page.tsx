"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  UserCheck, 
  Star,
  UserPlus, 
  Briefcase, 
  Send, 
  Wallet,
  ArrowRight,
  CheckCircle,
  LayoutGrid,
  Shield,
  Clock,
  Users,
  Award,
  Zap,
  Heart,
} from 'lucide-react';

export default function HowItWorksPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const clientSteps = [
    { 
      icon: FileText, 
      title: 'Post a Job', 
      description: 'Describe your project needs, timeline, and budget',
      details: 'Create a detailed job posting with requirements, location, and your budget. Our smart matching system will connect you with qualified professionals.',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      icon: Search, 
      title: 'Review Proposals', 
      description: 'Browse qualified workers and their quotes',
      details: 'Receive multiple proposals from verified professionals. Compare quotes, read reviews, and check credentials to make the best choice.',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: UserCheck, 
      title: 'Hire & Pay Securely', 
      description: 'Select your worker and pay safely through escrow',
      details: 'Choose your preferred professional and pay securely through our escrow system. Funds are only released when you\'re satisfied with the work.',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: Star, 
      title: 'Rate & Review', 
      description: 'Share your experience after job completion',
      details: 'After the job is complete, rate your experience and leave a review. Help other clients make informed decisions while building the community.',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const workerSteps = [
    { 
      icon: UserPlus, 
      title: 'Create Profile', 
      description: 'Showcase your skills, experience, and certifications',
      details: 'Build a professional profile highlighting your expertise, certifications, and portfolio. Stand out to potential clients with verified credentials.',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      icon: Briefcase, 
      title: 'Browse Jobs', 
      description: 'Find projects matching your skills and availability',
      details: 'Browse available jobs that match your skills and schedule. Use filters to find projects in your area with your preferred compensation.',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Send, 
      title: 'Submit Proposal', 
      description: 'Send your quote and timeline to potential clients',
      details: 'Submit detailed proposals with your pricing, timeline, and approach. Show clients why you\'re the best choice for their project.',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: Wallet, 
      title: 'Get Paid & Reviewed', 
      description: 'Receive payment and build your reputation',
      details: 'Complete the work, receive secure payment, and earn positive reviews. Build your reputation to attract more clients and higher-paying projects.',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const platformFeatures = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "All transactions are protected by our secure escrow system",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support for any questions or issues",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Verified Professionals",
      description: "All workers are background-checked and verified",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee on all completed work",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Fast Matching",
      description: "Get connected with qualified professionals in minutes",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Built on trust, transparency, and mutual success",
      color: "from-red-500 to-pink-500"
    }
  ];

  const successStats = [
    { number: "50,000+", label: "Happy Clients", icon: Users },
    { number: "25,000+", label: "Verified Workers", icon: Briefcase },
    { number: "98%", label: "Satisfaction Rate", icon: Star },
    { number: "24hrs", label: "Average Response", icon: Clock }
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
            <div className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-6 py-3 rounded-full mb-6">
              <LayoutGrid className="h-5 w-5" />
              <p className="text-sm font-medium">SIMPLE PROCESS</p>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              How It Works in
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> 4 Simple Steps</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Our platform makes it easy for everyone to connect and succeed. Whether you&apos;re a client looking for skilled professionals
              or a worker seeking new opportunities, we&apos;ve streamlined the entire process.
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
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Statistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {successStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Visualization */}
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
              Two-Way Process for Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform works seamlessly for both clients and workers, creating a win-win ecosystem
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
            {/* Client Process */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-xl">
                  <UserCheck className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">For Clients</h3>
                  <p className="text-gray-500">Find skilled workers in minutes</p>
                </div>
              </div>
              
              <div className="relative pl-10">
                {/* Vertical timeline */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-amber-500"></div>
                
                {clientSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.2 }}
                    className="relative mb-10 last:mb-0"
                  >
                    {/* Step indicator */}
                    <div className="absolute -left-10 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border-4 border-white">
                      <motion.div 
                        className={`w-6 h-6 rounded-full bg-gradient-to-r ${step.color}`}
                        whileHover={{ scale: 1.1 }}
                      />
                    </div>
                    
                    {/* Step number */}
                    <div className="absolute -left-14 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200">
                      <span className="font-bold text-gray-700">{index + 1}</span>
                    </div>
                    
                    {/* Step content */}
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className={`bg-gradient-to-r ${step.color} p-3 rounded-lg`}>
                          <step.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          <p className="text-sm text-gray-500">{step.details}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow connector */}
                    {index < clientSteps.length - 1 && (
                      <div className="absolute left-0 top-full h-10 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Worker Process */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-3 rounded-xl">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">For Workers</h3>
                  <p className="text-gray-500">Grow your business efficiently</p>
                </div>
              </div>
              
              <div className="relative pl-10">
                {/* Vertical timeline */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-amber-500"></div>
                
                {workerSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.2 }}
                    className="relative mb-10 last:mb-0"
                  >
                    {/* Step indicator */}
                    <div className="absolute -left-10 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border-4 border-white">
                      <motion.div 
                        className={`w-6 h-6 rounded-full bg-gradient-to-r ${step.color}`}
                        whileHover={{ scale: 1.1 }}
                      />
                    </div>
                    
                    {/* Step number */}
                    <div className="absolute -left-14 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200">
                      <span className="font-bold text-gray-700">{index + 1}</span>
                    </div>
                    
                    {/* Step content */}
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className={`bg-gradient-to-r ${step.color} p-3 rounded-lg`}>
                          <step.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          <p className="text-sm text-gray-500">{step.details}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow connector */}
                    {index < workerSteps.length - 1 && (
                      <div className="absolute left-0 top-full h-10 w-0.5 bg-gradient-to-b from-blue-500 to-green-500"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
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
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;ve built the most trusted and efficient platform for connecting clients with skilled professionals
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
            <div className="inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <CheckCircle className="h-5 w-5 text-white" />
              <p className="text-sm font-medium text-white">READY TO GET STARTED?</p>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Join thousands of clients and workers building success together
            </h2>
            
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Start your journey today and experience the difference our platform makes in connecting talent with opportunity.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Sign Up as Client
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-indigo-800 text-white font-semibold rounded-xl hover:bg-indigo-900 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Join as Worker
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </div>
            
            <p className="text-indigo-200 mt-6">
              Get started in minutes • No credit card required • 100% free to join
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
