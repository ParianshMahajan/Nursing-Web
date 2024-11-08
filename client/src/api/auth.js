import axios from 'axios';
import { API_URL } from './config';
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if(!token){
      navigate('/');
    }
    else{
      const verifyToken = async () => {
        try {
          const response = await axios.post(`${API_URL}/extra/verifyAuthToken`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status !== 200) {
            logout();
            console.log('Token expired');
          }
          else{
            console.log(response.data);
            var role = response.data.Role;
            if(role === 'Nurse'){
              setLoading(false);
              navigate('/nurse/dashboard');
            }
            else if(role === 'User'){
              setLoading(false);
              navigate('/user/dashboard');
            }
            else{
              logout();
            }
          }
        } catch (error) {
          logout();
        }
      };
    }
    
  },
    [token]
  );


  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{token, logout }}>
      {loading && <ModernLoading/>}
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };










// const { register } = useContext(AuthContext);
// use in child like a state