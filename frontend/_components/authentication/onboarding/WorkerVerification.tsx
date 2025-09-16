"use client";

import { useState } from 'react';
import {
  Box, Button, Typography, Card, CardContent, 
  FormControl, FormLabel, RadioGroup, FormControlLabel, 
  Radio, useTheme, Avatar, Grid, CircularProgress, Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useOnboarding } from '@/lib/hooks/useOnboarding';

type WorkerVerificationProps = {
  onSubmit: (data: any) => void;
  onBack: () => void;
};

const verificationTypes = [
  { value: 'driver', label: "Driver's License" },
  { value: 'id', label: 'Government ID' },
  { value: 'passport', label: 'Passport' },
];

const WorkerVerification = ({ onSubmit, onBack }: WorkerVerificationProps) => {
  const theme = useTheme();
  const { uploadFile } = useOnboarding();
  const [verificationData, setVerificationData] = useState({
    documentType: '',
    frontImage: null as string | null, // Store URLs
    backImage: null as string | null,
    selfieImage: null as string | null,
  });
  const [uploading, setUploading] = useState({
    front: false,
    back: false,
    selfie: false,
  });
  const [previews, setPreviews] = useState({
    front: null as string | null,
    back: null as string | null,
    selfie: null as string | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: 'frontImage' | 'backImage' | 'selfieImage'
  ) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const uploadKey = field === 'frontImage' ? 'front' : field === 'backImage' ? 'back' : 'selfie';

      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, [field]: 'Image must be less than 5MB' });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, [field]: 'Please select an image file' });
        return;
      }

      // Clear errors
      if (errors[field]) {
        setErrors({ ...errors, [field]: '' });
      }

      // Create preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(prev => ({ ...prev, [uploadKey]: reader.result as string }));
      };
      reader.readAsDataURL(file);

      // Upload file
      setUploading(prev => ({ ...prev, [uploadKey]: true }));
      try {
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          setVerificationData(prev => ({ ...prev, [field]: uploadedUrl }));
          setPreviews(prev => ({ ...prev, [uploadKey]: uploadedUrl }));
        } else {
          throw new Error('Upload failed');
        }
      } catch (error: any) {
        setErrors({ ...errors, [field]: error.message || 'Upload failed' });
        setPreviews(prev => ({ ...prev, [uploadKey]: null }));
      } finally {
        setUploading(prev => ({ ...prev, [uploadKey]: false }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationData.documentType || !verificationData.frontImage || !verificationData.selfieImage) {
      setErrors({ submit: 'Please complete all required fields' });
      return;
    }

    onSubmit({
      idType: verificationData.documentType,
      idDocument: verificationData.frontImage,
      backDocument: verificationData.backImage,
      selfieDocument: verificationData.selfieImage,
      backgroundCheckConsent: true,
    });
  };

  const isUploading = uploading.front || uploading.back || uploading.selfie;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Typography variant="h6" gutterBottom>
        Identity Verification
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Required for marketplace listing
      </Typography>

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Document Type
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={verificationData.documentType}
                onChange={(e) => setVerificationData({ 
                  ...verificationData, 
                  documentType: e.target.value 
                })}
              >
                {verificationTypes.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    value={type.value}
                    control={<Radio />}
                    label={type.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <div className='w-full'>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="front-upload"
              type="file"
              onChange={(e) => handleImageUpload(e, 'frontImage')}
              disabled={uploading.front}
            />
            <label htmlFor="front-upload">
              <Card 
                variant="outlined" 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  cursor: uploading.front ? 'not-allowed' : 'pointer',
                  border: errors.frontImage ? `2px solid ${theme.palette.error.main}` : undefined,
                }}
              >
                {uploading.front ? (
                  <Box sx={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                ) : previews.front ? (
                  <Avatar
                    src={previews.front}
                    variant="square"
                    sx={{ width: '100%', height: 150, mb: 1 }}
                  />
                ) : (
                  <Box sx={{ height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CloudUploadIcon fontSize="large" color="action" />
                    <Typography>Front of Document *</Typography>
                  </Box>
                )}
                {errors.frontImage && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.frontImage}
                  </Typography>
                )}
              </Card>
            </label>
          </div>

          <div className='w-full'>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="back-upload"
              type="file"
              onChange={(e) => handleImageUpload(e, 'backImage')}
              disabled={uploading.back}
            />
            <label htmlFor="back-upload">
              <Card 
                variant="outlined" 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  cursor: uploading.back ? 'not-allowed' : 'pointer',
                  border: errors.backImage ? `2px solid ${theme.palette.error.main}` : undefined,
                }}
              >
                {uploading.back ? (
                  <Box sx={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                ) : previews.back ? (
                  <Avatar
                    src={previews.back}
                    variant="square"
                    sx={{ width: '100%', height: 150, mb: 1 }}
                  />
                ) : (
                  <Box sx={{ height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CloudUploadIcon fontSize="large" color="action" />
                    <Typography>Back of Document</Typography>
                  </Box>
                )}
                {errors.backImage && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.backImage}
                  </Typography>
                )}
              </Card>
            </label>
          </div>

          <div className='w-full'>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="selfie-upload"
              type="file"
              onChange={(e) => handleImageUpload(e, 'selfieImage')}
              disabled={uploading.selfie}
            />
            <label htmlFor="selfie-upload">
              <Card 
                variant="outlined" 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  cursor: uploading.selfie ? 'not-allowed' : 'pointer',
                  border: errors.selfieImage ? `2px solid ${theme.palette.error.main}` : undefined,
                }}
              >
                {uploading.selfie ? (
                  <Box sx={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                ) : previews.selfie ? (
                  <Avatar
                    src={previews.selfie}
                    variant="square"
                    sx={{ width: '100%', height: 150, mb: 1 }}
                  />
                ) : (
                  <Box sx={{ height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CloudUploadIcon fontSize="large" color="action" />
                    <Typography>Selfie with Document *</Typography>
                  </Box>
                )}
                {errors.selfieImage && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.selfieImage}
                  </Typography>
                )}
              </Card>
            </label>
          </div>
        </Grid>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          Your documents will be securely stored and only used for verification purposes.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button onClick={onBack} variant="outlined" disabled={isUploading}>
            Back
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={
              isUploading || 
              !verificationData.documentType || 
              !verificationData.frontImage || 
              !verificationData.selfieImage
            }
          >
            {isUploading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              'Submit Verification'
            )}
          </Button>
        </Box>
      </form>
    </motion.div>
  );
};

export default WorkerVerification;
