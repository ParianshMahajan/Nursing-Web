import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/api/config';
import { toast } from 'react-hot-toast';
import OpenStreetMapInput from '@/components/OpenStreetMapInput';

export function SignUpApartment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedApartmentImages, setUploadedApartmentImages] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    aboutMe: '',
    price: '',
    imgUrl: null,
    apartmentImages: [],
    address: '',
    coords: null,
    conditions: {
      petsAllowed: false,
      smokingAllowed: false,
      furnished: false
    }
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number should be 10 digits";
    }

    if (!formData.aboutMe) {
      newErrors.aboutMe = "About the apartment is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
    }

    if (!formData.imgUrl) {
      newErrors.imgUrl = "Profile photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('condition_')) {
      const conditionName = name.replace('condition_', '');
      setFormData(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          [conditionName]: checked
        }
      }));
    } else if (type === 'file' && name === 'imgUrl') {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, imgUrl: file }));
      setUploadedImage(URL.createObjectURL(file));
    } else if (type === 'file' && name === 'apartmentImages') {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, apartmentImages: files }));
      setUploadedApartmentImages(files.map(file => URL.createObjectURL(file)));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressChange = ({ coords, address }) => {
    setFormData(prev => ({ ...prev, address, coords }));
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatusMessage({ type: '', message: '' });

    try {
      const formDataToSend = new FormData();
      
      // Append basic fields (excluding files and conditions)
      Object.keys(formData).forEach(key => {
        if (key !== 'imgUrl' && key !== 'apartmentImages' && key !== 'conditions') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append profile image if exists
      if (formData.imgUrl) {
        formDataToSend.append('imgUrl', formData.imgUrl);
      }

      // Append apartment images if any
      formData.apartmentImages.forEach(image => {
        formDataToSend.append('apartmentImages', image);
      });

      // Append conditions as JSON string
      formDataToSend.append('conditions', JSON.stringify(formData.conditions));

      const response = await axios.post(`${API_URL}/apartment/signup`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status) {
        toast.success('Signup successful! Please login.');
        setStatusMessage({
          type: 'success',
          message: 'Account created successfully! Redirecting...'
        });
        setTimeout(() => {
          navigate('/login/apartment');
        }, 1500);
      }
    } catch (error) {
      let errorMessage = 'An error occurred during signup';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = 'Email already exists';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid input data';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection';
      }

      setStatusMessage({
        type: 'error',
        message: errorMessage
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Left side - Hero Section */}
      <div className="w-[70%] h-full relative hidden md:flex justify-center items-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop")' }}>
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 text-white text-center max-w-xl p-8">
          <h1 className="text-4xl font-bold mb-4">List Your Apartment</h1>
          <p className="text-lg text-teal-50">
            Join our network of property owners and start hosting today.
          </p>
        </div>
      </div>

      {/* Right side - Form Section */}
      <div className="w-full md:w-[30%] h-full bg-gradient-to-b from-sky-50 to-teal-50 flex flex-col justify-start items-center px-6 pt-6 overflow-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          <div className="text-center mb-8 mt-12">
            <h2 className="text-3xl font-bold text-teal-800">APARTMENT SIGNUP</h2>
          </div>

          {statusMessage.message && (
            <Alert variant={statusMessage.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{statusMessage.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mx-auto w-[70%]">
            {/* Profile Photo */}
            <div className="space-y-2">
              <Label htmlFor="imgUrl" className="text-sm font-medium text-teal-700">Profile Photo</Label>
              <Input
                id="imgUrl"
                type="file"
                name="imgUrl"
                onChange={handleChange}
                accept="image/*"
                className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.imgUrl ? 'border-red-500' : 'border-teal-200'}`}
              />
              {errors.imgUrl && <p className="text-red-500 text-sm">{errors.imgUrl}</p>}
              {uploadedImage && (
                <img src={uploadedImage} alt="Profile" className="mt-2 h-20 w-20 object-cover rounded-full" />
              )}
            </div>

            {/* Apartment Images */}
            <div className="space-y-2">
              <Label htmlFor="apartmentImages" className="text-sm font-medium text-teal-700">Apartment Images</Label>
              <Input
                id="apartmentImages"
                type="file"
                name="apartmentImages"
                onChange={handleChange}
                accept="image/*"
                multiple
                className="px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              <div className="flex gap-2 flex-wrap mt-2">
                {uploadedApartmentImages.map((image, index) => (
                  <img key={index} src={image} alt={`Apartment ${index + 1}`} className="h-20 w-20 object-cover rounded-lg" />
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-teal-700">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.name ? 'border-red-500' : 'border-teal-200'}`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                  placeholder="••••••••"
                  className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.password ? 'border-red-500' : 'border-teal-200'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" tabIndex="-1">
                  {showPassword ? <EyeOffIcon className="h-5 w-5 text-teal-500" /> : <EyeIcon className="h-5 w-5 text-teal-500" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-teal-700">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.confirmPassword ? 'border-red-500' : 'border-teal-200'}`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" tabIndex="-1">
                  {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-teal-500" /> : <EyeIcon className="h-5 w-5 text-teal-500" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
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
                placeholder="john@example.com"
                className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.email ? 'border-red-500' : 'border-teal-200'}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-teal-700">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="1234567890"
                className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.phoneNumber ? 'border-red-500' : 'border-teal-200'}`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>

            {/* About the Apartment */}
            <div className="space-y-2">
              <Label htmlFor="aboutMe" className="text-sm font-medium text-teal-700">About the Apartment</Label>
              <Textarea
                id="aboutMe"
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="Describe your apartment..."
                rows={3}
                className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.aboutMe ? 'border-red-500' : 'border-teal-200'}`}
              />
              {errors.aboutMe && <p className="text-red-500 text-sm">{errors.aboutMe}</p>}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-teal-700">Price per Night</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 1200"
                className={`px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.price ? 'border-red-500' : 'border-teal-200'}`}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-teal-700">Address</Label>
              <OpenStreetMapInput onSelectAddress={handleAddressChange} />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            {/* Conditions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-teal-700">Conditions</Label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="condition_petsAllowed"
                    checked={formData.conditions.petsAllowed}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Pets Allowed</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="condition_smokingAllowed"
                    checked={formData.conditions.smokingAllowed}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Smoking Allowed</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="condition_furnished"
                    checked={formData.conditions.furnished}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Furnished</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="w-full flex justify-center py-2 px-4">
                {isLoading ? "Submitting..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
