import React from 'react';

const ProtectedRoute = ({ children }) => {
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
