"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Box, Avatar, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const backgrounds = [
  '/signup/2147842924.jpg',
  '/signup/2147842924.jpg',
  '/signup/2147842924.jpg',
];

const testimonials = [
  {
    quote: 'This platform changed my life! Highly recommend.',
    name: 'John Doe',
    avatar: '/signup/2147842924.jpg',
  },
  {
    quote: 'Amazing user experience and great support.',
    name: 'Jane Smith',
    avatar: '/signup/2147842924.jpg',
  },
  {
    quote: 'The best sign-up process I\'ve ever seen.',
    name: 'Alex Johnson',
    avatar: '/signup/2147842924.jpg',
  },
];

export default function TestimonialsSection() {
  const [currentBg, setCurrentBg] = useState(0);
  const [currentTest, setCurrentTest] = useState(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    const testInterval = setInterval(() => {
      setCurrentTest((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(bgInterval);
      clearInterval(testInterval);
    };
  }, []);

  const handlePrev = () => setCurrentTest((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const handleNext = () => setCurrentTest((prev) => (prev + 1) % testimonials.length);

  return (
    <Box className="relative w-full h-full min-h-[400px]">
      <AnimatePresence>
        <motion.div
          key={currentBg}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
      <Box className="absolute inset-0 bg-black/30" />
      <Box className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-lg p-6 bg-white/80 rounded-xl shadow-lg backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTest}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <Typography variant="body1" className="italic mb-4">
              "{testimonials[currentTest].quote}"
            </Typography>
            <Box className="flex items-center">
              <Avatar src={testimonials[currentTest].avatar} className="mr-2" />
              <Typography variant="subtitle1" className="font-semibold">
                {testimonials[currentTest].name}
              </Typography>
            </Box>
          </motion.div>
        </AnimatePresence>
        <Box className="flex justify-between mt-4">
          <IconButton onClick={handlePrev} size="small">
            <ArrowBackIosIcon />
          </IconButton>
          <Box className="flex space-x-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentTest ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
            ))}
          </Box>
          <IconButton onClick={handleNext} size="small">
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}