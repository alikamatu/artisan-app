"use client";

import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  BadgeCheck, 
  Fingerprint, 
  FileText, 
  Award,
  Star,
  UserCheck,
  Lock,
  ClipboardCheck,
  Zap
} from 'lucide-react';

export default function TrustVerification() {
  const verificationFeatures = [
    {
      icon: Fingerprint,
      title: "Identity Verification",
      description: "Mandatory government ID verification for all workers",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: FileText,
      title: "Background Checks",
      description: "Optional criminal background checks available for all professionals",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: ClipboardCheck,
      title: "Skill Certification",
      description: "Trade-specific competency testing and certification validation",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: UserCheck,
      title: "Reference Validation",
      description: "Direct contact with previous clients for work verification",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: "Verified Worker",
      description: "Completed identity verification and basic background check",
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
      icon: Award,
      title: "Top Performer",
      description: "Maintained 4.8+ rating with 50+ completed jobs",
      color: "bg-amber-100 text-amber-800 border-amber-200"
    },
    {
      icon: Zap,
      title: "Quick Responder",
      description: "Consistently responds to requests within 30 minutes",
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      icon: Star,
      title: "Elite Professional",
      description: "Highest level certification with 100+ jobs and 4.9+ rating",
      color: "bg-rose-100 text-rose-800 border-rose-200"
    }
  ];

  const safetyMeasures = [
    { 
      icon: Lock, 
      title: "Secure Payments", 
      description: "Escrow protection ensures funds are only released when you're satisfied" 
    },
    { 
      icon: ShieldCheck, 
      title: "Insurance Coverage", 
      description: "Up to $1M in property damage protection for all jobs" 
    },
    { 
      icon: UserCheck, 
      title: "Profile Transparency", 
      description: "Full access to worker credentials, reviews, and portfolio" 
    },
    { 
      icon: BadgeCheck, 
      title: "Continuous Monitoring", 
      description: "Ongoing verification to maintain badge status and platform standards" 
    }
  ];

  return (
    <section className="relative py-24 w-full overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-100 rounded-full blur-[150px] opacity-30"></div>
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-blue-100 rounded-full blur-[120px] opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full mb-5"
          >
            <ShieldCheck className="h-5 w-5" />
            <p className="text-sm font-medium">TRUST & SAFETY</p>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Trust</span> Through Verification
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Our comprehensive verification process ensures you only connect with qualified, trustworthy professionals
          </motion.p>
        </div>

        {/* Verification Process */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Verification Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <BadgeCheck className="h-8 w-8 text-indigo-600 mr-3" />
                Our Verification Process
              </h3>
              
              <div className="space-y-6">
                {verificationFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                    <div className="ml-auto flex-shrink-0 bg-gray-100 text-gray-700 font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100"
              >
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-indigo-600" />
                  </div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-bold">Result:</span> Only 15% of applicants pass our comprehensive verification process to become platform professionals
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Trust Badges */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Award className="h-8 w-8 text-amber-600 mr-3" />
                Trust Badges & Recognition
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {trustBadges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg ${badge.color.split(' ')[0]}`}>
                        <badge.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-lg font-bold ml-3">{badge.title}</h4>
                    </div>
                    <p className="text-gray-600 mb-4">{badge.description}</p>
                    <div className={`text-xs font-medium px-3 py-1 rounded-full inline-block ${badge.color}`}>
                      EARNED BY TOP 7% OF WORKERS
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200"
              >
                <div className="flex">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-lg flex-shrink-0">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Verified Workers Deliver Better Results</h4>
                    <p className="text-gray-700">
                      Jobs completed by verified badge holders have 63% higher satisfaction ratings and 42% fewer disputes.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Safety Measures */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-12">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
            >
              Comprehensive Safety Measures
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              We go beyond verification to ensure every interaction is safe and secure
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyMeasures.map((measure, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className={`bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                  <measure.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{measure.title}</h4>
                <p className="text-gray-600">{measure.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Verification CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/homepage/grid-pattern.svg')] bg-[length:60px_60px] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[120px] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="lg:w-2/3">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-6"
                >
                  Ready to Build Trust with Clients?
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-lg text-indigo-200 mb-8"
                >
                  Get verified and showcase your credentials to attract more clients and higher-paying jobs.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button className="px-6 py-3.5 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center justify-center">
                    Apply for Verification
                  </button>
                  <button className="px-6 py-3.5 bg-indigo-800 text-white font-semibold rounded-full hover:bg-indigo-900 transition-all duration-300 flex items-center justify-center">
                    Learn More
                  </button>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:w-1/3 flex justify-center"
              >
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl">
                    <ShieldCheck className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                    <span className="font-bold text-indigo-600">98%</span>
                    <span className="text-gray-600 ml-1">Approval</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full shadow-lg">
                    <span className="font-bold text-indigo-600">24h</span>
                    <span className="text-gray-600 ml-1">Avg. Process</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">98%</div>
                <p className="text-gray-700 font-medium">Client Satisfaction with Verified Workers</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">63%</div>
                <p className="text-gray-700 font-medium">Higher Earnings for Verified Professionals</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">0.02%</div>
                <p className="text-gray-700 font-medium">Dispute Rate for Verified Jobs</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}