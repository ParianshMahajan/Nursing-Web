import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../api/auth";
import axios from "axios";
import { API_URL } from "../../../api/config";
import { FiUser, FiMail, FiPhone, FiMapPin, FiClock, FiX } from "react-icons/fi";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

const UserDash = () => {
  const { user, token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const profileResponse = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (profileResponse.data.success) {
          setProfile(profileResponse.data.data);
        }

        // Fetch all requests
        const requestsResponse = await axios.get(`${API_URL}/user/all-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (requestsResponse.data.status) {
          setRequests(requestsResponse.data.requests || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleWithdrawRequest = async (requestId) => {
    try {
      const response = await axios.get(`${API_URL}/user/withdraw-request/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        toast.success("Request withdrawn successfully");
        // Update requests list
        setRequests(requests.filter(req => req._id !== requestId));
      } else {
        toast.error(response.data.message || "Failed to withdraw request");
      }
    } catch (error) {
      console.error("Error withdrawing request:", error);
      toast.error("Failed to withdraw request");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Accepted';
      case 2:
        return 'Rejected';
      case 3:
        return 'Completed';
      default:
        return 'Withdrawn';
    }
  };

  const renderRequests = () => {
    const nurseRequests = requests.filter(req => req.RequestType === 'nurse');
    const apartmentRequests = requests.filter(req => req.RequestType === 'apartment');

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Nurse Requests</h3>
          {nurseRequests.length === 0 ? (
            <p>No nurse requests found.</p>
          ) : (
            <div className="space-y-4">
              {nurseRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium">
                        Request for {request.NurseId?.Name || "Unknown Nurse"}
                      </h4>
                      <div className="mt-2 space-y-2 text-gray-600">
                        <p className="flex items-center">
                          <FiMapPin className="mr-2" />
                          {request.Location}
                        </p>
                        <p className="flex items-center">
                          <FiClock className="mr-2" />
                          Duration: {request.Duration} days
                        </p>
                        <p>Status: {getStatusText(request.Status)}</p>
                      </div>
                    </div>
                    {request.Status === 0 && (
                      <button
                        onClick={() => handleWithdrawRequest(request._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX size={24} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Apartment Requests</h3>
          {apartmentRequests.length === 0 ? (
            <p>No apartment requests found.</p>
          ) : (
            <div className="space-y-4">
              {apartmentRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium">
                        Request for {request.ApartmentId?.Name || "Unknown Apartment"}
                      </h4>
                      <div className="mt-2 space-y-2 text-gray-600">
                        <p className="flex items-center">
                          <FiClock className="mr-2" />
                          Check-in: {format(new Date(request.CheckInDate), 'PPP')}
                        </p>
                        <p className="flex items-center">
                          <FiClock className="mr-2" />
                          Check-out: {format(new Date(request.CheckOutDate), 'PPP')}
                        </p>
                        <p>Status: {getStatusText(request.Status)}</p>
                      </div>
                    </div>
                    {request.Status === 0 && (
                      <button
                        onClick={() => handleWithdrawRequest(request._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX size={24} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      {/* User Profile Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center">
              {profile?.ImgUrl ? (
                <img 
                  src={profile.ImgUrl} 
                  alt={profile?.Name} 
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <FiUser className="h-10 w-10 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profile?.Name || user?.name || "User"}!
              </h1>
              <p className="text-gray-500 mt-1">Manage your healthcare requests and profile</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FiMail className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile?.Email || user?.email || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FiPhone className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{profile?.PhoneNumber || user?.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FiMapPin className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{profile?.Address || user?.location || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderRequests()}
        </div>
      </div>
    </div>
  );
};

export default UserDash;
