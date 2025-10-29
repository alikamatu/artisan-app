"use client";

import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types
interface User {
  id: string;
  email: string;
  name: string;
  is_verified: boolean;
}

interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
}

// Create Auth Context
interface AuthContextType {
  user: any;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<{ ok: boolean }>;
  getAccessToken: () => Promise<string | null>;
  isAuthenticated: () => boolean;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize user from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        if (storedUser && token) {
          // Validate token format
          const parts = token.split('.');
          if (parts.length === 3) {
            setUser(JSON.parse(storedUser));
          } else {
            // Invalid token, clear storage
            clearAuthStorage();
          }
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
        clearAuthStorage();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  };

  const isAuthenticated = () => {
    return !!(user && (localStorage.getItem('access_token') || sessionStorage.getItem('access_token')));
  };

  // Update the login function
  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      const loginData = data as LoginResponse;
      
      // Check if user is verified
      if (!loginData.user.is_verified) {
        // Clear any stored tokens
        clearAuthStorage();
        
        // Redirect to verification page with email parameter
        router.push(`/verify?email=${encodeURIComponent(email)}`);  
        return;
      }
      
      // Validate token format before storing
      if (!loginData.access_token || loginData.access_token.split('.').length !== 3) {
        throw new Error('Invalid token received from server');
      }
      
      // Store tokens and user if verified
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('access_token', loginData.access_token);
      if (loginData.refresh_token) {
        storage.setItem('refresh_token', loginData.refresh_token);
      }
      
      localStorage.setItem('user', JSON.stringify(loginData.user));
      setUser(loginData.user);

      console.log('Login successful, token stored');

    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw for form handling
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      // Check localStorage first, then sessionStorage
      let token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      if (!token) {
        console.log('No token found in storage');
        return null;
      }
      
      // Verify token format (basic JWT validation)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Invalid token format, clearing storage');
        clearAuthStorage();
        setUser(null);
        return null;
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < now) {
          console.log('Token is expired, clearing storage');
          clearAuthStorage();
          setUser(null);
          return null;
        }
      } catch (e) {
        console.log('Could not decode token payload, but returning token for server validation');
        return token;
      }
      
      return token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    router.push('/');
  };

  const forgotPassword = async (email: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}/auth/request-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to send reset email');
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      // Handle successful responses
      if (response.status === 200 || response.status === 201) {
        return await response.json();
      }
      
      // Handle error responses
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Password reset failed');
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password_hash: password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    // Don't set user or tokens here since they need to verify email first
    return data;
  };

  // Don't render children until auth initialization is complete
  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      register, 
      login, 
      logout, 
      forgotPassword, 
      resetPassword, 
      getAccessToken,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}