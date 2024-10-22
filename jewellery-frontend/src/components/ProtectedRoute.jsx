// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; 

  return isAdmin ? element : <Navigate to="/" replace />; 
};

export default ProtectedRoute;
