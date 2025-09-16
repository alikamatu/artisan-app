"use client";

import { useState } from 'react';
import {
  Box, Button, Typography, TextField, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem, useTheme,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';

const payoutMethods = [
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'paypal', label: 'PayPal' },
];

const bankAccountTypes = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
];

const mobileMoneyProviders = [
  { value: 'mtn', label: 'MTN Mobile Money' },
  { value: 'vodafone', label: 'Vodafone Cash' },
  { value: 'airteltigo', label: 'AirtelTigo Money' },
];

interface WorkerFinancialSetupProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const WorkerFinancialSetup = ({ onSubmit, onBack }: WorkerFinancialSetupProps) => {
  const theme = useTheme();
  const [payoutData, setPayoutData] = useState({
    accountType: '', // This is the payout method type (bank, mobile_money, paypal)
    accountNumber: '',
    accountName: '',
    bankName: '',
    routingNumber: '',
    bankAccountType: '', // This is checking/savings
    mobileMoneyProvider: '',
    paypalEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayoutData({ ...payoutData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string) => (e: any) => {
    setPayoutData({ ...payoutData, [field]: e.target.value });
  };

  const isFormValid = () => {
    if (!payoutData.accountType) return false;
    
    if (payoutData.accountType === 'bank') {
      return payoutData.accountNumber && payoutData.accountName && payoutData.bankName && payoutData.routingNumber;
    } else if (payoutData.accountType === 'mobile_money') {
      return payoutData.accountNumber && payoutData.accountName && payoutData.mobileMoneyProvider;
    } else if (payoutData.accountType === 'paypal') {
      return payoutData.paypalEmail;
    }
    
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform data to match backend expectations
    const transformedData = {
      accountType: payoutData.accountType,
      accountNumber: payoutData.accountNumber,
      accountName: payoutData.accountName,
      bankName: payoutData.bankName || null,
      routingNumber: payoutData.routingNumber || null,
      bankAccountType: payoutData.bankAccountType || null,
      mobileMoneyProvider: payoutData.mobileMoneyProvider || null,
      paypalEmail: payoutData.paypalEmail || null,
    };
    
    onSubmit(transformedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h6" gutterBottom>
        Payout Setup
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        How would you like to receive payments?
      </Typography>

      <form onSubmit={handleSubmit}>
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Payout Method *</InputLabel>
              <Select
                value={payoutData.accountType}
                label="Payout Method *"
                onChange={handleSelectChange('accountType')}
                required
              >
                {payoutMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {payoutData.accountType === 'bank' && (
              <>
                <Grid container spacing={2}>
                  <div className='w-full'>
                    <TextField
                      fullWidth
                      label="Account Number *"
                      name="accountNumber"
                      value={payoutData.accountNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='w-full'>
                    <TextField
                      fullWidth
                      label="Account Name *"
                      name="accountName"
                      value={payoutData.accountName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='w-full'>
                    <TextField
                      fullWidth
                      label="Bank Name *"
                      name="bankName"
                      value={payoutData.bankName}
                      onChange={handleChange}
                      placeholder="e.g., GCB Bank, Ecobank"
                      required
                    />
                  </div>
                  <div className='w-full'>
                    <TextField
                      fullWidth
                      label="Routing/Sort Code *"
                      name="routingNumber"
                      value={payoutData.routingNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Grid>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={payoutData.bankAccountType}
                    label="Account Type"
                    onChange={handleSelectChange('bankAccountType')}
                  >
                    {bankAccountTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {payoutData.accountType === 'mobile_money' && (
              <>
                <Grid container spacing={2}>
                  <div className='w-full'>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Mobile Money Provider *</InputLabel>
                      <Select
                        value={payoutData.mobileMoneyProvider}
                        label="Mobile Money Provider *"
                        onChange={handleSelectChange('mobileMoneyProvider')}
                        required
                      >
                        {mobileMoneyProviders.map((provider) => (
                          <MenuItem key={provider.value} value={provider.value}>
                            {provider.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className='w-full'>
                    <TextField
                      fullWidth
                      label="Phone Number *"
                      name="accountNumber"
                      value={payoutData.accountNumber}
                      onChange={handleChange}
                      placeholder="0XX XXX XXXX"
                      required
                    />
                  </div>
                  <div className='w-full'>
                    <TextField
                      fullWidth
                      label="Account Name *"
                      name="accountName"
                      value={payoutData.accountName}
                      onChange={handleChange}
                      placeholder="Name on mobile money account"
                      required
                    />
                  </div>
                </Grid>
              </>
            )}

            {payoutData.accountType === 'paypal' && (
              <TextField
                fullWidth
                label="PayPal Email *"
                name="paypalEmail"
                type="email"
                value={payoutData.paypalEmail}
                onChange={handleChange}
                required
                sx={{ mt: 2 }}
              />
            )}
          </CardContent>
        </Card>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          Payments are processed weekly. A 2.9% + ₵1.20 transaction fee applies to all payouts.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button onClick={onBack} variant="outlined">
            Back
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={!isFormValid()}
          >
            Complete Setup
          </Button>
        </Box>
      </form>
    </motion.div>
  );
};

export default WorkerFinancialSetup;