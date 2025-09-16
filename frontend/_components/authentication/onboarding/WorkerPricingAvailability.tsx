"use client";

import { useState } from 'react';
import {
  Box, Button, Typography, TextField, Grid, 
  FormControlLabel, Switch, InputAdornment, Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

type WorkerPricingAvailabilityProps = {
  onSubmit: (data: any) => void;
  onBack: () => void;
};

const availabilityOptions = [
  'Monday', 'Tuesday', 'Wednesday', 
  'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const WorkerPricingAvailability = ({ onSubmit, onBack }: WorkerPricingAvailabilityProps) => {
  const [formData, setFormData] = useState({
    hourlyRate: '',
    projectRate: '',
    availability: [] as string[],
    travelFee: false,
    travelFeeAmount: '',
    unavailableDates: [] as Date[],
    workingHours: { start: '09:00', end: '17:00' },
    serviceArea: '',
    maxDistance: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkingHoursChange = (field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: { ...prev.workingHours, [field]: value }
    }));
  };

  const handleAvailabilityToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  const handleDateAdd = (date: Date | null) => {
    if (!date) return;
    setFormData(prev => ({
      ...prev,
      unavailableDates: [...prev.unavailableDates, date]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      projectRate: parseFloat(formData.projectRate) || 0,
      availableDays: formData.availability,
      workingHours: formData.workingHours,
      serviceArea: formData.serviceArea,
      maxDistance: parseFloat(formData.maxDistance) || 0,
      travelFee: formData.travelFee,
      travelFeeAmount: formData.travelFee ? parseFloat(formData.travelFeeAmount) || 0 : 0,
      unavailableDates: formData.unavailableDates.map(d => d.toISOString())
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Typography variant="h6" gutterBottom>Pricing & Availability</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          Set your rates and schedule
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <div className='w-full text-red-600 text-sm mb-2'>
              <TextField
                fullWidth
                label="Hourly Rate ($)"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
            </div>
            <div className='w-full text-red-600 text-sm mb-2'>
              <TextField
                fullWidth
                label="Project Rate ($)"
                name="projectRate"
                type="number"
                value={formData.projectRate}
                onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
            </div>
            <div className='w-full text-red-600 text-sm mb-2'>
              <TextField
                fullWidth
                label="Service Area"
                name="serviceArea"
                value={formData.serviceArea}
                onChange={handleChange}
                placeholder="e.g., Accra, East Legon"
                required
              />
            </div>
            <div className='w-full text-red-600 text-sm mb-2'>
              <TextField
                fullWidth
                label="Max Travel Distance (km)"
                name="maxDistance"
                type="number"
                value={formData.maxDistance}
                onChange={handleChange}
                InputProps={{ endAdornment: <InputAdornment position="end">km</InputAdornment> }}
              />
            </div>
            <div className='w-full text-red-600 text-sm mb-2'>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={formData.workingHours.start}
                onChange={e => handleWorkingHoursChange('start', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className='w-full text-red-600 text-sm mb-2'>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={formData.workingHours.end}
                onChange={e => handleWorkingHoursChange('end', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>

          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Weekly Availability</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availabilityOptions.map(day => (
                <Button
                  key={day}
                  variant={formData.availability.includes(day) ? 'contained' : 'outlined'}
                  onClick={() => handleAvailabilityToggle(day)}
                >
                  {day.substring(0, 3)}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.travelFee}
                  onChange={e => setFormData(prev => ({ ...prev, travelFee: e.target.checked }))}
                />
              }
              label="Charge travel fee?"
            />
            {formData.travelFee && (
              <TextField
                fullWidth
                label="Travel Fee Amount ($)"
                name="travelFeeAmount"
                type="number"
                value={formData.travelFeeAmount}
                onChange={handleChange}
                sx={{ mt: 2 }}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Unavailable Dates</Typography>
            <DatePicker
              value={formData.unavailableDates[formData.unavailableDates.length - 1] || null}
              onChange={handleDateAdd}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.unavailableDates.map((date, index) => (
                <Chip
                  key={index}
                  label={format(date, 'MM/dd/yyyy')}
                  onDelete={() => setFormData(prev => ({
                    ...prev,
                    unavailableDates: prev.unavailableDates.filter((_, i) => i !== index)
                  }))}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={onBack} variant="outlined">Back</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formData.hourlyRate || !formData.serviceArea || formData.availability.length === 0}
            >
              Continue
            </Button>
          </Box>
        </form>
      </motion.div>
    </LocalizationProvider>
  );
};

export default WorkerPricingAvailability;
