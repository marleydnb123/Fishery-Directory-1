import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../admin/AdminLayout';

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };

    checkAuth();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default ProtectedRoute;