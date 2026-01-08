import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import CookieConsent from "./components/CookieConsent.tsx";
import AnalyticsWrapper from "./components/AnalyticsWrapper.tsx";
import "./index.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      {/* AnalyticsWrapper loads tracking scripts only when consent is given */}
      {/* Replace the IDs below with your actual Google Analytics and Meta Pixel IDs */}
      <AnalyticsWrapper 
        googleAnalyticsId="G-XXXXXXXXXX"
        metaPixelId="YOUR_PIXEL_ID"
      >
        <AppRoutes />
        {/* Cookie consent banner - shown on all pages */}
        <CookieConsent />
      </AnalyticsWrapper>
    </AuthProvider>
  </BrowserRouter>
);
