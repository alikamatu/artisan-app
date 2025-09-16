"use client";

import { motion } from 'framer-motion';
import { 
  User, 
  HardHat, 
  Search, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  MapPin, 
  FileText, 
  Frown 
} from 'lucide-react';

export default function ProblemStatement() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const clientPainPoints = [
    { icon: Search, text: 'Difficulty finding trusted skilled workers quickly' },
    { icon: DollarSign, text: 'Lack of transparency in pricing and service quality' },
    { icon: MessageSquare, text: 'Inconsistent service delivery and communication' },
    { icon: FileText, text: 'Limited access to verified professional credentials' }
  ];

  const workerPainPoints = [
    { icon: MapPin, text: 'Fragmented job discovery across multiple platforms' },
    { icon: Calendar, text: 'Difficulty building and maintaining professional reputation' },
    { icon: CreditCard, text: 'Inefficient payment processing and financial management' },
    { icon: HardHat, text: 'Limited tools for schedule and client management' }
  ];

  return (
    <section className="py-20 w-full relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200 rounded-full blur-[100px] opacity-40"></div>
      <div className="absolute top-20 left-10 w-48 h-48 bg-indigo-200 rounded-full blur-[80px] opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full mb-4"
          >
            <Frown className="h-5 w-5" />
            <p className="text-sm font-medium">THE PROBLEM WE SOLVE</p>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Ending the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">Frustration</span> for Everyone
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Traditional skilled labor markets create pain points for both clients and workers. We're changing that.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Client Pain Points */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-purple-500"></div>
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-rose-100 to-rose-50 p-3 rounded-xl border border-rose-200">
                <User className="h-8 w-8 text-rose-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">Client Challenges</h3>
                <p className="text-gray-500">Finding reliable help shouldn't be this hard</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {clientPainPoints.map((point, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-start p-4 bg-rose-50/50 rounded-xl border border-rose-100 hover:border-rose-200 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1 bg-white p-2 rounded-lg border border-rose-200">
                    <point.icon className="h-5 w-5 text-rose-600" />
                  </div>
                  <p className="ml-4 text-gray-700 font-medium">{point.text}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-rose-500" />
                </div>
                <p className="ml-3 text-gray-600">
                  <span className="font-semibold">Average search time: </span> 
                  5-7 days to find a trusted worker
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Worker Pain Points */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-50 p-3 rounded-xl border border-indigo-200">
                <HardHat className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">Worker Challenges</h3>
                <p className="text-gray-500">Building a sustainable business shouldn't be this difficult</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {workerPainPoints.map((point, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-start p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1 bg-white p-2 rounded-lg border border-indigo-200">
                    <point.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <p className="ml-4 text-gray-700 font-medium">{point.text}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-indigo-500" />
                </div>
                <p className="ml-3 text-gray-600">
                  <span className="font-semibold">Payment delays: </span> 
                  30-45 day average for traditional payment cycles
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-3xl mx-auto bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-[80px] opacity-10"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Our Solution: A Platform Built for Everyone
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're creating a balanced marketplace that addresses these pain points simultaneously - 
              connecting clients with trusted professionals in under 24 hours while giving workers 
              the tools they need to grow their business.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}