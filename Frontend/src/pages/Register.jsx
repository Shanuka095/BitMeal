import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', { email, password, role });
      navigate('/verify-otp', { state: { email, otpToken: response.data.otpToken, message: 'Please check your email for the OTP code.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#2A3335',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
    }}>
      <div style={{
        backgroundColor: 'rgba(248, 250, 252, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: 'none',
      }}>
        <h2 style={{ color: '#F8FAFC', textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Register for BitMeal</h2>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#F8FAFC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(248, 250, 252, 0.05)',
                color: '#F8FAFC',
                fontSize: '1rem',
                border: 'none',
              }}
              placeholder="Enter your email"
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#F8FAFC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(248, 250, 252, 0.05)',
                color: '#F8FAFC',
                fontSize: '1rem',
                border: 'none',
              }}
              placeholder="Enter your password"
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#F8FAFC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }} htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(248, 250, 252, 0.05)',
                color: '#F8FAFC',
                fontSize: '1rem',
                border: 'none',
              }}
            >
              <option value="customer">Customer</option>
              <option value="restaurant_admin">Restaurant Admin</option>
              <option value="delivery_personnel">Delivery Personnel</option>
            </select>
          </div>
          {error && <p style={{ color: '#EF4444', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px' }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#EFB036',
              color: '#2A3335',
              fontSize: '1rem',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </form>
        <p style={{ color: '#F8FAFC', textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#EFB036', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;