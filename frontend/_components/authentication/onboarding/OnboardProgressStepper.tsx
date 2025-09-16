import { Stepper, Step, StepLabel, Box } from '@mui/material';
import { motion } from 'framer-motion';

export default function OnboardProgressStepper({ 
  activeStep 
}: { 
  activeStep: number; 
}) {
  const steps = ['Profile', 'Payment', 'Complete'];
  
  return (
    <Box className="mb-8">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
<Step key={label}>
  <motion.div
    animate={{
      color: index === activeStep ? '#3f51b5' : '#9e9e9e',
      fontWeight: index === activeStep ? 600 : 400,
    }}
    transition={{ duration: 0.3 }}
  >
    <StepLabel>{label}</StepLabel>
  </motion.div>
</Step>

        ))}
      </Stepper>
    </Box>
  );
}