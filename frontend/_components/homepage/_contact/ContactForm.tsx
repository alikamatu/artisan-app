"use client";

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactForm() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-[0.03]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              background: `radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(0,0,0,0) 70%)`,
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
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 relative z-10"
        >
          <motion.div 
            className="inline-block bg-indigo-100 px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-medium text-indigo-700 tracking-wider">WE'RE HERE TO HELP</p>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Touch</span> With Us
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Have questions or need assistance? Our team is ready to help you with any inquiries. Reach out to us through any of these channels.
          </p>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Phone className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1">Call Us</h3>
                  <p className="text-gray-600">+1 (800) 123-4567</p>
                  <Link href="tel:+18001234567" className="text-indigo-600 text-sm font-medium mt-2 inline-block">
                    Call now
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1">Email Us</h3>
                  <p className="text-gray-600">support@skilledworkers.com</p>
                  <Link href="mailto:support@skilledworkers.com" className="text-indigo-600 text-sm font-medium mt-2 inline-block">
                    Send email
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all md:col-span-2"
            >
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1">Visit Us</h3>
                  <p className="text-gray-600">123 Innovation Way, San Francisco, CA 94107</p>
                  <Link href="https://maps.google.com" target="_blank" className="text-indigo-600 text-sm font-medium mt-2 inline-block">
                    Get directions
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Social Media */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect with us</h3>
            <div className="flex justify-center lg:justify-start gap-4">
              {[
                { name: 'Twitter', color: 'text-blue-400' },
                { name: 'Facebook', color: 'text-blue-600' },
                { name: 'Instagram', color: 'text-pink-500' },
                { name: 'LinkedIn', color: 'text-blue-700' },
              ].map((platform, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-all"
                >
                  <div className={`${platform.color} font-medium text-sm`}>
                    {platform.name.charAt(0)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 w-full max-w-lg"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-900 mb-6"
            >
              Send us a message
            </motion.h2>
            
            <form className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Smith"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="john@example.com"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a subject</option>
                  <option value="support">Support Request</option>
                  <option value="billing">Billing Inquiry</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback/Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="How can we help you?"
                ></textarea>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Send className="h-5 w-5" />
                Send Message
              </motion.button>
            </form>
            
            <motion.p 
              className="text-center text-gray-500 text-sm mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              We'll respond to your message within 24 hours
            </motion.p>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Support */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:block"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="bg-white border border-gray-200 rounded-full px-6 py-3 shadow-lg">
          <p className="text-gray-700 text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live chat support available now</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
};
