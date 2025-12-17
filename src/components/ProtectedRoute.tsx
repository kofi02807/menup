// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, render the children (the protected routes)
  if (isAuthenticated) {
    return <Outlet />;
  }

  // If not authenticated, redirect to the login page
  // 'replace: true' prevents the protected route from being in the history stack
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;