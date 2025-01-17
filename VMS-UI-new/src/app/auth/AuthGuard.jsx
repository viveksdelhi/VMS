// import { Navigate, useLocation } from "react-router-dom";
// // HOOK
// import useAuth from "app/hooks/useAuth";

// export default function AuthGuard({ children }) {
//   const { isAuthenticated } = useAuth();
//   const { pathname } = useLocation();

//   if (isAuthenticated) return <>{children}</>;

//   return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
// }

import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthGuard = ({ children }) => {
  // Get user_id from cookies
  const userId = Cookies.get("user_id"); // Retrieve user_id from cookies
  const isAuthenticated = !!userId; // Check if user_id exists in cookies

  console.log(isAuthenticated, userId); // Check the authentication status

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
