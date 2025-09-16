"use client";

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@artisanapp.com",
      description: "We typically reply within 24 hours",
      action: "Send Message",
      delay: 0.1,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 5pm EST",
      action: "Call Now",
      delay: 0.2,
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Innovation Street",
      description: "San Francisco, CA 94107",
      action: "Get Directions",
      delay: 0.3,
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              background: `radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(0,0,0,0) 70%)`,
            }}
            animate={{
              y: [0, Math.random() * 50 - 25],
              x: [0, Math.random() * 50 - 25],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 relative z-10"
        >
          <motion.div 
            className="inline-flex items-center bg-indigo-100 px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Zap className="h-5 w-5 text-indigo-700 mr-2" />
            <p className="text-sm font-medium text-indigo-700 tracking-wider">FAST RESPONSE GUARANTEE</p>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            We're Here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Help</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Connect with our team for support, partnerships, or any questions about our artisan platform. 
            We're committed to providing exceptional service.
          </p>
          
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="#contact-form"
              className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Send a Message
            </Link>
          </motion.div>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 relative"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + method.delay }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col h-full">
                <div className={`bg-gradient-to-r ${method.color} p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4`}>
                  <method.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-900 text-lg font-medium mb-1">{method.details}</p>
                <p className="text-gray-600 mb-4">{method.description}</p>
                
                <div className="mt-auto">
                  <Link 
                    href="#" 
                    className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                  >
                    {method.action}
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Floating Contact Badge */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="bg-white border border-gray-200 rounded-full px-6 py-3 shadow-lg">
          <p className="text-gray-700 text-sm font-medium">
            Average response time: <span className="font-bold text-indigo-600">Under 2 hours</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}