import { useContext, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import GoogleMapInput from '@/components/GoogleMapInput';
import axios from 'axios';
import { API_URL } from '@/api/config';
import { AuthContext } from '@/api/auth';

export function SignUpUser() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
    location: ''
  });
    


  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number should be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;



    setIsLoading(true);
    setStatusMessage({ type: '', message: '' });

    try {
      const response = await axios.post(API_URL + '/user/create', {
        ...formData,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setStatusMessage({
          type: 'success',
          message: 'Account created successfully! Redirecting...'
        });
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 1500);
      }

    } catch (error) {
      let errorMessage = 'An error occurred during signup ' + error.message;

      // Handle specific error cases
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = 'Email already exists';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid input data';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid OTP';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection';
      }

      setStatusMessage({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Left side - Hero Section */}
      <div className="w-[70%] h-full relative hidden md:flex justify-center items-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576765607924-3f7b8410a787?q=80&w=1475&auto=format&fit=crop")' }}>
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} />
        </div>
        <div className="relative z-10 text-white text-center max-w-xl p-8">
          <h1 className="text-4xl font-bold mb-4">Create Your Account</h1>
          <p className="text-lg text-teal-50">Join our community and start your journey with us today.</p>
        </div>
      </div>

      {/* Right side - Form Section */}
      <div className="w-full md:w-[30%] h-full bg-gradient-to-b from-sky-50 to-teal-50 flex flex-col justify-center items-center px-6 overflow-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-teal-800">SIGN UP</h2>
          </div>

          {statusMessage.message && (
            <Alert variant={statusMessage.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{statusMessage.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 w-[70%] mx-auto h-[50vh]">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-teal-700">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.name ? 'border-red-500' : 'border-teal-200'
                  }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-teal-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.password ? 'border-red-500' : 'border-teal-200'
                    }`}
                  placeholder="••••••••"
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
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-teal-700">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.confirmPassword ? 'border-red-500' : 'border-teal-200'
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-teal-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-teal-500" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-teal-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.email ? 'border-red-500' : 'border-teal-200'
                  }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-teal-700">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.phoneNumber ? 'border-red-500' : 'border-teal-200'
                  }`}
                placeholder="1234567890"
                maxLength={10}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-teal-700">Address</Label>
              <GoogleMapInput

              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "SIGN UP"
              )}
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-teal-600 pb-10">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-teal-700 hover:text-teal-800 underline"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
