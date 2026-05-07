import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import VoterDashboard from './pages/VoterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CastVote from './pages/CastVote';
import Results from './pages/Results';
import ManageCandidates from './pages/ManageCandidates';
import ForgotPassword from './pages/ForgotPassword';
import AdminAnalytics from './pages/AdminAnalytics';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/otp-verification"
            element={
              <ProtectedRoute requiredRole={['voter']}>
                <OTPVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voter/dashboard"
            element={
              <ProtectedRoute requiredRole={['voter']}>
                <VoterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voter/cast-vote"
            element={
              <ProtectedRoute requiredRole={['voter']}>
                <CastVote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute requiredRole={['voter', 'admin']}>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-candidates"
            element={
              <ProtectedRoute requiredRole={['admin']}>
                <ManageCandidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
