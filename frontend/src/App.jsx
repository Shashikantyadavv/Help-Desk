import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Customers from './pages/Customers';
import Agent from './pages/Agent';
import Admin from './pages/Admin';
import AuthRedirect from './components/AuthRedirect';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <AuthRedirect />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <Agent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />


        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

