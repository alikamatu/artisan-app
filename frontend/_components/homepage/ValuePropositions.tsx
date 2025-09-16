"use client";

import { motion } from 'framer-motion';
import { 
  UserCheck, 
  Briefcase, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Clock, 
  BarChart2, 
  Users, 
  Wallet, 
  Globe, 
  LayoutGrid, 
  TrendingUp 
} from 'lucide-react';

export default function ValuePropositions() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-20 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-4"
          >
            <p className="text-sm font-medium">OUR VALUE PROPOSITION</p>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Value for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Everyone</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            We've designed a platform that creates value for all stakeholders
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* For Clients Card */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-indigo-100 transition-all"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-xl">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 ml-4">For Clients</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Fast access to verified professionals</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Secure transactions & payment protection</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">24-hour service matching guarantee</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <BarChart2 className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Transparent pricing & quality ratings</p>
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Average rating from clients</p>
                  <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-green-800 font-bold">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* For Workers Card */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-indigo-100 transition-all"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-3 rounded-xl">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 ml-4">For Workers</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Access to 1M+ potential clients</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Wallet className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Streamlined payments & earnings dashboard</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Globe className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Centralized job discovery & reputation management</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <LayoutGrid className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Professional profile & portfolio showcase</p>
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Average earnings increase</p>
                  <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="ml-1 text-green-800 font-bold">+42%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* For Platform Card */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-indigo-100 transition-all md:col-span-2 lg:col-span-1"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-emerald-600 to-green-600 p-3 rounded-xl">
                  <Cpu className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 ml-4">For Platform</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <BarChart2 className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Multiple revenue streams & scalable marketplace</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Comprehensive admin oversight & dispute resolution</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Globe className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Geographic insights & trend analysis</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Sustainable growth through user satisfaction</p>
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Platform growth rate</p>
                  <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="ml-1 text-green-800 font-bold">+78% YoY</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const Star = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);