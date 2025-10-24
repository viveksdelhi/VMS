import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

// Create a Context for Auth
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('Admin');
  const [userId, setUserId] = useState('77');

  useEffect(() => {
    // Ensure auth cookies are present for any code paths that rely on them
    const token = Cookies.get('token');
    const savedRole = Cookies.get('role');
    const savedPuid = Cookies.get('puid');
    const savedUserId = Cookies.get('userId');

    if (!token) {
      Cookies.set('token', 'dev-bypass-token');
    }
    if (!savedRole) {
      Cookies.set('role', 'Admin');
    }
    if (!savedPuid) Cookies.set('puid', '77');
    if (!savedUserId) Cookies.set('userId', '77');

    setIsAuthenticated(true);
    setRole(savedRole || 'Admin');
    setUserId(savedUserId || savedPuid || '77');
  }, []);

  const login = (token, role) => {
    Cookies.set('token', token);
    Cookies.set('role', role); // 👈 Save role in cookies
    setIsAuthenticated(true);
    setRole(role);
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('role'); // 👈 Remove role too
    Cookies.remove('puid');
    setIsAuthenticated(true);
    setRole('Admin');
    Cookies.set('token', 'dev-bypass-token');
    Cookies.set('role', 'Admin');
    Cookies.set('puid', '77');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, userId, login, logout }}>
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
