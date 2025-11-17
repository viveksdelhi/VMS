import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();

  console.log('ProtectedRoute - Check:', { isAuthenticated, role, loading, allowedRoles });

  if (loading) {
    console.log('ProtectedRoute - Still loading...');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Case-insensitive role matching
  if (allowedRoles.length > 0) {
    const normalizedRole = role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      console.warn(`Access denied: User role "${role}" not in allowed roles:`, allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;



// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>; // Show loading while checking authentication
//   }

//   return isAuthenticated ? children : <Navigate to="/" replace />;
// };

// export default ProtectedRoute;
