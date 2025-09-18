import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Authentication/AuthContext';
import Layout from './Layout/Layout';
import AppRoutes from './Authentication/AppRoutes';
import LoginPage from './Authentication/Login';
import ProtectedRoute from './Authentication/ProtectedRoute';


const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root (/) to /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public Login Route (still accessible) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout collapsed={collapsed} setCollapsed={setCollapsed}>
                  <AppRoutes />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
