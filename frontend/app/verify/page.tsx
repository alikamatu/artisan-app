'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { CheckCircle, XCircle, LoaderCircle, Mail, ArrowRight, UserPlus } from 'lucide-react';

interface VerificationStatus {
  status: 'loading' | 'success' | 'error' | 'expired';
  message: string;
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verification, setVerification] = useState<VerificationStatus>({
    status: 'loading',
    message: 'Verifying your email...',
  });
  const [isResending, setIsResending] = useState(false);
  const [showResendSuccess, setShowResendSuccess] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');
    const message = searchParams.get('message');
    const token = searchParams.get('token');

    if (status) {
      handleStatusResponse(status, message);
      return;
    }

    if (token) {
      verifyToken(token);
    } else {
      setVerification({
        status: 'error',
        message: 'No verification token provided.',
      });
    }
  }, [searchParams]);

  const handleStatusResponse = (status: string, message: string | null) => {
    if (status === 'success') {
      setVerification({
        status: 'success',
        message: message || 'Your email has been verified successfully! You can now log in.',
      });
    } else if (status === 'error') {
      const errorMessage = message ? decodeURIComponent(message) : 'Verification failed';
      const isExpired = errorMessage.toLowerCase().includes('expired');

      setVerification({
        status: isExpired ? 'expired' : 'error',
        message: errorMessage,
      });
    }
  };

  const verifyToken = async (token: string) => {
    try {
      // Fixed URL construction - using correct backend route format
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
      const response = await fetch(`${apiUrl}/auth/verify/${token}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVerification({
          status: 'success',
          message: data.message || 'Your email has been verified successfully!',
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Verification failed';
        const isExpired = errorMessage.toLowerCase().includes('expired');

        setVerification({
          status: isExpired ? 'expired' : 'error',
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerification({
        status: 'error',
        message: 'Could not connect to the server. Please try again later.',
      });
    }
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
      setVerification({
        ...verification,
        message: errorMessage,
      });
    } finally {
      setIsResending(false);
    }
  };

  const StatusIcon = () => {
    const iconSize = 80;
    const iconColor = getStatusColor();

    switch (verification.status) {
      case 'success':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircle size={iconSize} color={iconColor} />
          </motion.div>
        );
      case 'error':
      case 'expired':
        return (
          <motion.div
            initial={{ rotate: 20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -20, opacity: 0 }}
            transition={{ type: 'spring' }}
          >
            <XCircle size={iconSize} color={iconColor} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          >
            <LoaderCircle size={iconSize} color={iconColor} />
          </motion.div>
        );
    }
  };

  const getStatusColor = () => {
    switch (verification.status) {
      case 'success':
        return '#10B981'; // emerald-500
      case 'error':
      case 'expired':
        return '#EF4444'; // red-500
      default:
        return '#3B82F6'; // blue-500
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full max-w-md"
        >
          <Card className="rounded-xl shadow-lg overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <StatusIcon />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                  Email Verification
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Typography
                  variant="body1"
                  className={`mb-6 ${
                    verification.status === 'success'
                      ? 'text-emerald-600'
                      : verification.status === 'error'
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`}
                >
                  {verification.message}
                </Typography>
              </motion.div>

              <AnimatePresence>
                {showResendSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert severity="success" className="mb-4 rounded-lg">
                      Verification email sent successfully!
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-3">
                {verification.status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => router.push('/login')}
                      startIcon={<ArrowRight />}
                      fullWidth
                      className="py-3 font-medium"
                    >
                      Go to Login
                    </Button>
                  </motion.div>
                )}

                {(verification.status === 'error' || verification.status === 'expired') && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={handleResendEmail}
                        disabled={isResending}
                        startIcon={isResending ? <LoaderCircle className="animate-spin" /> : <Mail />}
                        fullWidth
                        className="py-3 font-medium"
                      >
                        {isResending ? 'Sending...' : 'Resend Verification'}
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => router.push('/sign-up')}
                        startIcon={<UserPlus />}
                        fullWidth
                        className="py-3 font-medium"
                      >
                        Back to Registration
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center p-8">
            <CircularProgress color="primary" size={40} className="mb-4" />
            <Typography variant="body1" className="text-gray-600">
              Loading verification...
            </Typography>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}