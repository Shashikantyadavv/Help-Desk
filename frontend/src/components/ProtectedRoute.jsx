import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, isAuthenticated } = useContext(AuthContext);

  // console.log(isAuthenticated, role, user,children, allowedRoles);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  // if (allowedRoles && !allowedRoles.includes(role)) {
  //   return <Navigate to="/login" />; 
  // }

  return children;
};

export default ProtectedRoute;
