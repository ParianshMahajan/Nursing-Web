import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/api/config';
import { Alert, AlertDescription } from "@/components/ui/alert";
import useLocalStorage from '@/hooks/useLocalStorage';

const Login = () => {
  const { type } = useParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [token, setToken] = useLocalStorage("token", null);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // OTP validation when visible
    if (isOTPSent && !formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (isOTPSent && !/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isOTPSent]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle login attempt
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatusMessage({ type: '', message: '' });

    try {
      const response = await axios.post(`${API_URL}/${type}/sendOTP`, {
        Email: formData.email,
        Password: formData.password
      });
      
      if (response.data.status) {
        setIsOTPSent(true);
        setStatusMessage({ 
          type: 'success', 
          message: response.data.message || 'OTP sent successfully' 
        });
      } else {
        setStatusMessage({ 
          type: 'error', 
          message: response.data.message || 'Failed to send OTP' 
        });
      }
    } catch (error) {
      setStatusMessage({ 
        type: 'error', 
        message: error.response?.data?.message || 'An error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatusMessage({ type: '', message: '' });

    try {
      const response = await axios.post(`${API_URL}/${type}/verifyOTP`, {
        Email: formData.email,
        Password: formData.password,
        OTP: formData.otp
      });
      
      if (response.data.status) {
        setToken(response.data.token);
        setStatusMessage({
          type: 'success', 
          message: 'Login successful. Redirecting...' 
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setStatusMessage({ 
          type: 'error', 
          message: 'Invalid OTP. Please try again.' 
        });
      }
    } catch (error) {
      setStatusMessage({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to verify OTP' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Left side */}
      <div className="w-[70%] h-full relative hidden md:flex justify-center items-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
             style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576765607924-3f7b8410a787?q=80&w=1475&auto=format&fit=crop")' }}>
          <div className="absolute inset-0" style={{backgroundColor: "rgba(0,0,0,0.7)"}} />
        </div>
        <div className="relative z-10 text-white text-center max-w-xl p-8">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg text-teal-50">Access your account securely with our two-step verification process.</p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-[30%] h-full bg-gradient-to-b from-sky-50 to-teal-50 flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-teal-800">
              {type.toUpperCase()} LOGIN
            </h2>
          </div>

          {statusMessage.message && (
            <Alert variant={statusMessage.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>
                {statusMessage.message}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={isOTPSent ? handleVerifyOTP : handleLogin} className="space-y-6 w-[70%] mx-auto">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                  errors.email ? 'border-red-500' : 'border-teal-200'
                }`}
                placeholder="email@example.com"
                disabled={isOTPSent}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.password ? 'border-red-500' : 'border-teal-200'
                  }`}
                  placeholder="••••••••"
                  disabled={isOTPSent}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-teal-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-teal-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {isOTPSent && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-teal-700">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.otp ? 'border-red-500' : 'border-teal-200'
                  }`}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                isOTPSent ? "VERIFY OTP" : "LOGIN"
              )}
            </button>

            <p className="text-center text-sm text-teal-600">
              Don't have an account?{" "}
              <a
                href={`/signup/${type}`}
                className="font-medium text-teal-700 hover:text-teal-800 underline"
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;