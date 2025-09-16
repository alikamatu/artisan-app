// "use client";

// import { motion, AnimatePresence } from 'framer-motion';
// import { useState } from 'react';
// import { 
//   ChevronDown, 
//   HelpCircle, 
//   ShieldCheck, 
//   CreditCard, 
//   UserCheck, 
//   Calendar, 
//   DollarSign, 
//   MessageSquare,
//   Star,
//   X,
//   Search
// } from 'lucide-react';

// export default function FAQSection() {
//   type CategoryId = 'all' | 'account' | 'booking' | 'payments' | 'safety' | 'workers';
//   const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

//   const categories = [
//     { id: 'all', name: 'All Questions' },
//     { id: 'account', name: 'Account' },
//     { id: 'booking', name: 'Booking' },
//     { id: 'payments', name: 'Payments' },
//     { id: 'safety', name: 'Safety' },
//     { id: 'workers', name: 'For Workers' }
//   ];

//   const faqs = [
//     {
//       question: "How do I book a service?",
//       answer: "Booking is simple: 1) Search for the service you need 2) Browse qualified professionals 3) Select your preferred worker 4) Choose a date/time 5) Confirm and pay securely. Our platform guides you through each step.",
//       category: 'booking',
//       icon: Calendar
//     },
//     {
//       question: "Is my payment information secure?",
//       answer: "Absolutely. We use bank-grade encryption and never store your full payment details. All transactions are processed through PCI-compliant payment gateways. Funds are held securely in escrow until your job is completed to your satisfaction.",
//       category: 'payments',
//       icon: CreditCard
//     },
//     {
//       question: "How are workers verified?",
//       answer: "All professionals undergo a 4-step verification: 1) Government ID check 2) Background screening (optional) 3) Skill certification validation 4) Reference checks. Only 15% of applicants pass our strict verification process.",
//       category: 'safety',
//       icon: ShieldCheck
//     },
//     {
//       question: "What if I need to cancel or reschedule?",
//       answer: "You can cancel or reschedule up to 24 hours before your appointment at no charge. For cancellations within 24 hours, a small fee may apply. Rescheduling is always free when done at least 4 hours before the appointment time.",
//       category: 'booking',
//       icon: Calendar
//     },
//     {
//       question: "How does the pricing work?",
//       answer: "Pricing varies by service and professional. You'll see either: 1) Hourly rates 2) Fixed project prices 3) Package deals. All prices are transparent with no hidden fees. You'll see the total cost before booking.",
//       category: 'payments',
//       icon: DollarSign
//     },
//     {
//       question: "What if I'm not satisfied with the work?",
//       answer: "We offer a 100% satisfaction guarantee. If you're not happy with the work: 1) Report the issue within 72 hours 2) We'll mediate with the professional 3) If unresolved, we'll arrange a redo with another worker or issue a full refund.",
//       category: 'safety',
//       icon: ShieldCheck
//     },
//     {
//       question: "How do I become a verified worker?",
//       answer: "Apply through our worker portal: 1) Create your profile 2) Submit required documents 3) Complete skill assessment 4) Pass background check 5) Get approved (takes 1-3 business days). Verified workers earn 42% more on average.",
//       category: 'workers',
//       icon: UserCheck
//     },
//     {
//       question: "How are workers rated?",
//       answer: "After each completed job, clients rate workers on: 1) Quality of work 2) Professionalism 3) Timeliness 4) Communication. Workers with consistent high ratings appear higher in search results and earn special badges.",
//       category: 'workers',
//       icon: Star
//     },
//     {
//       question: "Can I communicate directly with the worker?",
//       answer: "Yes, our platform includes a secure messaging system. Once you've booked a service, you can: 1) Message directly in the app 2) Share photos/files 3) Get real-time updates. All communication is recorded for safety and quality assurance.",
//       category: 'account',
//       icon: MessageSquare
//     },
//     {
//       question: "What payment methods do you accept?",
//       answer: "We accept all major payment methods: Credit/Debit Cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and Bank Transfers. All payments are protected through our escrow system until job completion.",
//       category: 'payments',
//       icon: CreditCard
//     },
//     {
//       question: "How quickly can I get a worker?",
//       answer: "For urgent requests: 80% of bookings are fulfilled within 4 hours. Standard bookings: Most workers respond within 1 hour. Our 24-hour matching guarantee ensures you'll find a qualified professional within a day.",
//       category: 'booking',
//       icon: Calendar
//     },
//     {
//       question: "Are there any hidden fees?",
//       answer: "No hidden fees. You'll always see the total cost before booking. The price breakdown includes: 1) Professional's service fee 2) Materials (if applicable) 3) Small platform fee (5-15%) that covers payment processing, insurance, and support.",
//       category: 'payments',
//       icon: DollarSign
//     }
//   ];

// interface FAQItem {
//     question: string;
//     answer: string;
//     category: Exclude<CategoryId, 'all'>;
//     icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
// }

// interface Category {
//     id: CategoryId;
//     name: string;
// }

// const toggleExpand = (index: number) => {
//     setExpandedIndex(expandedIndex === index ? null : index);
// };

//   // Filter FAQs based on category and search term
//   const filteredFAQs = faqs.filter(faq => {
//     const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
//     const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });
//   const categoryIcons: Record<Exclude<CategoryId, 'all'>, React.ComponentType<any>> = {
//     account: UserCheck,
//     booking: Calendar,
//     payments: CreditCard,
//     safety: ShieldCheck,
//     workers: UserCheck
//   };

//   const CategoryIcon = activeCategory !== 'all' ? categoryIcons[activeCategory] : HelpCircle;

