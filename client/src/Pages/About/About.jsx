import React from 'react';
import { FaUserNurse, FaHandHoldingMedical, FaHospitalUser, FaMobileAlt } from 'react-icons/fa';
import { BsShieldCheck, BsClock } from 'react-icons/bs';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Transforming Healthcare Access
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Connecting qualified nursing professionals with patients for personalized care delivery
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            To revolutionize healthcare accessibility by creating a seamless platform that connects patients 
            with skilled nursing professionals, ensuring quality care reaches every doorstep.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <FaUserNurse className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Professionals</h3>
            <p className="text-gray-600">
              All nursing professionals undergo thorough background checks and credential verification
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <FaHandHoldingMedical className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Care</h3>
            <p className="text-gray-600">
              Customized care plans tailored to individual patient needs and preferences
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <BsShieldCheck className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Platform</h3>
            <p className="text-gray-600">
              Advanced security measures to protect patient and professional data
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <FaMobileAlt className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Simple and intuitive booking process with real-time availability
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <BsClock className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Round-the-clock assistance for both patients and nursing professionals
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <FaHospitalUser className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
            <p className="text-gray-600">
              Regular monitoring and feedback system to maintain high service standards
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Contact Information</h2>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Created by</h3>
              <p className="text-lg text-gray-700 font-medium">Tapowan Team</p>
              <address className="text-gray-600 not-italic mt-2">
                8F<br />
                North Avenue, Bhadson Road<br />
                Patiala, Punjab, 147001<br />
                India
              </address>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600">Registered Nurses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
            <div className="text-gray-600">Satisfied Patients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Cities Covered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
