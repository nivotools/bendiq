import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black italic text-white mb-4">
            BEND<span className="text-blue-500">IQ</span>
          </h1>
          <Loader2 size={32} className="animate-spin text-blue-500 mx-auto" />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-4">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
