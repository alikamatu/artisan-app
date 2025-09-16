"use client";

import { motion } from 'framer-motion';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  CheckCircle,
  User,
  HardHat,
  Home,
  ClipboardCheck,
  TrendingUp
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  const touchStartRef = useRef(0);

  const testimonials = [
    {
      name: "Michael Rodriguez",
      role: "Homeowner, Austin TX",
      rating: 5,
      quote: "After struggling for weeks to find a reliable plumber, I found John on this platform. He arrived on time, fixed our leak in under an hour, and charged half what others quoted. The payment protection gave me peace of mind!",
      result: "Saved $320 and 3 weeks of frustration",
      before: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Sarah Johnson",
      role: "Restaurant Owner, Chicago IL",
      rating: 5,
      quote: "Our HVAC system failed during a heatwave. I found a certified technician on the platform who came within 2 hours and had us back in business same day. The review system helped me choose the perfect professional.",
      result: "Prevented $8,000 in food spoilage",
      before: "https://images.unsplash.com/photo-1589923186200-85b53d387bb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      after: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "David Kim",
      role: "Software Engineer, Seattle WA",
      rating: 5,
      quote: "As a busy professional, I don't have time to vet contractors. This platform matched me with an amazing electrician who rewired my home office in a day. The escrow payment system made everything so easy.",
      result: "Completed project 3 days ahead of schedule",
      before: "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      after: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  const successStories = [
    {
      name: "James Wilson",
      role: "Electrician",
      location: "Miami, FL",
      rating: 4.9,
      jobs: 142,
      story: "Since joining the platform, I've tripled my income while working fewer hours. The job matching system brings me clients who value my expertise, and the payment system ensures I get paid on time, every time.",
      earnings: "+$42,000 annual income increase",
      before: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      after: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Maria Garcia",
      role: "Plumbing Specialist",
      location: "San Diego, CA",
      rating: 4.95,
      jobs: 217,
      story: "As a female tradesperson, I struggled to get recognized. This platform verified my credentials and helped me build a reputation. Now I have a 98% repeat client rate and have hired two apprentices to keep up with demand.",
      earnings: "Expanded to 3-person team",
      before: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      after: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Touch handlers for mobile carousel
  const handleTouchStart = (e: any) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: any) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    
    if (diff > 50) {
      nextTestimonial();
    } else if (diff < -50) {
      prevTestimonial();
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`h-4 w-4 md:h-5 md:w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative py-16 md:py-24 w-full overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div className="absolute top-1/3 right-0 w-48 h-48 md:w-64 md:h-64 bg-amber-100 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-1/4 left-0 w-32 h-32 md:w-48 md:h-48 bg-indigo-100 rounded-full blur-[100px] opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="inline-flex items-center justify-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 md:px-5 md:py-2.5 rounded-full mb-4 md:mb-5"
          >
            <Quote className="h-4 w-4 md:h-5 md:w-5" />
            <p className="text-xs md:text-sm font-medium">REAL RESULTS</p>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6"
          >
            Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Lives</span> & Properties
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Don't just take our word for it - hear from clients and workers who've found success
          </motion.p>
        </div>

        {/* Client Testimonials Carousel - Mobile First Design */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-24">
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-1 border border-gray-100">
            <div className="bg-white rounded-xl overflow-hidden">
              <div 
                className="relative h-auto md:h-[500px] overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                ref={carouselRef}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: index === currentIndex ? 1 : 0,
                      x: index === currentIndex ? 0 : index > currentIndex ? 100 : -100
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-10 ${index === currentIndex ? 'z-10' : 'z-0'}`}
                  >
                    {/* Before/After Visual */}
                    <div className="w-full lg:w-1/2">
                      <div className="relative">
                        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white px-2 py-1 md:px-3 md:py-1 rounded-full shadow-md z-10">
                          <span className="text-xs font-bold text-gray-700">BEFORE</span>
                        </div>
                        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                          <img 
                            src={testimonial.before} 
                            alt="Before" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-white px-2 py-1 md:px-3 md:py-1 rounded-full shadow-md z-10">
                          <span className="text-xs font-bold text-gray-700">AFTER</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-2/3 h-4/5 border-4 border-white rounded-xl shadow-lg overflow-hidden">
                          <img 
                            src={testimonial.after} 
                            alt="After" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Testimonial Content */}
                    <div className="w-full lg:w-1/2">
                      <div className="flex items-center mb-4 md:mb-6">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 md:w-16 md:h-16" />
                        <div className="ml-3 md:ml-4">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900">{testimonial.name}</h3>
                          <p className="text-sm md:text-base text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4 md:mb-6">
                        <StarRating rating={testimonial.rating} />
                      </div>
                      
                      <blockquote className="text-base md:text-lg lg:text-xl italic text-gray-700 mb-4 md:mb-6 relative">
                        <Quote className="absolute -top-4 -left-2 h-8 w-8 md:h-10 md:w-10 text-amber-100 opacity-70" />
                        {testimonial.quote}
                      </blockquote>
                      
                      <div className="flex items-center gap-3 p-3 md:p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-600 flex-shrink-0" />
                        <p className="font-medium text-gray-800 text-sm md:text-base">{testimonial.result}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Carousel Controls */}
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex gap-2 z-20">
                <button 
                  onClick={prevTestimonial}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
                </button>
              </div>
              
              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${index === currentIndex ? 'bg-amber-500' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Worker Success Stories - Responsive Grid */}
        <div className="max-w-6xl mx-auto mb-12 md:mb-16">
          <div className="text-center mb-8 md:mb-12">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center justify-center"
            >
              <HardHat className="h-6 w-6 md:h-8 md:w-8 text-indigo-600 mr-2 md:mr-3" />
              Worker Success Stories
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              How skilled professionals are transforming their businesses with our platform
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="p-5 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row gap-6 md:gap-8">
                    <div className="sm:w-1/3">
                      <div className="relative">
                        <div className="aspect-square rounded-xl shadow-md overflow-hidden">
                          <img 
                            src={story.before} 
                            alt={story.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-3 -right-3 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-gray-200">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 font-bold text-gray-900 text-sm md:text-base">{story.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 md:mt-8">
                        <h4 className="text-base md:text-lg font-bold text-gray-900">{story.name}</h4>
                        <p className="text-gray-600 text-sm md:text-base">{story.role} • {story.location}</p>
                        <div className="mt-2 md:mt-3 flex items-center gap-2 bg-indigo-50 px-2 py-1 md:px-3 md:py-1.5 rounded-full">
                          <ClipboardCheck className="h-3 w-3 md:h-4 md:w-4 text-indigo-600" />
                          <span className="text-xs md:text-sm font-medium text-indigo-700">{story.jobs} jobs completed</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:w-2/3">
                      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <Home className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
                        <h4 className="text-base md:text-lg font-bold text-gray-900">Business Transformation</h4>
                      </div>
                      
                      <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">{story.story}</p>
                      
                      <div className="flex items-center gap-3 p-3 md:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-emerald-100">
                        <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                        <p className="font-medium text-gray-800 text-sm md:text-base">{story.earnings}</p>
                      </div>
                      
                      <div className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 md:w-16 md:h-16" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="text-xs md:text-sm text-gray-500">See full case study</p>
                    <button className="flex items-center text-indigo-600 font-medium text-sm md:text-base">
                      View details <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Responsive CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 sm:p-6 md:p-8 lg:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/homepage/grid-pattern.svg')] bg-[length:60px_60px] opacity-10"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-[120px] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="lg:w-2/3 text-center lg:text-left">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6"
                >
                  Ready to Transform Your Property or Business?
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="text-indigo-200 text-base md:text-lg mb-6 md:mb-8"
                >
                  Join thousands of satisfied clients and skilled professionals finding success together
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                >
                  <button className="px-5 py-2.5 md:px-6 md:py-3.5 bg-white text-indigo-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center justify-center text-sm md:text-base">
                    Find a Professional
                  </button>
                  <button className="px-5 py-2.5 md:px-6 md:py-3.5 bg-indigo-800 text-white font-semibold rounded-full hover:bg-indigo-900 transition-all duration-300 flex items-center justify-center text-sm md:text-base">
                    Join as Worker
                  </button>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="lg:w-1/3 flex justify-center mt-6 lg:mt-0"
              >
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl">
                    <User className="h-10 w-10 md:h-14 md:w-14 text-white" />
                  </div>
                  <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 bg-white px-2 py-1 md:px-3 md:py-2 rounded-full shadow-lg text-xs md:text-sm">
                    <span className="font-bold text-indigo-600">25,000+</span>
                    <span className="text-gray-600 ml-1">Reviews</span>
                  </div>
                  <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-white px-2 py-1 md:px-3 md:py-2 rounded-full shadow-lg text-xs md:text-sm">
                    <span className="font-bold text-indigo-600">4.8</span>
                    <span className="text-gray-600 ml-1">Avg Rating</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}