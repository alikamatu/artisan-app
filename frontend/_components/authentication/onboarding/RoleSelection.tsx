"use client";

import { Card, CardContent, Typography, Button, Box, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { Building2, UserCheck, ArrowRight } from 'lucide-react';
import { useState } from 'react';

type RoleSelectionProps = {
  onSelect: (role: 'client' | 'worker') => void;
};

const RoleSelection = ({ onSelect }: RoleSelectionProps) => {
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState<'client' | 'worker' | null>(null);

  const handleRoleSelect = (role: 'client' | 'worker') => {
    setSelectedRole(role);
    setTimeout(() => onSelect(role), 300);
  };

  const roles = [
    {
      id: 'client',
      title: "I'm a Client",
      description: "Hire skilled professionals",
      icon: Building2,
      color: '#1a73e8',
      buttonText: "Continue as Client"
    },
    {
      id: 'worker',
      title: "I'm a Worker", 
      description: "Offer professional services",
      icon: UserCheck,
      color: '#34a853',
      buttonText: "Continue as Worker"
    }
  ];

  return (
    <Box
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 400,
            color: theme.palette.text.primary,
            mb: 1
          }}
        >
          Choose your role
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary
          }}
        >
          Select how you'd like to use the platform
        </Typography>
      </Box>

      {/* Role Cards */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
          maxWidth: 600,
          width: '100%'
        }}
      >
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: selectedRole === role.id 
                  ? `2px solid ${role.color}`
                  : '1px solid #dadce0',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => handleRoleSelect(role.id as 'client' | 'worker')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: role.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}
                >
                  <role.icon size={28} color="white" />
                </Box>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    mb: 1
                  }}
                >
                  {role.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    mb: 3
                  }}
                >
                  {role.description}
                </Typography>

                <Button
                  variant={selectedRole === role.id ? "contained" : "outlined"}
                  fullWidth
                  sx={{
                    borderRadius: 1,
                    borderColor: role.color,
                    backgroundColor: selectedRole === role.id ? role.color : 'transparent',
                    color: selectedRole === role.id ? 'white' : role.color,
                    '&:hover': {
                      backgroundColor: selectedRole === role.id ? role.color : alpha(role.color, 0.1)
                    }
                  }}
                  endIcon={<ArrowRight size={16} />}
                >
                  {role.buttonText}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Footer */}
      <Typography 
        variant="body2" 
        sx={{ 
          textAlign: 'center', 
          mt: 4,
          color: theme.palette.text.secondary,
          maxWidth: 400
        }}
      >
        You can switch between roles in account settings anytime.
      </Typography>
    </Box>
  );
};

export default RoleSelection;