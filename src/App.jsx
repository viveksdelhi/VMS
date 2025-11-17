import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Authentication/AuthContext';
import { CustomEventProvider } from './contexts/CustomEventContext';
import Layout from './Layout/Layout';
import AppRoutes from './Authentication/AppRoutes';
import LoginPage from './Authentication/Login';
import ProtectedRoute from './Authentication/ProtectedRoute';


const App = () => {
  return (
    <AuthProvider>
      <CustomEventProvider>
        <Router>
          <Routes>
            {/* Redirect root (/) to /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AppRoutes />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CustomEventProvider>
    </AuthProvider>
  );
};

export default App;
