"use client";

import { Card, CardContent, Typography, Button, Grid, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

type RoleSelectionProps = {
  onSelect: (role: 'client' | 'worker') => void;
};

const RoleSelection = ({ onSelect }: RoleSelectionProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Select your account type
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 4 }}>
        Choose how you want to use our platform
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <div className='w-full'>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
              }}
              onClick={() => onSelect('client')}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <img src="/images/client-icon.svg" alt="Client" width={80} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  I'm a Client
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Looking to hire skilled professionals
                </Typography>
                <Typography variant="caption" component="div">
                  <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                    <li>Post jobs and get quotes</li>
                    <li>Manage bookings and payments</li>
                    <li>Review worker profiles</li>
                  </ul>
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button variant="contained" fullWidth>
                  Continue as Client
                </Button>
              </Box>
            </Card>
          </motion.div>
        </div >

        <div className='w-full'>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
              }}
              onClick={() => onSelect('worker')}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <img src="/images/worker-icon.svg" alt="Worker" width={80} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  I'm a Worker
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Offering professional services
                </Typography>
                <Typography variant="caption" component="div">
                  <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                    <li>Showcase your skills and portfolio</li>
                    <li>Get hired for jobs in your area</li>
                    <li>Manage your schedule and earnings</li>
                  </ul>
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button variant="outlined" fullWidth>
                  Continue as Worker
                </Button>
              </Box>
            </Card>
          </motion.div>
        </div>
      </Grid>
    </Box>
  );
};

export default RoleSelection;