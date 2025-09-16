"use client";

import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  MessageCircle,
  Zap,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br w-full from-gray-900 to-gray-950 text-gray-300 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white ml-3">SkillConnect</h2>
              </div>
              <p className="mb-6 max-w-xs">
                Connecting skilled professionals with clients who value quality workmanship and reliable service.
              </p>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-purple-400" />
                <span className="text-sm">Verified Professionals Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                <span className="text-sm">24-Hour Matching</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Subscribe to our newsletter</h3>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-3 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                />
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 rounded-r-lg hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>
              <p className="text-xs mt-2 text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">For Clients</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/find-professionals" className="hover:text-white transition-colors">Find Professionals</Link>
                  </li>
                  <li>
                    <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                  </li>
                  <li>
                    <Link href="/success-stories" className="hover:text-white transition-colors">Success Stories</Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">For Workers</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/become-a-pro" className="hover:text-white transition-colors">Become a Pro</Link>
                  </li>
                  <li>
                    <Link href="/worker-dashboard" className="hover:text-white transition-colors">Worker Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/pricing-workers" className="hover:text-white transition-colors">Earnings Calculator</Link>
                  </li>
                  <li>
                    <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
                  </li>
                  <li>
                    <Link href="/community" className="hover:text-white transition-colors">Community</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Service Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">Service Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-3">
                <li>
                  <Link href="/plumbing" className="hover:text-white transition-colors">Plumbing</Link>
                </li>
                <li>
                  <Link href="/electrical" className="hover:text-white transition-colors">Electrical</Link>
                </li>
                <li>
                  <Link href="/cleaning" className="hover:text-white transition-colors">Cleaning</Link>
                </li>
                <li>
                  <Link href="/handyman" className="hover:text-white transition-colors">Handyman</Link>
                </li>
                <li>
                  <Link href="/painting" className="hover:text-white transition-colors">Painting</Link>
                </li>
              </ul>
              
              <ul className="space-y-3">
                <li>
                  <Link href="/tutoring" className="hover:text-white transition-colors">Tutoring</Link>
                </li>
                <li>
                  <Link href="/landscaping" className="hover:text-white transition-colors">Landscaping</Link>
                </li>
                <li>
                  <Link href="/tech-support" className="hover:text-white transition-colors">Tech Support</Link>
                </li>
                <li>
                  <Link href="/wellness" className="hover:text-white transition-colors">Wellness</Link>
                </li>
                <li>
                  <Link href="/all-services" className="hover:text-white transition-colors">View All</Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">Contact Us</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-purple-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Email us at</p>
                  <p className="text-white">support@skillconnect.com</p>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-purple-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Call us at</p>
                  <p className="text-white">(888) 555-0123</p>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-purple-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Visit us at</p>
                  <p className="text-white">123 Innovation Drive, Suite 100<br />San Francisco, CA 94107</p>
                </div>
              </li>
            </ul>
            
            <h4 className="text-sm font-semibold text-gray-400 mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <motion.a 
                href="https://facebook.com" 
                target="_blank"
                whileHover={{ y: -3 }}
                className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank"
                whileHover={{ y: -3 }}
                className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank"
                whileHover={{ y: -3 }}
                className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank"
                whileHover={{ y: -3 }}
                className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank"
                whileHover={{ y: -3 }}
                className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-800 my-10"></div>
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm">
            © {currentYear} SkillConnect. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-sm hover:text-white transition-colors">Cookie Policy</Link>
            <Link href="/sitemap" className="text-sm hover:text-white transition-colors">Sitemap</Link>
            <Link href="/accessibility" className="text-sm hover:text-white transition-colors">Accessibility</Link>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-800 px-3 py-1.5 rounded-full">
              <MessageCircle className="h-4 w-4 mr-2 text-purple-400" />
              <span className="text-sm">English</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Support Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
      >
        <button className="flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
          <MessageCircle className="h-5 w-5 mr-2" />
          <span>Support Chat</span>
        </button>
      </motion.div>
    </footer>
  );
}