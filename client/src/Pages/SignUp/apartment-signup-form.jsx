import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api/config';
import { toast } from 'react-hot-toast';

export const SignUpApartment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    PhoneNumber: '',
    AboutMe: '',
    Price: '',
    ImgUrl: null,
    ApartmentImages: [],
    Conditions: {
      petsAllowed: false,
      smokingAllowed: false,
      furnished: false
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('condition_')) {
      const conditionName = name.replace('condition_', '');
      setFormData(prev => ({
        ...prev,
        Conditions: {
          ...prev.Conditions,
          [conditionName]: checked
        }
      }));
    } else if (type === 'file' && name === 'ImgUrl') {
      setFormData(prev => ({
        ...prev,
        ImgUrl: e.target.files[0]
      }));
    } else if (type === 'file' && name === 'ApartmentImages') {
      setFormData(prev => ({
        ...prev,
        ApartmentImages: Array.from(e.target.files)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
      Object.keys(formData).forEach(key => {
        if (key !== 'ImgUrl' && key !== 'ApartmentImages' && key !== 'Conditions') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append profile image
      if (formData.ImgUrl) {
        formDataToSend.append('ImgUrl', formData.ImgUrl);
      }

      // Append apartment images
      formData.ApartmentImages.forEach(image => {
        formDataToSend.append('ApartmentImages', image);
      });

      // Append conditions as JSON string
      formDataToSend.append('Conditions', JSON.stringify(formData.Conditions));

      const response = await axios.post(`${API_URL}/apartment/signup`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status) {
        toast.success('Signup successful! Please login.');
        navigate('/login/apartment');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as an Apartment Owner
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="Name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.Name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="Email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.Email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="Password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.Password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="ConfirmPassword"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.ConfirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="PhoneNumber"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.PhoneNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                About the Apartment
              </label>
              <textarea
                name="AboutMe"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.AboutMe}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price per Night
              </label>
              <input
                type="number"
                name="Price"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={formData.Price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                name="ImgUrl"
                accept="image/*"
                className="mt-1 block w-full"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Apartment Images
              </label>
              <input
                type="file"
                name="ApartmentImages"
                accept="image/*"
                multiple
                className="mt-1 block w-full"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Conditions
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="condition_petsAllowed"
                    checked={formData.Conditions.petsAllowed}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Pets Allowed</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="condition_smokingAllowed"
                    checked={formData.Conditions.smokingAllowed}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Smoking Allowed</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="condition_furnished"
                    checked={formData.Conditions.furnished}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Furnished</span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
