"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Box, TextField, Button, Typography, Avatar, Grid, 
  useTheme, Alert, CircularProgress, LinearProgress 
} from '@mui/material';
import { motion } from 'framer-motion';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useOnboarding } from '@/lib/hooks/useOnboarding';
import { formatFileSize } from '@/utils/imageCompression';

type ClientProfileSetupProps = {
  onSubmit: (data: any) => void;
  initialData?: any;
};

const ClientProfileSetup = ({ onSubmit, initialData }: ClientProfileSetupProps) => {
  const theme = useTheme();
  const { uploadFile, submitting } = useOnboarding();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    photo: null as string | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, []);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      const profile = initialData.profile || initialData;
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || initialData.email || '',
        phone: profile.phone || initialData.phone || '',
        photo: profile.photo || null,
      });

      if (profile.photo && typeof profile.photo === 'string') {
        setPhotoPreview(profile.photo);
      }
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photo: 'Please select an image file' });
        e.target.value = ''; // Reset input
        return;
      }

      // Show file size info
      console.log(`Selected file: ${file.name} (${formatFileSize(file.size)})`);

      // Warn for very large files
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'Image must be less than 5MB. Very large images may fail to upload.' });
        e.target.value = ''; // Reset input
        return;
      }

      // Clear any existing photo error
      if (errors.photo) {
        setErrors({ ...errors, photo: '' });
      }

      // Clean up previous preview if it was a blob URL
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }

      // Create preview using FileReader (safer than createObjectURL)
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.onerror = () => {
        setErrors({ ...errors, photo: 'Failed to load image preview' });
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);

      // Upload the file and get URL
      setUploadingPhoto(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      try {
        const uploadedUrl = await uploadFile(file);
        
        // Complete the progress
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
        
        if (uploadedUrl) {
          setFormData(prev => ({ ...prev, photo: uploadedUrl }));
          // Keep the uploaded URL as preview, not the local blob
          setPhotoPreview(uploadedUrl);
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error: any) {
        clearInterval(progressInterval);
        setUploadProgress(0);
        setErrors({ ...errors, photo: error.message || 'Upload failed' });
        setPhotoPreview(null);
      } finally {
        clearInterval(progressInterval);
        setUploadingPhoto(false);
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    }
  };

  const getInitials = () => {
    return (formData.firstName.charAt(0) + formData.lastName.charAt(0)).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Tell us about yourself so service providers can get to know you better
      </Typography>

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-photo-upload"
              type="file"
              onChange={handlePhotoChange}
              disabled={uploadingPhoto}
              ref={fileInputRef}
            />
            <label htmlFor="profile-photo-upload">
              <Avatar
                src={photoPreview || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  cursor: uploadingPhoto ? 'not-allowed' : 'pointer',
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  border: errors.photo ? `2px solid ${theme.palette.error.main}` : `2px solid ${theme.palette.divider}`,
                  '&:hover': {
                    bgcolor: uploadingPhoto ? theme.palette.primary.light : theme.palette.primary.main,
                    transform: uploadingPhoto ? 'none' : 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {uploadingPhoto ? (
                  <CircularProgress size={30} color="inherit" />
                ) : photoPreview ? null : (
                  getInitials() || <CameraAltIcon fontSize="large" />
                )}
              </Avatar>
            </label>
          </Box>

          {/* Upload progress bar */}
          {uploadingPhoto && uploadProgress > 0 && (
            <Box sx={{ width: '200px', mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" color="primary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
                Uploading {Math.round(uploadProgress)}%
              </Typography>
            </Box>
          )}

          {!photoPreview && !uploadingPhoto && (
            <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center' }}>
              Click to upload profile photo<br />
              <span style={{ fontSize: '0.7rem' }}>Optional • Max size: 5MB • JPG, PNG supported</span>
            </Typography>
          )}
          
          {uploadingPhoto && uploadProgress === 0 && (
            <Typography variant="caption" color="primary" sx={{ textAlign: 'center' }}>
              Processing image...
            </Typography>
          )}
          
          {errors.photo && (
            <Typography variant="caption" color="error" sx={{ textAlign: 'center', mt: 1 }}>
              {errors.photo}
            </Typography>
          )}
        </Box>

        <Grid container spacing={3}>
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
              variant="outlined"
              autoComplete="given-name"
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
              variant="outlined"
              autoComplete="family-name"
            />
          </div>
          <div className='w-full'>
            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              autoComplete="email"
              placeholder="your.email@example.com"
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
              variant="outlined"
              autoComplete="tel"
              placeholder="+233 XX XXX XXXX"
            />
          </div>
        </Grid>

        <Box sx={{ 
          mt: 4, 
          p: 2, 
          bgcolor: theme.palette.grey[50], 
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="body2" color="textSecondary">
            <strong>Why we need this information:</strong><br />
            • Service providers can contact you directly<br />
            • Helps build trust and credibility<br />
            • Enables smooth communication and booking
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting || uploadingPhoto}
            sx={{ 
              minWidth: 140,
              height: 48,
              fontSize: '1rem'
            }}
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

export default ClientProfileSetup;