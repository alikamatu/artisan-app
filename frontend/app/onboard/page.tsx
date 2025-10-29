"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Stepper, 
  Step, 
  StepLabel, 
  Typography, 
  CircularProgress,
  Alert,
  Paper,
  Snackbar
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/lib/hooks/useOnboarding';
import RoleSelection from '@/_components/authentication/onboarding/RoleSelection';
import ClientProfileSetup from '@/_components/authentication/onboarding/client/ClientProfileSetup';
import WorkerBasicInfo from '@/_components/authentication/onboarding/WorkerBasicInfo';
import ClientPaymentSetup from '@/_components/authentication/onboarding/client/ClientPaymentSetup';
import WorkerProfessionalInfo from '@/_components/authentication/onboarding/WorkerProfessionalInfo';
import ClientPreferences from '@/_components/authentication/onboarding/client/ClientPreferences';
import WorkerPricingAvailability from '@/_components/authentication/onboarding/WorkerPricingAvailability';
import WorkerVerification from '@/_components/authentication/onboarding/WorkerVerification';
import WorkerFinancialSetup from '@/_components/authentication/onboarding/WorkerFinancialSetup';
import {
  UserRole,
} from '@/lib/types/onboarding';

export default function OnBoard() {
  const router = useRouter();
  const { 
    status, 
    loading, 
    submitting, 
    error,
    updateStep, 
    completeOnboarding,
    fetchStatus,
    uploadFile,
    clearError 
  } = useOnboarding();
  
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [showSuccess, setShowSuccess] = useState(false);

  // Client steps
  const clientSteps = [
    'Profile Setup',
    'Payment Setup',
    'Preferences',
  ];

  // Worker steps
  const workerSteps = [
    'Basic Information',
    'Professional Info',
    'Pricing & Availability',
    'Verification',
    'Financial Setup',
  ];

  const steps = role === 'client' ? clientSteps : role === 'worker' ? workerSteps : [];

  // Initialize and fetch status on mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Initialize role and step from API status
  useEffect(() => {
    if (status) {
      if (status.completed) {
        // Redirect if onboarding is already complete
        const dashboardPath = status.role === 'client' ? '/dashboard' : '/dashboard';
        router.push(dashboardPath);
        return;
      }

      if (status.role) {
        setRole(status.role);
        // Set active step based on progress
        setActiveStep(getCurrentStep(status.role, status.progress));
      }
    }
  }, [status, router]);

  const getCurrentStep = (userRole: string, progress: Record<string, boolean>): number => {
    if (userRole === 'client') {
      if (!progress.profile) return 0;
      if (!progress.payment) return 1;
      if (!progress.preferences) return 2;
      return 2; // Last step
    } else if (userRole === 'worker') {
      if (!progress.basic) return 0;
      if (!progress.professional) return 1;
      if (!progress.pricing) return 2;
      if (!progress.verification) return 3;
      if (!progress.financial) return 4;
      return 4; // Last step
    }
    return 0;
  };

  const handleNext = async (stepData: any) => {
    clearError();

    // Handle role selection
    if (!role) {
      setRole(stepData as UserRole);
      return;
    }

    try {
      let stepName = '';
      
      if (role === 'client') {
        switch (activeStep) {
          case 0: stepName = 'profile'; break;
          case 1: stepName = 'payment'; break;
          case 2: stepName = 'preferences'; break;
        }
      } else if (role === 'worker') {
        switch (activeStep) {
          case 0: stepName = 'basic'; break;
          case 1: stepName = 'professional'; break;
          case 2: stepName = 'pricing'; break;
          case 3: stepName = 'verification'; break;
          case 4: stepName = 'financial'; break;
        }
      }

      // Handle file uploads if present in the data
      const processedData = await processStepData(stepData);

      const success = await updateStep(role, stepName, processedData);
      
      if (success) {
        if (activeStep === steps.length - 1) {
          // Complete onboarding on last step
          const completeData = {
            role,
            [stepName]: processedData
          };
          
          const completed = await completeOnboarding(completeData);
          if (completed) {
            setShowSuccess(true);
            setTimeout(() => {
              router.push('/dashboard/profile');
            }, 2000);
          }
        } else {
          setActiveStep(prev => prev + 1);
        }
      }
    } catch (error: any) {
      console.error('Error in handleNext:', error);
    }
  };

  // Process step data to handle file uploads
  const processStepData = async (data: any): Promise<any> => {
    const processedData = { ...data };

    // Handle profile photo upload
    if (data.photo && data.photo instanceof File) {
      const photoUrl = await uploadFile(data.photo);
      if (photoUrl) {
        processedData.photo = photoUrl;
      }
    }

    // Handle verification document uploads
    if (data.frontImage && data.frontImage instanceof File) {
      const frontUrl = await uploadFile(data.frontImage);
      if (frontUrl) {
        processedData.idDocument = frontUrl;
      }
    }

    if (data.portfolioImages && Array.isArray(data.portfolioImages)) {
      const uploadedImages = await Promise.all(
        data.portfolioImages.map(async (file: File) => {
          if (file instanceof File) {
            return await uploadFile(file);
          }
          return file; // Already a URL
        })
      );
      processedData.portfolioImages = uploadedImages.filter(Boolean);
    }

    return processedData;
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    if (!role) {
      return <RoleSelection onSelect={handleNext} />;
    }

    const initialData = status?.progress || {};

    switch (activeStep) {
      case 0:
        return role === 'client' ? (
          <ClientProfileSetup 
            onSubmit={handleNext} 
            initialData={initialData} 
          />
        ) : (
          <WorkerBasicInfo 
            onSubmit={handleNext} 
            initialData={initialData} 
          />
        );
      case 1:
        return role === 'client' ? (
          <ClientPaymentSetup 
            onSubmit={handleNext} 
            onBack={handleBack} 
          />
        ) : (
          <WorkerProfessionalInfo 
            onSubmit={handleNext} 
            onBack={handleBack}
            initialData={initialData}
          />
        );
      case 2:
        return role === 'client' ? (
          <ClientPreferences 
            onSubmit={handleNext} 
            onBack={handleBack} 
          />
        ) : (
          <WorkerPricingAvailability 
            onSubmit={handleNext} 
            onBack={handleBack} 
          />
        );
      case 3:
        return role === 'worker' ? (
          <WorkerVerification 
            onSubmit={handleNext} 
            onBack={handleBack} 
          />
        ) : null;
      case 4:
        return role === 'worker' ? (
          <WorkerFinancialSetup 
            onSubmit={handleNext} 
            onBack={handleBack} 
          />
        ) : null;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading your onboarding status...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Complete Your Profile
          </Typography>
          <Typography color="textSecondary">
            {role
              ? `Let's set up your ${role} account`
              : 'Choose your account type to get started'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        {role && (
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={status?.progress && Object.values(status.progress)[index]}>
                  <StepLabel>
                    <Typography variant="caption">
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        )}

        <Paper elevation={2} sx={{ p: 4 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={role ? `step-${activeStep}` : 'role-selection'}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </Paper>

        {submitting && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="textSecondary">
                {activeStep === steps.length - 1 ? 'Completing onboarding...' : 'Saving your information...'}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Success notification */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Onboarding completed successfully! Redirecting to your dashboard...
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};