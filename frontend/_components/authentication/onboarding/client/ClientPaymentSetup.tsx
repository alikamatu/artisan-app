"use client";

import { useState } from 'react';
import { Box, Button, Typography, TextField, Card, CardContent, useTheme, Grid } from '@mui/material';
import { motion } from 'framer-motion';

type ClientPaymentSetupProps = {
  onSubmit: (data: any) => void;
  onBack: () => void;
};

const ClientPaymentSetup = ({ onSubmit, onBack }: ClientPaymentSetupProps) => {
  const theme = useTheme();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      paymentMethod,
      ...(paymentMethod === 'card' ? { card: cardData } : {}),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Add your preferred payment method
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <Button
            variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
            onClick={() => setPaymentMethod('card')}
            sx={{ mr: 2 }}
          >
            Credit/Debit Card
          </Button>
          <Button
            variant={paymentMethod === 'paypal' ? 'contained' : 'outlined'}
            onClick={() => setPaymentMethod('paypal')}
          >
            PayPal
          </Button>
        </Box>

        {paymentMethod === 'card' ? (
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2}>
                <div className='w-full'>
                  <TextField
                    required
                    fullWidth
                    label="Card Number"
                    name="number"
                    value={cardData.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className='w-full'>
                  <TextField
                    required
                    fullWidth
                    label="Expiry Date"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className='w-full'>
                  <TextField
                    required
                    fullWidth
                    label="CVC"
                    name="cvc"
                    value={cardData.cvc}
                    onChange={handleCardChange}
                    placeholder="123"
                  />
                </div>
                <div className='w-full'>
                  <TextField
                    required
                    fullWidth
                    label="Name on Card"
                    name="name"
                    value={cardData.name}
                    onChange={handleCardChange}
                  />
                </div>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You'll be redirected to PayPal to complete your payment setup
            </Typography>
            <img
              src="/images/paypal-logo.png"
              alt="PayPal"
              style={{ height: 40 }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button onClick={onBack} variant="outlined">
            Back
          </Button>
          <Button type="submit" variant="contained">
            Continue
          </Button>
        </Box>
      </form>
    </motion.div>
  );
};

export default ClientPaymentSetup;