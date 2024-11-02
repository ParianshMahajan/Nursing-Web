import axios from 'axios';
import { API_URL } from './config';
import { createContext, useState, useEffect } from 'react';


const registerAPI = async (data) => {
  const response = await axios.post(`${API_URL}/nurse/create`, data);

  if (response.data) {
    localStorage.setItem('nurse', JSON.stringify(response.data));
  }

  return response.data;
};

const logoutAPI = () => {
  localStorage.removeItem('nurse');
};


const NurseAuthContext = createContext();

const NurseAuthProvider = ({ children }) => {
  const [nurse, setNurse] = useState(() => {
    const storedNurse = localStorage.getItem('nurse');
    return storedNurse ? JSON.parse(storedNurse) : null;
  });

  const register = async (data) => {
    const response = await registerAPI(data);
    if (response) {
      setNurse(response);
    }
  };

  const logout = () => {
    logoutAPI();
    setNurse(null);
  };

  return (
    <NurseAuthContext.Provider value={{ nurse, register, logout }}>
      {children}
    </NurseAuthContext.Provider>
  );
};

export { NurseAuthProvider, NurseAuthContext };










// const { register } = useContext(NurseAuthContext);
// use in child like a state