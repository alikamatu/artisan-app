// "use client";

// import { motion } from 'framer-motion';
// import { 
//   Search, 
//   Calendar, 
//   CreditCard, 
//   ShieldCheck,
//   MessageSquare,
//   Users,
//   ClipboardCheck,
//   TrendingUp,
//   Layout,
//   Award,
//   FileText
// } from 'lucide-react';

// export default function CoreFeatures() {
//   const features = [
//     {
//       icon: Search,
//       title: "Advanced Search & Discovery",
//       description: "Find the perfect worker with AI-powered recommendations based on skills, location, availability, and ratings.",
//       stats: "98% client satisfaction with matches",
//       color: "from-purple-500 to-indigo-500"
//     },
//     {
//       icon: Calendar,
//       title: "Smart Booking & Scheduling",
//       description: "Real-time availability tracking with calendar sync, job status updates, and automated reminders.",
//       stats: "Reduces scheduling time by 75%",
//       color: "from-blue-500 to-cyan-500"
//     },
//     {
//       icon: CreditCard,
//       title: "Secure Payment System",
//       description: "Escrow payment protection, multiple payment methods, and automated payouts with financial tracking.",
//       stats: "100% payment security guarantee",
//       color: "from-green-500 to-emerald-500"
//     },
//     {
//       icon: Star,
//       title: "Rating & Review System",
//       description: "Two-way reviews with photo verification, detailed feedback, and reputation management tools.",
//       stats: "4.8 average platform rating",
//       color: "from-amber-500 to-orange-500"
//     },
//     {
//       icon: ShieldCheck,
//       title: "Verification & Trust",
//       description: "Background checks, skill assessments, and certification validation for all professionals.",
//       stats: "25,000+ verified workers",
//       color: "from-rose-500 to-pink-500"
//     },
//     {
//       icon: MessageSquare,
//       title: "Integrated Communication",
//       description: "In-app messaging with file sharing, read receipts, and notification center for seamless coordination.",
//       stats: "87% faster project completion",
//       color: "from-indigo-500 to-blue-500"
//     }
//   ];

//   const stats = [
//     { icon: Users, value: "1M+", label: "Skilled Workers" },
//     { icon: ClipboardCheck, value: "500K+", label: "Jobs Completed" },
//     { icon: TrendingUp, value: "42%", label: "Earnings Increase" },
//     { icon: Award, value: "98%", label: "Satisfaction Rate" }
//   ];

//   return (
//     <section className="relative py-24 w-full overflow-hidden">
//       {/* Decorative elements */}
//       <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-0"></div>
//       <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-200 rounded-full blur-[150px] opacity-20"></div>
//       <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-blue-200 rounded-full blur-[120px] opacity-20"></div>
      
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="text-center max-w-3xl mx-auto mb-20">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full mb-5"
//           >
//             <Layout className="h-5 w-5" />
//             <p className="text-sm font-medium">PLATFORM FEATURES</p>
//           </motion.div>
          
//           <motion.h2 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
//           >
//             Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Succeed</span>
//           </motion.h2>
          
//           <motion.p 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             Our comprehensive platform combines powerful tools with intuitive design
//           </motion.p>
//         </div>

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ y: -10 }}
//               className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-indigo-100 transition-all group"
//             >
//               <div className="p-7">
//                 <div className="flex items-start mb-5">
//                   <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl`}>
//                     <feature.icon className="h-7 w-7 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 ml-4 mt-1">{feature.title}</h3>
//                 </div>
                
//                 <p className="text-gray-600 mb-6">{feature.description}</p>
                
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
//                   </div>
//                   <p className="ml-2 text-sm font-medium text-gray-700">{feature.stats}</p>
//                 </div>
//               </div>
              
//               <div className="px-7 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 group-hover:border-indigo-100 transition-colors">
//                 <div className="flex justify-between items-center">
//                   <p className="text-sm text-gray-500">Learn more</p>
//                   <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Stats Section */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mt-20 max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
//         >
//           <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/homepage/grid-pattern.svg')] bg-[length:60px_60px] opacity-10"></div>
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[120px] opacity-10"></div>
          
//           <div className="relative z-10">
//             <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
//               <div className="lg:w-1/2">
//                 <motion.div 
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6"
//                 >
//                   <FileText className="h-5 w-5 text-white" />
//                   <p className="text-sm font-medium text-white">PLATFORM IMPACT</p>
//                 </motion.div>
                
//                 <motion.h3 
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 0.1 }}
//                   className="text-2xl sm:text-3xl font-bold text-white mb-6"
//                 >
//                   Transforming the Skilled Labor Market
//                 </motion.h3>
                
//                 <motion.p 
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 0.2 }}
//                   className="text-lg text-indigo-200 mb-8"
//                 >
//                   Our platform delivers measurable results for both clients and workers through innovative technology and design.
//                 </motion.p>
                
//                 <motion.div 
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 0.3 }}
//                   className="flex"
//                 >
//                   <button className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center">
//                     See Case Studies
//                     <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </button>
//                 </motion.div>
//               </div>
              
//               <div className="lg:w-1/2 grid grid-cols-2 gap-6">
//                 {stats.map((stat, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.2 + index * 0.1 }}
//                     className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-colors"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="bg-white/20 p-3 rounded-xl">
//                         <stat.icon className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
//                         <p className="text-indigo-200">{stat.label}</p>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Testimonial */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mt-20 max-w-4xl mx-auto"
//         >
//           <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
//             <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-500 rounded-full blur-[80px] opacity-10"></div>
            
//             <div className="relative z-10">
//               <div className="flex flex-col md:flex-row items-start gap-8">
//                 <div className="md:w-1/3 flex flex-col items-center">
//                   <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24" />
//                   <h4 className="text-xl font-bold text-gray-900 mt-4">Sarah Johnson</h4>
//                   <p className="text-gray-600">Homeowner, Chicago</p>
//                   <div className="flex mt-2">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="md:w-2/3">
//                   <div className="text-3xl text-indigo-600 mb-2">❝</div>
//                   <p className="text-xl text-gray-700 italic mb-6">
//                     "This platform completely transformed how I find home service professionals. I found a certified electrician within 2 hours who fixed my wiring issue at half the price I expected. The payment protection gave me peace of mind, and the review system ensures I only work with top-rated professionals."
//                   </p>
//                   <div className="flex items-center gap-3">
//                     <div className="flex">
//                       <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
//                       <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 -ml-3" />
//                       <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 -ml-3" />
//                     </div>
//                     <p className="text-sm text-gray-500">Project photos from Sarah's electrical work</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// const Star = ({ className }: { className?: string }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
//     <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
//   </svg>
// );

export default function CoreFeatures() {
  return <main>Welcome</main>;
}