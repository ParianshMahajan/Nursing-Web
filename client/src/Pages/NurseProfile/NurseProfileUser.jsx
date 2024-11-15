import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_URL } from '@/api/config';
import { AuthContext } from '@/api/auth';

export function NurseProfileUser({ nurseId }) {
  const { token } = useContext(AuthContext);
  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState(false);

  // Fetch nurse profile data
  useEffect(() => {
    const fetchNurseProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/getNurseProfile/${nurseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status) {
          setNurse(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to load nurse profile');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchNurseProfile();
    } else {
      setError('Please log in to view this profile');
      setLoading(false);
    }
  }, [nurseId, token]);

  // Handle request submission
  const handleSendRequest = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/user/create-request`,
        { nurseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setIsRequestSent(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to send request');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <img
              src={nurse.ImgUrl || '/placeholder.svg'}
              alt={nurse.Name}
              className="rounded-full w-32 h-32"
            />
            <div>
              <h1 className="text-2xl font-bold">{nurse.Name}</h1>
              <p>{nurse.Address}</p>
              <p>{nurse.Email}</p>
              <p>{nurse.PhoneNumber}</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">About Me</h2>
            <p>{nurse.AboutMe}</p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Skills</h2>
            <p>{nurse.Skills.join(', ')}</p>
          </div>
          <div className="mt-6">
            {isRequestSent ? (
              <p className="text-green-500 font-bold">Request sent successfully!</p>
            ) : (
              <Button onClick={handleSendRequest} disabled={!token} className="bg-sky-700 text-white mt-4">
                {token ? 'Send Request' : 'Log in to send a request'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NurseProfileUser;
