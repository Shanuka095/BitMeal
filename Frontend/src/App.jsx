import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div>
        <RouteContent />
      </div>
    </Router>
  );
}

function RouteContent() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <>
      {message && (
        <div style={{
          background: 'linear-gradient(90deg, #10B981, #059669)',
          color: '#FFFFFF',
          padding: '16px',
          textAlign: 'center',
          fontSize: '1rem',
        }}>
          {message}
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;