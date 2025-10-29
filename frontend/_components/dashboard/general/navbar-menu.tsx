"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  MessageSquare, 
  User,
  Search,
  FileText,
  Users,
  Calendar,
  Wallet,
  Star,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const NavigationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { 
        icon: Home, 
        label: 'Dashboard', 
        path: '/dashboard',
        color: 'text-blue-500',
        description: 'Overview and analytics'
      },
      { 
        icon: Briefcase, 
        label: 'Browse Jobs', 
        path: '/dashboard/jobs',
        color: 'text-green-500',
        description: 'Find work opportunities'
      },
      { 
        icon: Search, 
        label: 'Find Workers', 
        path: '/dashboard/find-workers',
        color: 'text-orange-500',
        description: 'Hire professionals'
      },
      { 
        icon: MessageSquare, 
        label: 'Messages', 
        path: '/dashboard/messages',
        color: 'text-pink-500',
        description: 'Chat and communications'
      },
      { 
        icon: Wallet, 
        label: 'Payments', 
        path: '/dashboard/payments',
        color: 'text-emerald-500',
        description: 'Transactions and earnings'
      },
      { 
        icon: Calendar, 
        label: 'Schedule', 
        path: '/dashboard/schedule',
        color: 'text-amber-500',
        description: 'Manage your calendar'
      },
    ];

    if (user?.role === 'worker') {
      baseItems.splice(2, 0, {
        icon: FileText,
        label: 'My Applications',
        path: '/dashboard/applications',
        color: 'text-purple-500',
        description: 'Track your job applications'
      });
      baseItems.splice(3, 0, {
        icon: Star,
        label: 'My Reviews',
        path: '/dashboard/reviews',
        color: 'text-yellow-500',
        description: 'Client feedback and ratings'
      });
    } else {
      baseItems.splice(2, 0, {
        icon: Users,
        label: 'Applications',
        path: '/dashboard/jobs/applications',
        color: 'text-purple-500',
        description: 'Manage job applications'
      });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActivePath = (itemPath: string) => {
    if (itemPath === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-40">
      {/* Main Menu Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMenu}
        className={`
          relative w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center
          transition-all duration-300 ease-out border-2
          ${isOpen 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400' 
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:shadow-xl'
          }
        `}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'menu'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
        </AnimatePresence>

        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        )}

        {/* Pulsing animation when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-blue-400"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Navigation Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-16 right-0 mb-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 min-w-[320px] max-h-[70vh] overflow-y-auto">
              {/* Menu Header */}
              <div className="px-3 py-2 border-b border-gray-100 mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Quick Navigation</h3>
                <p className="text-xs text-gray-500">Jump to any section</p>
              </div>
              
              {/* Navigation Links */}
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  
                  return (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ 
                        x: 4,
                        backgroundColor: isActive ? '' : '#f8fafc'
                      }}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                        transition-all duration-200 ease-out group
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white shadow-sm' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <Icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-medium block">{item.label}</span>
                        <span className="text-xs text-gray-500">{item.description}</span>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Quick Actions Section */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation('/dashboard/profile')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-xl text-xs font-semibold hover:bg-green-600 transition-colors shadow-sm"
                  >
                    <User className="h-3.5 w-3.5" />
                    {user?.role === 'client' ? 'Find Help' : 'My Profile'}
                  </motion.button>
                </div>
              </div>

              {/* Current Location */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="px-1">
                  <p className="text-xs text-gray-500 mb-1">Currently viewing:</p>
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {navItems.find(item => isActivePath(item.path))?.label || 'Dashboard'}
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow pointer */}
            <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45 transform" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavigationMenu;