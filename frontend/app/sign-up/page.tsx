"use client";

import { useState } from 'react';
import { Alert, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SignUpForm from '@/_components/signup/SignUpForm';
import TestimonialCarousel from '@/_components/signup/TestimonialCarousel';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
    const searchParams = useSearchParams();
    const [isResending, setIsResending] = useState(false);
    const [showResendSuccess, setShowResendSuccess] = useState(false);

  const handleSignUpSuccess = (email: string) => {
    setVerificationEmail(email);
    setShowSuccess(true);
  };

    const handleResendEmail = async () => {
    const email = searchParams.get('email') || prompt('Please enter your email address:');
    if (!email) return;

    setIsResending(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
      const response = await fetch(`${apiUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setShowResendSuccess(true);
        setTimeout(() => setShowResendSuccess(false), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send email');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email';
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column - Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-600 mt-2">
              Join thousands of satisfied users today
            </p>
          </div>
          
          <SignUpForm onSuccess={handleSignUpSuccess} />
          
          {/* Verification Notice */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                key="verification-notice"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <Alert severity="success" className="rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">Account created successfully!</span>
                    <span className="text-sm mt-1">
                      Please check your email at <span className="font-semibold">{verificationEmail}</span> to verify your account.
                    </span>
                    <span className="text-xs mt-2">
                      Didn&apos;t receive the email? Check your spam folder or
                      <button onClick={handleResendEmail} className="text-blue-600 hover:underline ml-1">
                        resend verification
                      </button>
                    </span>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column - Testimonial Carousel */}
      <div className="w-full md:w-1/2 relative bg-gray-900 min-h-[50vh] md:min-h-screen">
        <TestimonialCarousel />
      </div>
    </div>
  );
}