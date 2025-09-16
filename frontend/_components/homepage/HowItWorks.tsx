"use client";

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
  LayoutGrid
} from 'lucide-react';

export default function HowItWorks() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const clientSteps = [
    { 
      icon: FileText, 
      title: 'Post a Job', 
      description: 'Describe your project needs, timeline, and budget',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      icon: Search, 
      title: 'Review Proposals', 
      description: 'Browse qualified workers and their quotes',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: UserCheck, 
      title: 'Hire & Pay Securely', 
      description: 'Select your worker and pay safely through escrow',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: Star, 
      title: 'Rate & Review', 
      description: 'Share your experience after job completion',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const workerSteps = [
    { 
      icon: UserPlus, 
      title: 'Create Profile', 
      description: 'Showcase your skills, experience, and certifications',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      icon: Briefcase, 
      title: 'Browse Jobs', 
      description: 'Find projects matching your skills and availability',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Send, 
      title: 'Submit Proposal', 
      description: 'Send your quote and timeline to potential clients',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: Wallet, 
      title: 'Get Paid & Reviewed', 
      description: 'Receive payment and build your reputation',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <section className="py-20 w-full overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-purple-100 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-blue-100 rounded-full blur-[100px] opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-4"
          >
            <LayoutGrid className="h-5 w-5" />
            <p className="text-sm font-medium">SIMPLE PROCESS</p>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            How It Works in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">4 Simple Steps</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Our platform makes it easy for everyone to connect and succeed
          </motion.p>
        </div>

        {/* Process Visualization */}
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
                        <p className="text-gray-600">{step.description}</p>
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
                        <p className="text-gray-600">{step.description}</p>
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
        
        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[120px] opacity-10"></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <CheckCircle className="h-5 w-5 text-white" />
              <p className="text-sm font-medium text-white">READY TO GET STARTED?</p>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Join thousands of clients and workers building success together
            </h3>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
              >
                Sign Up as Client
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-indigo-800 text-white font-semibold rounded-full hover:bg-indigo-900 transition-all duration-300 flex items-center justify-center"
              >
                Join as Worker
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
            
            <p className="text-indigo-200 mt-6">
              Get started in minutes • No credit card required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}