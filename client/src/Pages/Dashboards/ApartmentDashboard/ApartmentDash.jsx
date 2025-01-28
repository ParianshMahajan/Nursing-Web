import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../api/auth';
import axios from 'axios';
import { API_URL } from '../../../api/config';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const ApartmentDash = () => {
  const { token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch apartment profile
        const profileResponse = await axios.get(`${API_URL}/apartment/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (profileResponse.data.success) {
          setProfile(profileResponse.data.data);
        }

        // Fetch all booking requests
        const requestsResponse = await axios.get(`${API_URL}/apartment/requests/${profileResponse.data.data._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (requestsResponse.data.status) {
          setRequests(requestsResponse.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleRequestAction = async (requestId, status) => {
    try {
      await axios.patch(
        `${API_URL}/apartment/booking-status`,
        { requestId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === requestId ? { ...req, Status: status } : req
        )
      );

      toast.success(status === 1 ? 'Request accepted' : 'Request rejected');
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
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
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Apartment Profile</h2>
          {profile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={profile.ImgUrl}
                  alt={profile.Name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{profile.Name}</h3>
                <p className="text-gray-600">{profile.AboutMe}</p>
                <p className="text-lg font-medium">Price: ${profile.Price}/night</p>
                <div className="space-y-2">
                  <h4 className="font-medium">Conditions:</h4>
                  <ul className="list-disc list-inside">
                    {profile.Conditions && Object.entries(profile.Conditions).map(([key, value]) => (
                      value && <li key={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Requests Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Booking Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No booking requests found</p>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">
                        Request from {request.UserId?.Name || 'Unknown User'}
                      </h3>
                      <div className="mt-2 space-y-2 text-gray-600">
                        <p>Check-in: {format(new Date(request.CheckInDate), 'PPP')}</p>
                        <p>Check-out: {format(new Date(request.CheckOutDate), 'PPP')}</p>
                        <p>Status: {getStatusText(request.Status)}</p>
                        {request.Requirements?.length > 0 && (
                          <div>
                            <p className="font-medium">Special Requirements:</p>
                            <ul className="list-disc list-inside">
                              {request.Requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    {request.Status === 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRequestAction(request._id, 1)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(request._id, 2)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartmentDash;
