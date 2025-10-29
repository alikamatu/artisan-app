"use client";

import { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Grid, 
  FormControl, InputLabel, Select, MenuItem,
  Chip, FormHelperText, Autocomplete
} from '@mui/material';
import { motion } from 'framer-motion';
import { ProfessionalInfo } from '@/lib/types/onboarding';

type WorkerProfessionalInfoProps = {
  onSubmit: (data: ProfessionalInfo) => void;
  onBack: () => void;
  initialData?: Partial<ProfessionalInfo>;
};

const experienceOptions = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

// Common service categories for Ghana
const serviceCategories = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Cleaning',
  'Gardening',
  'Air Conditioning',
  'Roofing',
  'Masonry',
  'Tiling',
  'Interior Design',
  'Home Repairs',
  'Appliance Repair',
  'Security Installation'
];

const WorkerProfessionalInfo = ({ onSubmit, onBack, initialData }: WorkerProfessionalInfoProps) => {
  const [formData, setFormData] = useState<ProfessionalInfo & { 
    services: string[];
    experience: string; // Add experience field
    education: string; // Add education field
  }>({
    skills: initialData?.skills || [],
    yearsExperience: initialData?.yearsExperience || '',
    certifications: initialData?.certifications || [],
    description: initialData?.description || '',
    // Additional fields that backend expects
    services: [],
    experience: '',
    education: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServicesChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({ ...prev, services: newValue }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform data to match backend expectations
    const transformedData = {
      services: formData.services,
      experience: formData.yearsExperience, // Map yearsExperience to experience
      description: formData.description,
      skills: formData.skills,
      certifications: formData.certifications,
      education: formData.education,
      // Keep original fields for backwards compatibility
      yearsExperience: formData.yearsExperience
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
        Professional Information
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Tell us about your professional background
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <div className='w-full'>
            <Autocomplete
              multiple
              options={serviceCategories}
              value={formData.services}
              onChange={handleServicesChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Services You Offer *"
                  placeholder="Select services"
                  helperText="Choose the services you provide"
                />
              )}
renderTags={(value, getTagProps) =>
  value.map((option, index) => {
    const { key, ...tagProps } = getTagProps({ index }); // remove key from spread
    return (
      <Chip
        key={key} // pass key explicitly
        variant="outlined"
        label={option}
        {...tagProps}
      />
    );
  })
              }
            />
          </div>

          <div className='w-full'>
            <FormControl fullWidth required>
              <InputLabel>Years of Experience</InputLabel>
              <Select
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                label="Years of Experience"
              >
                {experienceOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className='w-full'>
            <TextField
              fullWidth
              label="Education/Training"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="e.g., Trade school, Apprenticeship, Degree"
            />
          </div>

          <div className='w-full'>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Professional Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your work experience, specialties, and what makes you stand out..."
              helperText="This will be shown to potential clients"
            />
          </div>

          <div className='w-full'>
            <Box sx={{ mb: 2 }}>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="Add a Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g., Pipe Installation, Wiring, etc."
                />
                <Button 
                  variant="outlined" 
                  onClick={addSkill}
                  sx={{ minWidth: 'auto', px: 3 }}
                >
                  Add
                </Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => removeSkill(skill)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <FormHelperText>Add relevant skills and expertise</FormHelperText>
            </Box>
          </div>

          <div className='w-full'>
            <Box>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="Add a Certification"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  placeholder="e.g., Licensed Plumber, HVAC Certified, etc."
                />
                <Button 
                  variant="outlined" 
                  onClick={addCertification}
                  sx={{ minWidth: 'auto', px: 3 }}
                >
                  Add
                </Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.certifications.map((cert) => (
                  <Chip
                    key={cert}
                    label={cert}
                    onDelete={() => removeCertification(cert)}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <FormHelperText>Add any relevant certifications or licenses</FormHelperText>
            </Box>
          </div>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button onClick={onBack} variant="outlined">
            Back
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!formData.yearsExperience || !formData.description || formData.services.length === 0}
          >
            Continue
          </Button>
        </Box>
      </form>
    </motion.div>
  );
};

export default WorkerProfessionalInfo;