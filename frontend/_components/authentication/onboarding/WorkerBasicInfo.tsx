"use client";

import { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, Avatar, Grid, 
  InputAdornment, useTheme, Divider, Alert, CircularProgress 
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useOnboarding } from '@/lib/hooks/useOnboarding';

type WorkerBasicInfoProps = {
  onSubmit: (data: any) => void;
  initialData?: any;
};

const WorkerBasicInfo = ({ onSubmit, initialData }: WorkerBasicInfoProps) => {
  const theme = useTheme();
  const { uploadFile, submitting } = useOnboarding();
  const [formData, setFormData] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    photo: null as string | null, // Store URL, not File
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data
  useEffect(() => {
    if (initialData?.profile) {
      const profile = initialData.profile;
      setFormData({
        businessName: profile.businessName || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: initialData.phone || '',
        address: profile.address || '',
        photo: profile.photo || null,
      });

      if (profile.photo && typeof profile.photo === 'string') {
        setPhotoPreview(profile.photo);
      }
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Business address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'Image must be less than 5MB' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photo: 'Please select an image file' });
        return;
      }

      // Clear any existing photo error
      if (errors.photo) {
        setErrors({ ...errors, photo: '' });
      }

      // Create preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the file and get URL
      setUploadingPhoto(true);
      try {
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          setFormData({ ...formData, photo: uploadedUrl });
          setPhotoPreview(uploadedUrl); // Use the uploaded URL for preview
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error: any) {
        setErrors({ ...errors, photo: error.message || 'Upload failed' });
        setPhotoPreview(null); // Clear preview on error
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      onSubmit(formData);
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Tell us about your business and contact details
      </Typography>

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="business-photo-upload"
              type="file"
              onChange={handlePhotoChange}
              disabled={uploadingPhoto}
            />
            <label htmlFor="business-photo-upload">
              <Avatar
                src={photoPreview || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  cursor: uploadingPhoto ? 'not-allowed' : 'pointer',
                  bgcolor: theme.palette.grey[200],
                  border: errors.photo ? `2px solid ${theme.palette.error.main}` : 'none',
                  '&:hover': {
                    bgcolor: uploadingPhoto ? theme.palette.grey[200] : theme.palette.grey[300],
                  }
                }}
              >
                {uploadingPhoto ? (
                  <CircularProgress size={30} />
                ) : photoPreview ? null : (
                  <CameraAltIcon fontSize="large" />
                )}
              </Avatar>
            </label>
            {!photoPreview && !uploadingPhoto && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                Click to upload photo
              </Typography>
            )}
            {uploadingPhoto && (
              <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                Uploading...
              </Typography>
            )}
            {errors.photo && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                {errors.photo}
              </Typography>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          <div className='w-full'>
            <TextField
              required
              fullWidth
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={!!errors.businessName}
              helperText={errors.businessName}
              placeholder="e.g., Smith Plumbing Services"
            />
          </div>
          <div className='w-full'>
            <TextField
              required
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </div>
          <div className='w-full'>
            <TextField
              required
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </div>
          <div className='w-full'>
            <TextField
              required
              fullWidth
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="+233 XX XXX XXXX"
            />
          </div>
          <div className='w-full'>
            <TextField
              required
              fullWidth
              label="Business Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              placeholder="Street address, city, region"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={submitting || uploadingPhoto}
            sx={{ minWidth: 120 }}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </Box>
      </form>
    </motion.div>
  );
};

export default WorkerBasicInfo;