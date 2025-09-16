"use client";

import Link from "next/link";
import { User, Menu, X, Search, Zap, Briefcase, Home, MessageCircle, Star, ChevronDown, Bell, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/services", label: "Services", icon: Briefcase },
    { href: "/how-it-works", label: "How It Works", icon: Zap },
    { href: "/contact", label: "Contact", icon: MessageCircle },
  ];

  const serviceCategories = [
    "Plumbing", "Electrical", "Cleaning", "Handyman", 
    "Tutoring", "Landscaping", "Tech Support", "Wellness"
  ];

  const profileMenu = [
    { label: "My Profile", icon: User, href: "/profile" },
    { label: "Notifications", icon: Bell, href: "/notifications" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Logout", icon: null, href: "/logout" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 w-full"
    >
      <div 
        className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled 
            ? "py-0 bg-white/95 backdrop-blur-md shadow-sm" 
            : "py-2"
        }`}
      >
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 z-50"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SkillConnect
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <ul className="flex space-x-1">
              {navLinks.map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={link.href}
                    className="relative text-gray-700 font-medium text-base px-4 py-2 rounded-xl transition-all duration-300 hover:text-indigo-600 flex items-center group"
                  >
                    <link.icon className="h-4 w-4 mr-2 text-gray-500 group-hover:text-indigo-500 transition-colors" />
                    {link.label}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right Actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSearch}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/sign-in")}
              className="px-4 cursor-pointer py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Sign In
            </motion.button>
            
            <motion.div
              className="ml-2 relative"
              ref={profileRef}
            >
              {/* <button 
                onClick={toggleProfileMenu}
                className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <div className="bg-gray-200 p-1.5 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button> */}
              
              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Alex Morgan</p>
                        <p className="text-sm text-gray-500">Professional Member</p>
                      </div>
                    </div>
                    <ul>
                      {profileMenu.map((item, index) => (
                        <motion.li 
                          key={index}
                          whileHover={{ backgroundColor: "#f9fafb" }}
                        >
                          <Link 
                            href={item.href} 
                            className={`flex items-center px-4 py-3 text-gray-700 hover:text-indigo-600 ${
                              item.label === "Logout" ? "border-t border-gray-100 text-red-500 hover:text-red-600" : ""
                            }`}
                          >
                            {item.icon && <item.icon className="h-5 w-5 mr-3 text-gray-400" />}
                            {item.label}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleSearch}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              aria-label="Toggle Menu"
              className="text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-100 shadow-sm"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="What service do you need today?"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                
                {searchValue && (
                  <button 
                    onClick={() => setSearchValue("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                  </button>
                )}
              </div>
              
              {/* Search Suggestions */}
              {searchValue && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {serviceCategories
                    .filter(cat => 
                      cat.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((category, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer hover:shadow-sm"
                      >
                        <p className="text-gray-700 text-sm font-medium">{category}</p>
                      </motion.div>
                    ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-b border-gray-100 shadow-md"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <ul className="flex flex-col space-y-3">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      href={link.href}
                      onClick={toggleMenu}
                      className="flex items-center text-gray-700 font-medium text-lg px-4 py-3 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      <link.icon className="h-5 w-5 mr-3 text-indigo-500" />
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl text-center"
                    >
                      Sign In
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl text-center hover:bg-gray-200"
                    >
                      Sign Up
                    </motion.button>
                  </div>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}