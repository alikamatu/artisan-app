'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  Alert, 
  Divider, 
  Checkbox,
  IconButton,
  InputAdornment,
  CircularProgress,
  Box,
  FormControlLabel
} from '@mui/material';
import { 
  LogIn, 
  Mail, 
  Lock, 
  UserPlus, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Facebook,
  Github
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Validation schema
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

const handleLoginSuccess = () => {
  setShowSuccess(true);
  
  // Get the current user from localStorage to check role
  setTimeout(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        // Check if user has a role - redirect based on role presence
        if (!userData.role || userData.role.trim() === '') {
          router.push('/onboard');
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        // Fallback to sign-up if there's an error
        router.push('/sign-up');
      }
    } else {
      // Fallback if no stored user found
      router.push('/sign-up');
    }
  }, 1500);
};

const onSubmit = async (data: FormData) => {
  setIsLoading(true);
  setShowError('');
  
  try {
    // Use the auth context login method
    await login(data.email, data.password, rememberMe);
    
    // If we reach this point, login was successful and user is verified
    handleLoginSuccess();
  } catch (error: any) {
    console.error('Login error:', error);
    
    // The AuthContext already handles unverified user redirect,
    // so we only need to handle other errors here
    setShowError(error.message || 'Invalid email or password');
  } finally {
    setIsLoading(false);
  }
};

  const handleGoogleSignIn = async () => {
    try {
      setShowError('Google sign-in is coming soon!');
    } catch (error) {
      setShowError('Google sign-in failed');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setShowError('Facebook sign-in is coming soon!');
    } catch (error) {
      setShowError('Facebook sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="absolute top-6 left-6">
        <Button
          variant="text"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => router.push('/')}
          className="text-indigo-600 hover:bg-indigo-50"
        >
          Back to Home
        </Button>
      </div>
      
      <AnimatePresence>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full max-w-md"
        >
          <Card className="rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <CardContent className="p-8 relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-blue-400 opacity-10"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-purple-400 opacity-10"></div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
                  <div className="bg-white p-2 rounded-full">
                    <Lock className="text-indigo-600" size={24} />
                  </div>
                </div>
                
                <Typography variant="h4" className="font-bold text-gray-800 mb-1">
                  Welcome Back
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  Sign in to continue to your account
                </Typography>
              </motion.div>

              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <Alert severity="success" className="rounded-lg border border-green-200">
                      Signed in successfully! Redirecting...
                    </Alert>
                  </motion.div>
                )}
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <Alert severity="error" className="rounded-lg border border-red-200">
                      {showError}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.2 }}
                >
                  <TextField
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <Mail className="mr-2 text-gray-500" size={20} />
                      ),
                    }}
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    className="bg-gray-50 rounded-lg"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.3 }}
                >
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <Lock className="mr-2 text-gray-500" size={20} />
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    className="bg-gray-50 rounded-lg"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-between items-center"
                >
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Remember me"
                    className="text-sm"
                  />
                  
                  <Button 
                    variant="text" 
                    size="small"
                    onClick={() => router.push('/forgot-password')}
                    className="text-indigo-600 hover:bg-indigo-50 text-sm"
                  >
                    Forgot password?
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    startIcon={isLoading ? null : <LogIn size={18} />}
                    className="py-3 font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} className="text-white" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6 }}
                className="my-6 flex items-center"
              >
                <Divider className="flex-1 bg-gray-200" />
                <Typography variant="body2" className="mx-4 text-gray-500">
                  or continue with
                </Typography>
                <Divider className="flex-1 bg-gray-200" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-2 gap-3"
              >
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleGoogleSignIn}
                  className="py-3 font-medium rounded-lg border-gray-300 hover:border-gray-400"
                  startIcon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="mr-2"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.32 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  }
                >
                  Google
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleFacebookSignIn}
                  className="py-3 font-medium rounded-lg border-gray-300 hover:border-gray-400"
                  startIcon={<Facebook className="text-blue-600" size={20} />}
                >
                  Facebook
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center"
              >
                <Typography variant="body2" className="text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Button
                    color="primary"
                    onClick={() => router.push('/sign-up')}
                    startIcon={<UserPlus size={16} />}
                    className="font-medium"
                  >
                    Create account
                  </Button>
                </Typography>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}