//   return (
//     <section className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
//       {/* Decorative elements */}
//       <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-0"></div>
//       <div className="absolute top-1/3 right-0 w-64 h-64 bg-purple-100 rounded-full blur-[120px] opacity-30"></div>
//       <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-indigo-100 rounded-full blur-[100px] opacity-20"></div>
      
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="text-center max-w-3xl mx-auto mb-16">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full mb-5"
//           >
//             <HelpCircle className="h-5 w-5" />
//             <p className="text-sm font-medium">SUPPORT CENTER</p>
//           </motion.div>
          
//           <motion.h2 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
//           >
//             Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Questions</span>
//           </motion.h2>
          
//           <motion.p 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             Find answers to common questions about our platform and services
//           </motion.p>
//         </div>

//         {/* Search and Categories */}
//         <div className="max-w-4xl mx-auto mb-12">
//           <div className="flex flex-col md:flex-row gap-6">
//             {/* Search Input */}
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder="Search questions..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-6 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               {searchTerm && (
//                 <button 
//                   onClick={() => setSearchTerm('')}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2"
//                 >
//                   <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                 </button>
//               )}
//             </div>
            
//             {/* Category Selector (Desktop) */}
//             <div className="hidden md:flex rounded-2xl bg-gray-100 p-1">
//               {categories.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() => setActiveCategory(category.id as CategoryId)}
//                   className={`px-4 py-2 rounded-xl flex items-center transition-all ${
//                     activeCategory === category.id
//                       ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
//                       : 'text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   <span className="font-medium">{category.name}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           {/* Category Selector (Mobile) */}
//           <div className="md:hidden mt-4">
//             <div className="flex overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
//               <div className="flex space-x-2">
//                 {categories.map((category) => (
//                   <button
//                     key={category.id}
//                     onClick={() => setActiveCategory( category.id as CategoryId)}
//                     className={`px-4 py-2 rounded-xl flex items-center transition-all ${
//                       activeCategory === category.id
//                         ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
//                         : 'bg-gray-200 text-gray-700'
//                     }`}
//                   >
//                     <span className="font-medium text-sm whitespace-nowrap">{category.name}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FAQ Content */}
//         <div className="max-w-4xl mx-auto">
//           {filteredFAQs.length > 0 ? (
//             <div className="space-y-4">
//               {filteredFAQs.map((faq, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
//                 >
//                   <button
//                     onClick={() => toggleExpand(index)}
//                     className="w-full flex items-center justify-between p-6 text-left"
//                   >
//                     <div className="flex items-start gap-4">
//                       <div className="bg-indigo-100 p-3 rounded-xl mt-1 flex-shrink-0">
//                         <faq.icon className="h-5 w-5 text-indigo-600" />
//                       </div>
//                       <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
//                     </div>
//                     <motion.div
//                       animate={{ rotate: expandedIndex === index ? 180 : 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <ChevronDown className="h-5 w-5 text-gray-500" />
//                     </motion.div>
//                   </button>
                  
//                   <AnimatePresence>
//                     {expandedIndex === index && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: 'auto', opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="overflow-hidden"
//                       >
//                         <div className="px-6 pb-6 ml-14 border-t border-gray-100 pt-4 text-gray-600">
//                           {faq.answer}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
//               <div className="mx-auto mb-6 bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center">
//                 <HelpCircle className="h-8 w-8 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">No questions found</h3>
//               <p className="text-gray-600 max-w-md mx-auto">
//                 We couldn't find any questions matching your search. Try different keywords or browse our categories.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Support CTA */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mt-16 max-w-4xl mx-auto"
//         >
//           <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
//             <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-500 rounded-full blur-[80px] opacity-10"></div>
            
//             <div className="relative z-10">
//               <div className="flex flex-col lg:flex-row gap-10">
//                 <div className="lg:w-1/2">
//                   <div className="flex items-center mb-6">
//                     <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-xl">
//                       <MessageSquare className="h-8 w-8 text-indigo-600" />
//                     </div>
//                     <div className="ml-4">
//                       <h3 className="text-2xl font-bold text-gray-900">Still have questions?</h3>
//                       <p className="text-gray-600">Our support team is ready to help</p>
//                     </div>
//                   </div>
                  
//                   <p className="text-gray-600 mb-6">
//                     Can't find what you're looking for? Contact our support team directly for personalized assistance. We're available 24/7 to answer your questions.
//                   </p>
                  
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
//                       <div className="bg-indigo-100 p-2 rounded-lg">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Email us at</p>
//                         <p className="font-medium text-gray-900">support@skilledworkers.com</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
//                       <div className="bg-indigo-100 p-2 rounded-lg">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Call us at</p>
//                         <p className="font-medium text-gray-900">(888) 555-0123</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="lg:w-1/2">
//                   <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 h-full border border-indigo-100">
//                     <h4 className="text-lg font-bold text-gray-900 mb-4">Live Chat Support</h4>
//                     <p className="text-gray-600 mb-6">
//                       Get instant answers from our support team. Available 24/7 for immediate assistance.
//                     </p>
                    
//                     <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
//                       <div className="flex items-center gap-4 mb-4">
//                         <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
//                         <div>
//                           <p className="font-medium text-gray-900">Support Team</p>
//                           <p className="text-sm text-gray-500">Online now</p>
//                         </div>
//                       </div>
                      
//                       <div className="bg-gray-100 rounded-lg p-4 mb-4">
//                         <p className="text-gray-700">Hi there! How can I help you today?</p>
//                       </div>
                      
//                       <div className="flex">
//                         <input 
//                           type="text" 
//                           placeholder="Type your message..." 
//                           className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                         <button className="px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-r-lg">
//                           Send
//                         </button>
//                       </div>
//                     </div>
                    
//                     <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
//                       Start Live Chat
//                     </button>
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

export default function FAQSection() {
  return <main>Welcome</main>;
}