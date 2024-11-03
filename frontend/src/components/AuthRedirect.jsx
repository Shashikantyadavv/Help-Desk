// src/components/AuthRedirect.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthRedirect = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  console.log(user,isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'Customer':
      return <Navigate to="/customer" />;
    case 'Agent':
      return <Navigate to="/agent" />;
    case 'Admin':
      return <Navigate to="/admin" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default AuthRedirect;
