"use client";

import { motion } from 'framer-motion';
import { Mail, MessageCircle, Zap } from 'lucide-react';

export default function ContactPageHero() {
  return (
    <section className="relative w-full overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-200 rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute bottom-1/3 left-0 w-48 h-48 bg-indigo-200 rounded-full blur-[120px] opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full mb-5"
          >
            <Zap className="h-5 w-5" />
            <p className="text-sm font-medium">FAST SUPPORT</p>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Our Team</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Have questions or need assistance? Our dedicated support team is ready to help you 
            with any inquiries about our platform or services.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          >
            <a 
              href="mailto:support@artisanapp.com" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
            >
              <Mail className="h-5 w-5" />
              Email Support
            </a>
            <a 
              href="#live-chat" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5" />
              Live Chat
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}