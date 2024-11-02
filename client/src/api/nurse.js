// auth/api.js
import axios from 'axios';


const register = async (data) => {
  const response = await axios.post(`${API_URL}/nurse/create`, data);

  if (response.data) {
    localStorage.setItem('nurse', JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem('nurse');
};

const authService = {
  register,
  logout,
};

export default authService;