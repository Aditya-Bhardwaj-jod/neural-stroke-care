import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AssessmentPage from "./pages/AssessmentPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import MessagingPage from "./pages/MessagingPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import EmergencyPage from "./pages/EmergencyPage";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center neural-grid-bg">
      <div className="neural-loader" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"} replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"} replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/assessment" element={<ProtectedRoute role="patient"><AssessmentPage /></ProtectedRoute>} />
          <Route path="/patient/results/:id" element={<ProtectedRoute role="patient"><ResultsPage /></ProtectedRoute>} />
          <Route path="/patient/history" element={<ProtectedRoute role="patient"><HistoryPage /></ProtectedRoute>} />
          <Route path="/patient/messages" element={<ProtectedRoute role="patient"><MessagingPage /></ProtectedRoute>} />
          <Route path="/patient/notifications" element={<ProtectedRoute role="patient"><NotificationsPage /></ProtectedRoute>} />
          <Route path="/patient/settings" element={<ProtectedRoute role="patient"><SettingsPage /></ProtectedRoute>} />
          <Route path="/patient/emergency" element={<ProtectedRoute role="patient"><EmergencyPage /></ProtectedRoute>} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/messages" element={<ProtectedRoute role="doctor"><MessagingPage /></ProtectedRoute>} />
          <Route path="/doctor/notifications" element={<ProtectedRoute role="doctor"><NotificationsPage /></ProtectedRoute>} />
          <Route path="/doctor/settings" element={<ProtectedRoute role="doctor"><SettingsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
