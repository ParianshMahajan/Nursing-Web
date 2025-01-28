import axios from 'axios';
import { API_URL } from './config';
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernLoading from '@/components/ModernLoading';
import useLocalStorage from '@/hooks/useLocalStorage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/extra/verifyAuthToken`);
      const { Role, user: userData } = response.data;

      if (Role === 'Nurse') {
        setRole('nurse');
        setUser(userData);
        navigate('/nurse/dashboard');
      } else if (Role === 'User') {
        setRole('user');
        setUser(userData);
        navigate('/user/dashboard');
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // Attempt to invalidate session on server
        await axios.post(`${API_URL}/auth/logout`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setRole(null);
      delete axios.defaults.headers.common['Authorization'];
      navigate('/');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUser(null);
      setRole(null);
    } else {
      verifyToken();
    }
  }, [token]);

  const value = {
    token,
    user,
    role,
    logout,
    loading,
    setToken,
  };

  if (loading) {
    return <ModernLoading />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };