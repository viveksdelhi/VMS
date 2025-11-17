import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

// Create a Context for Auth
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // 👈 Add role state

  useEffect(() => {
    const token = Cookies.get('token');
    const savedRole = Cookies.get('role'); // 👈 Read role from cookies

    console.log('AuthContext - Initializing:', { hasToken: !!token, role: savedRole });

    if (token) {
      setIsAuthenticated(true);
      setRole(savedRole || null); // Set role if available
      console.log('AuthContext - Authenticated with role:', savedRole);
    } else {
      console.log('AuthContext - No token found');
    }

    setLoading(false);
  }, []);

  const login = (token, role) => {
    console.log('AuthContext - Login called:', { hasToken: !!token, role });
    Cookies.set('token', token);
    Cookies.set('role', role); // 👈 Save role in cookies
    setIsAuthenticated(true);
    setRole(role);
    console.log('AuthContext - Login complete, authenticated:', true, 'role:', role);
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('role'); // 👈 Remove role too
    Cookies.remove('puid');
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);








// import React, { createContext, useState, useContext, useEffect } from 'react';
// import Cookies from 'js-cookie'; // Import js-cookie

// // Create a Context for Auth
// const AuthContext = createContext();

// // Create a provider component
// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if there is a token in cookies
//     const token = Cookies.get('token'); // Use js-cookie to get the token
//     if (token) {
//       setIsAuthenticated(true);
//     }
//     setLoading(false);
//   }, []);

//   const login = (token) => {
//     // Store the token in cookies
//     Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     // Remove the token from cookies
//     Cookies.remove('token');
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to access auth context
// export const useAuth = () => useContext(AuthContext);
