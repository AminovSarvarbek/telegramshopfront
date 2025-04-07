// src/AdminRoutes.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductForm from './pages/admin/ProductForm';
import CustomAlert from './components/CustomAlert';

// Protected route component for admin routes
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if admin data exists in session storage
    const adminData = sessionStorage.getItem('adminData');
    setIsAuthenticated(!!adminData);
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location they were trying to access
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {children}
      <CustomAlert
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        message="Sizda bu sahifaga kirish huquqi yo'q"
        type="error"
      />
    </>
  );
};

const AdminRoutes: React.FC = () => {
  // Refresh and close handlers for ProductForm
  const handleRefresh = () => {
    // Sahifani yangilash logikasi
    console.log("Refreshing product list..."); // O'zgartiring o'zingizga mos ravishda
  };

  const handleClose = () => {
    // Sahifani yopish logikasi
    console.log("Closing product form..."); // O'zgartiring o'zingizga mos ravishda
  };

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Protected admin routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      
      <Route
        path="/products/new"
        element={
          <ProtectedAdminRoute>
            <ProductForm onRefresh={handleRefresh} onClose={handleClose} />
          </ProtectedAdminRoute>
        }
      />
      
      <Route
        path="/products/edit/:id"
        element={
          <ProtectedAdminRoute>
            <ProductForm onRefresh={handleRefresh} onClose={handleClose} />
          </ProtectedAdminRoute>
        }
      />
      
      {/* Redirect to dashboard by default */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Catch all admin routes and redirect to dashboard */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
