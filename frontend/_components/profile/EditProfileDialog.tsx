"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Autocomplete,
  FormControlLabel,
  Switch,
  Divider,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  AccountBalance as BankIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  profile: {
    name?: string;
    phone?: string;
    region?: string;
    role: 'client' | 'worker';
    
    // Nested profile data
    profile?: {
      firstName?: string;
      lastName?: string;
      photo?: string;
      address?: string;
      businessName?: string;
      bio?: string;
    };
    professional?: {
      skills?: string[];
      services?: string[];
      experience?: string;
      education?: string;
      description?: string;
      certifications?: string[];
    };
    pricing?: {
      hourly_rate?: number;
      max_distance?: number;
      service_area?: string;
      working_hours?: {
        start: string;
        end: string;
      };
      available_days?: string[];
    };
    financial?: {
      account_type?: string;
      account_name?: string;
      account_number?: string;
      routing_number?: string;
      bank_name?: string;
      mobile_money_provider?: string;
    };
    verification?: {
      id_type?: string;
      verification_status?: string;
    };
  };
  onSave: (data: any) => Promise<void>;
}

// Predefined options
const EXPERIENCE_OPTIONS = ['Entry Level', '1-3 years', '3-5 years', '5+ years', '10+ years'];
const EDUCATION_OPTIONS = ['High School', 'Certificate', 'Diploma', 'Degree', 'Masters', 'PhD'];
const ACCOUNT_TYPES = ['bank', 'mobile_money', 'paypal'];
const MOBILE_MONEY_PROVIDERS = ['mtn', 'vodafone', 'airtel'];
const ID_TYPES = ['national_id', 'passport', 'drivers_license'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onClose,
  profile,
  onSave,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for all sections
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    phone: '',
    region: '',
    
    // Profile section
    profile: {
      firstName: '',
      lastName: '',
      address: '',
      businessName: '',
      bio: '',
    },
    
    // Professional section (workers only)
    professional: {
      skills: [] as string[],
      services: [] as string[],
      experience: '',
      education: '',
      description: '',
      certifications: [] as string[],
    },
    
    // Pricing section (workers only)
    pricing: {
      hourly_rate: '',
      max_distance: '',
      service_area: '',
      working_hours: {
        start: '09:00',
        end: '17:00',
      },
      available_days: [] as string[],
    },
    
    // Financial section (workers only)
    financial: {
      account_type: '',
      account_name: '',
      account_number: '',
      routing_number: '',
      bank_name: '',
      mobile_money_provider: '',
    },
    
    // Verification section
    verification: {
      id_type: '',
    },
  });

  // Temporary state for adding new items
  const [newSkill, setNewSkill] = useState('');
  const [newService, setNewService] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    if (open && profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        region: profile.region || '',
        
        profile: {
          firstName: profile.profile?.firstName || '',
          lastName: profile.profile?.lastName || '',
          address: profile.profile?.address || '',
          businessName: profile.profile?.businessName || '',
          bio: profile.profile?.bio || '',
        },
        
        professional: {
          skills: profile.professional?.skills || [],
          services: profile.professional?.services || [],
          experience: profile.professional?.experience || '',
          education: profile.professional?.education || '',
          description: profile.professional?.description || '',
          certifications: profile.professional?.certifications || [],
        },
        
        pricing: {
          hourly_rate: profile.pricing?.hourly_rate?.toString() || '',
          max_distance: profile.pricing?.max_distance?.toString() || '',
          service_area: profile.pricing?.service_area || '',
          working_hours: {
            start: profile.pricing?.working_hours?.start || '09:00',
            end: profile.pricing?.working_hours?.end || '17:00',
          },
          available_days: profile.pricing?.available_days || [],
        },
        
        financial: {
          account_type: profile.financial?.account_type || '',
          account_name: profile.financial?.account_name || '',
          account_number: profile.financial?.account_number || '',
          routing_number: profile.financial?.routing_number || '',
          bank_name: profile.financial?.bank_name || '',
          mobile_money_provider: profile.financial?.mobile_money_provider || '',
        },
        
        verification: {
          id_type: profile.verification?.id_type || '',
        },
      });
    }
  }, [open, profile]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const updateData: any = {
        // Basic fields
        name: formData.name,
        phone: formData.phone,
        region: formData.region,
        
        // Nested sections
        profile: {
          firstName: formData.profile.firstName,
          lastName: formData.profile.lastName,
          address: formData.profile.address,
          businessName: formData.profile.businessName,
          bio: formData.profile.bio,
        },
      };

      // Add worker-specific data
      if (profile.role === 'worker') {
        updateData.professional = {
          skills: formData.professional.skills,
          services: formData.professional.services,
          experience: formData.professional.experience,
          education: formData.professional.education,
          description: formData.professional.description,
          certifications: formData.professional.certifications,
        };

        updateData.pricing = {
          hourly_rate: formData.pricing.hourly_rate ? parseFloat(formData.pricing.hourly_rate) : undefined,
          max_distance: formData.pricing.max_distance ? parseFloat(formData.pricing.max_distance) : undefined,
          service_area: formData.pricing.service_area,
          working_hours: formData.pricing.working_hours,
          available_days: formData.pricing.available_days,
        };

        updateData.financial = {
          account_type: formData.financial.account_type,
          account_name: formData.financial.account_name,
          account_number: formData.financial.account_number,
          routing_number: formData.financial.routing_number,
          bank_name: formData.financial.bank_name,
          mobile_money_provider: formData.financial.mobile_money_provider,
        };
      }

      updateData.verification = {
        id_type: formData.verification.id_type,
      };

      await onSave(updateData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (field: 'skills' | 'services' | 'certifications', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        professional: {
          ...prev.professional,
          [field]: [...prev.professional[field], value.trim()]
        }
      }));
    }
  };

  const removeArrayItem = (field: 'skills' | 'services' | 'certifications', index: number) => {
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        [field]: prev.professional[field].filter((_, i) => i !== index)
      }
    }));
  };

  const handleAvailableDaysChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        available_days: checked 
          ? [...prev.pricing.available_days, day]
          : prev.pricing.available_days.filter(d => d !== day)
      }
    }));
  };

  const tabs = [
    { label: 'Basic Info', icon: <PersonIcon /> },
    ...(profile.role === 'worker' ? [
      { label: 'Professional', icon: <BusinessIcon /> },
      { label: 'Pricing', icon: <MoneyIcon /> },
      { label: 'Payment', icon: <BankIcon /> },
    ] : []),
    { label: 'Verification', icon: <VerifiedIcon /> },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {error && (
          <Box sx={{ p: 3, pt: 1 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={index}
              label={tab.label} 
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        {/* Basic Info Tab */}
        <TabPanel value={currentTab} index={0}>
          <Box sx={{ px: 3 }}>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
              
              <Stack direction="row" spacing={2}>
                <TextField
                  label="First Name"
                  value={formData.profile.firstName}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    profile: { ...formData.profile, firstName: e.target.value }
                  })}
                  fullWidth
                />
                
                <TextField
                  label="Last Name"
                  value={formData.profile.lastName}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    profile: { ...formData.profile, lastName: e.target.value }
                  })}
                  fullWidth
                />
              </Stack>
              
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
                required
              />
              
              <TextField
                label="Region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                fullWidth
              />

              <TextField
                label="Address"
                value={formData.profile.address}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  profile: { ...formData.profile, address: e.target.value }
                })}
                fullWidth
              />
              
              {profile.role === 'worker' && (
                <TextField
                  label="Business Name"
                  value={formData.profile.businessName}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    profile: { ...formData.profile, businessName: e.target.value }
                  })}
                  fullWidth
                />
              )}
              
              <TextField
                label="Bio"
                value={formData.profile.bio}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  profile: { ...formData.profile, bio: e.target.value }
                })}
                fullWidth
                multiline
                rows={3}
              />
            </Stack>
          </Box>
        </TabPanel>

        {/* Professional Tab (Workers only) */}
        {profile.role === 'worker' && (
          <TabPanel value={currentTab} index={1}>
            <Box sx={{ px: 3 }}>
              <Stack spacing={3}>
                <TextField
                  label="Professional Description"
                  value={formData.professional.description}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    professional: { ...formData.professional, description: e.target.value }
                  })}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Describe your professional background and expertise..."
                />

                <Stack direction="row" spacing={2}>
                  <Autocomplete
                    value={formData.professional.experience}
                    onChange={(_, value) => setFormData({ 
                      ...formData, 
                      professional: { ...formData.professional, experience: value || '' }
                    })}
                    options={EXPERIENCE_OPTIONS}
                    renderInput={(params) => <TextField {...params} label="Experience Level" />}
                    fullWidth
                  />

                  <Autocomplete
                    value={formData.professional.education}
                    onChange={(_, value) => setFormData({ 
                      ...formData, 
                      professional: { ...formData.professional, education: value || '' }
                    })}
                    options={EDUCATION_OPTIONS}
                    renderInput={(params) => <TextField {...params} label="Education" />}
                    fullWidth
                  />
                </Stack>

                {/* Skills */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Skills</Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    <TextField
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('skills', newSkill);
                          setNewSkill('');
                        }
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        addArrayItem('skills', newSkill);
                        setNewSkill('');
                      }}
                      disabled={!newSkill.trim()}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.professional.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => removeArrayItem('skills', index)}
                        deleteIcon={<DeleteIcon />}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Services */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Services</Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    <TextField
                      placeholder="Add a service"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('services', newService);
                          setNewService('');
                        }
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        addArrayItem('services', newService);
                        setNewService('');
                      }}
                      disabled={!newService.trim()}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.professional.services.map((service, index) => (
                      <Chip
                        key={index}
                        label={service}
                        onDelete={() => removeArrayItem('services', index)}
                        deleteIcon={<DeleteIcon />}
                        variant="outlined"
                        color="secondary"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Certifications */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Certifications</Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    <TextField
                      placeholder="Add a certification"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('certifications', newCertification);
                          setNewCertification('');
                        }
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        addArrayItem('certifications', newCertification);
                        setNewCertification('');
                      }}
                      disabled={!newCertification.trim()}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.professional.certifications.map((cert, index) => (
                      <Chip
                        key={index}
                        label={cert}
                        onDelete={() => removeArrayItem('certifications', index)}
                        deleteIcon={<DeleteIcon />}
                        variant="filled"
                        color="success"
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Box>
          </TabPanel>
        )}

        {/* Pricing Tab (Workers only) */}
        {profile.role === 'worker' && (
          <TabPanel value={currentTab} index={2}>
            <Box sx={{ px: 3 }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Hourly Rate ($)"
                    value={formData.pricing.hourly_rate}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { ...formData.pricing, hourly_rate: e.target.value }
                    })}
                    type="number"
                    fullWidth
                  />

                  <TextField
                    label="Max Distance (km)"
                    value={formData.pricing.max_distance}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { ...formData.pricing, max_distance: e.target.value }
                    })}
                    type="number"
                    fullWidth
                  />
                </Stack>

                <TextField
                  label="Service Area"
                  value={formData.pricing.service_area}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    pricing: { ...formData.pricing, service_area: e.target.value }
                  })}
                  fullWidth
                  placeholder="e.g., Accra, East Legon"
                />

                <Divider />

                <Typography variant="subtitle1" gutterBottom>Working Hours</Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Start Time"
                    type="time"
                    value={formData.pricing.working_hours.start}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { 
                        ...formData.pricing, 
                        working_hours: { 
                          ...formData.pricing.working_hours, 
                          start: e.target.value 
                        }
                      }
                    })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />

                  <TextField
                    label="End Time"
                    type="time"
                    value={formData.pricing.working_hours.end}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      pricing: { 
                        ...formData.pricing, 
                        working_hours: { 
                          ...formData.pricing.working_hours, 
                          end: e.target.value 
                        }
                      }
                    })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>Available Days</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {WEEKDAYS.map((day) => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Switch
                            checked={formData.pricing.available_days.includes(day)}
                            onChange={(e) => handleAvailableDaysChange(day, e.target.checked)}
                          />
                        }
                        label={day}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </TabPanel>
        )}

        {/* Payment Tab (Workers only) */}
        {profile.role === 'worker' && (
          <TabPanel value={currentTab} index={3}>
            <Box sx={{ px: 3 }}>
              <Stack spacing={3}>
                <Autocomplete
                  value={formData.financial.account_type}
                  onChange={(_, value) => setFormData({ 
                    ...formData, 
                    financial: { ...formData.financial, account_type: value || '' }
                  })}
                  options={ACCOUNT_TYPES}
                  getOptionLabel={(option) => option.replace('_', ' ').toUpperCase()}
                  renderInput={(params) => <TextField {...params} label="Payment Method" />}
                  fullWidth
                />

                {formData.financial.account_type === 'bank' && (
                  <>
                    <TextField
                      label="Bank Name"
                      value={formData.financial.bank_name}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        financial: { ...formData.financial, bank_name: e.target.value }
                      })}
                      fullWidth
                    />

                    <TextField
                      label="Account Name"
                      value={formData.financial.account_name}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        financial: { ...formData.financial, account_name: e.target.value }
                      })}
                      fullWidth
                    />

                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Account Number"
                        value={formData.financial.account_number}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          financial: { ...formData.financial, account_number: e.target.value }
                        })}
                        fullWidth
                      />

                      <TextField
                        label="Routing Number"
                        value={formData.financial.routing_number}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          financial: { ...formData.financial, routing_number: e.target.value }
                        })}
                        fullWidth
                      />
                    </Stack>
                  </>
                )}

                {formData.financial.account_type === 'mobile_money' && (
                  <>
                    <Autocomplete
                      value={formData.financial.mobile_money_provider}
                      onChange={(_, value) => setFormData({ 
                        ...formData, 
                        financial: { ...formData.financial, mobile_money_provider: value || '' }
                      })}
                      options={MOBILE_MONEY_PROVIDERS}
                      getOptionLabel={(option) => option.toUpperCase()}
                      renderInput={(params) => <TextField {...params} label="Mobile Money Provider" />}
                      fullWidth
                    />

                    <TextField
                      label="Mobile Number"
                      value={formData.financial.account_number}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        financial: { ...formData.financial, account_number: e.target.value }
                      })}
                      fullWidth
                      placeholder="Phone number linked to mobile money account"
                    />
                  </>
                )}

                {formData.financial.account_type === 'paypal' && (
                  <TextField
                    label="PayPal Email"
                    value={formData.financial.account_name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      financial: { ...formData.financial, account_name: e.target.value }
                    })}
                    fullWidth
                    type="email"
                  />
                )}
              </Stack>
            </Box>
          </TabPanel>
        )}

        {/* Verification Tab */}
        <TabPanel value={currentTab} index={profile.role === 'worker' ? 4 : 1}>
          <Box sx={{ px: 3 }}>
            <Stack spacing={3}>
              <Alert severity="info">
                Verification helps build trust with {profile.role === 'worker' ? 'clients' : 'workers'} and 
                may be required for certain features.
              </Alert>

              <Autocomplete
                value={formData.verification.id_type}
                onChange={(_, value) => setFormData({ 
                  ...formData, 
                  verification: { ...formData.verification, id_type: value || '' }
                })}
                options={ID_TYPES}
                getOptionLabel={(option) => option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                renderInput={(params) => <TextField {...params} label="ID Document Type" />}
                fullWidth
              />

              {profile.verification?.verification_status && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>Current Status</Typography>
                  <Chip
                    label={profile.verification.verification_status.toUpperCase()}
                    color={
                      profile.verification.verification_status === 'verified' ? 'success' :
                      profile.verification.verification_status === 'pending' ? 'warning' : 'error'
                    }
                    variant="filled"
                  />
                </Box>
              )}
            </Stack>
          </Box>
        </TabPanel>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};