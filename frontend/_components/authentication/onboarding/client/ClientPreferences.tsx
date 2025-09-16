"use client";

import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  FormControl, 
  FormLabel, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Slider, 
  Chip,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';

const serviceCategories = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Moving',
  'Painting',
  'Handyman',
  'Landscaping',
  'Appliance Repair',
];

const budgetMarks = [
  { value: 0, label: '$0' },
  { value: 50, label: '$50' },
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 500, label: '$500+' },
];

type ClientPreferencesProps = {
  onSubmit: (data: any) => void;
  onBack: () => void;
};

const ClientPreferences = ({ onSubmit, onBack }: ClientPreferencesProps) => {
  const theme = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<number[]>([50, 200]);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBudgetChange = (event: Event, newValue: number | number[]) => {
    setBudgetRange(newValue as number[]);
  };

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      categories: selectedCategories,
      budgetRange,
      notifications,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h6" gutterBottom>
        Preferences
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Customize your experience
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Service Categories
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {serviceCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                clickable
                color={selectedCategories.includes(category) ? 'primary' : 'default'}
                onClick={() => handleCategoryToggle(category)}
                variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Preferred Budget Range
          </Typography>
          <Slider
            value={budgetRange}
            onChange={handleBudgetChange}
            valueLabelDisplay="auto"
            min={0}
            max={500}
            step={10}
            marks={budgetMarks}
            valueLabelFormat={(value) => `$${value}`}
            sx={{ maxWidth: 600 }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Notification Preferences
          </Typography>
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifications.email}
                    onChange={handleNotificationChange}
                    name="email"
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifications.sms}
                    onChange={handleNotificationChange}
                    name="sms"
                  />
                }
                label="SMS Notifications"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifications.push}
                    onChange={handleNotificationChange}
                    name="push"
                  />
                }
                label="Push Notifications"
              />
            </FormGroup>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button onClick={onBack} variant="outlined">
            Back
          </Button>
          <Button type="submit" variant="contained">
            Complete Setup
          </Button>
        </Box>
      </form>
    </motion.div>
  );
};

export default ClientPreferences;