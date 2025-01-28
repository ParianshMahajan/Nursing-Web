import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '@/api/config';

const InputField = ({ label, type, name, value, onChange, required }) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder=" "
      className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
    />
    <label
      htmlFor={name}
      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 peer-focus:text-blue-600"
    >
      {label}
    </label>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Sending your message...');
    
    try {
      const response = await axios.post(`${API_URL}/contact/send`, formData);
      
      if (response.data.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon.', {
          id: toastId,
          duration: 5000,
          icon: '✉️'
        });
        resetForm();
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      toast.error(errorMessage, {
        id: toastId,
        duration: 5000,
        icon: '❌'
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-20 py-12 px-4 sm:px-6 lg:px-8">
      {/* Contact Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start space-x-4 group">
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Address</h3>
                <p className="mt-1 text-gray-600">Rajpura, Chitkara, Punjab</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4 group">
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                <p className="mt-1 text-gray-600">+91 7876768113</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4 group">
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email</h3>
                <a href="mailto:parianshm@gmail.com" className="mt-1 text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  parianshm@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              label="Subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <textarea
                name="message"
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder=" "
                className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer resize-none"
              />
              <label
                htmlFor="message"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 peer-focus:text-blue-600"
              >
                Message
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
