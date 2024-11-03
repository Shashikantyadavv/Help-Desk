import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);  
  const navigate = useNavigate();

  const token = localStorage.getItem('token') || null;
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if(user){
      setUser(user);
      setRole(user.role);
    }
  },[])
  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setRole(user.role); 
      localStorage.setItem('user',JSON.stringify(user));

      if (user.role === 'Customer') {
        navigate('/customer');
      } else if (user.role === 'Agent') {
        navigate('/agent');
      } else if (user.role === 'Admin') {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setRole(null);
    navigate('/login');
  };

  const isAuthenticated = Boolean(token);
  // console.log(user, isAuthenticated,role);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
