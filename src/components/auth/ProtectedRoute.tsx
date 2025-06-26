import React from 'react';
import { Navigate } from 'react-router-dom';
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}
const ProtectedRoute = ({
  children,
  adminOnly = false
}: ProtectedRouteProps) => {
  // Mock authentication state - in a real app, use context or Redux
  const isAuthenticated = true; // For demo purposes
  const userRole = 'user'; // Could be "admin" or "user"
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // @ts-ignore
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;