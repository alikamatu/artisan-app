"use client";

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, Users, Briefcase, Star, Check, Zap, Award } from 'lucide-react';
import Link from 'next/link';

// Componentized UI elements for better maintainability
type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
};

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + delay, duration: 0.4 }}
    whileHover={{ y: -5 }}
  >
    <div className="flex items-start gap-3">
      <div className="bg-indigo-50 p-2 rounded-lg">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <div>
        <h4 className="text-gray-900 font-semibold">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </motion.div>
);

type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  delay: number;
};

const StatCard = ({ icon: Icon, value, label, delay }: StatCardProps) => (
  <motion.div
    key={label}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 + delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="bg-indigo-50 p-3 rounded-xl">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  </motion.div>
);

const BackgroundElements = () => (
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
);

export default function HeroPage() {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    });
  }, [controls]);

  const stats = [
    { icon: Users, value: '1M+', label: 'Skilled Workers' },
    { icon: Briefcase, value: '500K+', label: 'Jobs Completed' },
    { icon: Star, value: '4.8', label: 'Average Rating' },
  ];

  const features = [
    { icon: Check, title: 'Verified Professionals', description: 'All workers are background checked and certified' },
    { icon: Zap, title: '24-Hour Matching', description: 'Get matched with qualified workers in under 24 hours' },
    { icon: Award, title: 'Quality Guaranteed', description: 'We stand behind the quality of every job completed' },
  ];

  return (
    <section className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-b from-white via-indigo-50 to-white pt-6">
      <BackgroundElements />
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 relative z-10"
        >
          <motion.div 
            className="inline-block bg-indigo-100 px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-medium text-indigo-700 tracking-wider">TRUSTED BY 50,000+ BUSINESSES</p>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Trusted</span> Skilled Workers
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Find verified professionals for your projects with transparent pricing and secure payments in just 24 hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.span animate={{ x: isHovered ? 5 : 0 }}>
                  Get Started
                </motion.span>
                <motion.span 
                  animate={{ x: isHovered ? 10 : 0 }}
                  className="ml-2"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-300"
              >
                How It Works
              </Link>
            </motion.div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={controls}
          className="lg:w-1/2 relative"
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-3xl opacity-30 blur-xl"
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.2, 0.25, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Skilled worker in action"
                  width={600}
                  height={400}
                  className="object-cover w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="container px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard 
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
      
      {/* Floating Reviews */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div 
          className="bg-white border border-gray-200 rounded-full px-6 py-3 shadow-lg"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-gray-700 text-sm font-medium flex items-center gap-2">
            <span className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </span>
            <span>4.8 from 25,000+ reviews</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}