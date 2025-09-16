"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Stack,
  Box
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

// Schema for form validation
const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function SignUpForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset  // Add reset function
  } = useForm({
    resolver: zodResolver(signUpSchema)
  });
  const { register: authRegister } = useAuth();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      await authRegister(data.name, data.phone, data.email, data.password);
      onSuccess(data.email);  // Pass email to success handler
      reset();  // Reset form after successful submission
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ py: 4 }}>
      <Stack spacing={3}>
        <TextField
          {...register('name')}
          label="Full Name"
          variant="outlined"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          {...register('email')}
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          {...register('phone')}
          label="Phone Number"
          type="tel"
          variant="outlined"
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />

        <TextField
          {...register('password')}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          {...register('confirmPassword')}
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <Box textAlign="center">
          <p className="text-gray-600 text-sm">
            By signing up, you agree to our
            <a href="#" className="text-blue-600 hover:underline ml-1">Terms of Service</a> and
            <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
          </p>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Create Account'
          )}
        </Button>

        <Box>
          <p>Already have an account?  <a href="/sign-in" className="text-blue-600 hover:underline">Sign In</a></p>
        </Box>

      </Stack>
    </Box>
  );
}
