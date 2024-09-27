// import { Navigate, useLocation } from "react-router-dom";
// // HOOK
// import useAuth from "app/hooks/useAuth";

// export default function AuthGuard({ children }) {
//   const { isAuthenticated } = useAuth();
//   const { pathname } = useLocation();

//   if (isAuthenticated) return <>{children}</>;

//   return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
// }


import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthGuard = ({ children }) => {
  const token = Cookies.get('authToken');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;

