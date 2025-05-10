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
      await axios.post('http://localhost:3000/api/auth/register', { email, password, role });
      navigate('/login', { state: { message: 'Registration successful! Please verify your email.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6B7280, #1F2937)',
      animation: 'gradient 15s ease infinite',
      backgroundSize: '200% 200%',
      padding: '20px',
    }}>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transform: 'scale(1)',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: '30px',
          letterSpacing: '1px',
        }}>Register for BitMeal</h2>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#E5E7EB',
              marginBottom: '8px',
              fontSize: '0.9rem',
            }} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
              }}
              placeholder="Enter your email"
              required
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#E5E7EB',
              marginBottom: '8px',
              fontSize: '0.9rem',
            }} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
              }}
              placeholder="Enter your password"
              required
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
            />
            <p style={{
              color: '#9CA3AF',
              fontSize: '0.8rem',
              marginTop: '8px',
            }}>
              Password must be at least 8 characters, with uppercase, lowercase, number, and special character.
            </p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#E5E7EB',
              marginBottom: '8px',
              fontSize: '0.9rem',
            }} htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23ffffff%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
            >
              <option value="customer" style={{ background: '#1F2937', color: '#FFFFFF' }}>Customer</option>
              <option value="restaurant_admin" style={{ background: '#1F2937', color: '#FFFFFF' }}>Restaurant Admin</option>
              <option value="delivery_personnel" style={{ background: '#1F2937', color: '#FFFFFF' }}>Delivery Personnel</option>
            </select>
          </div>
          {error && <p style={{
            color: '#EF4444',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Register
          </button>
        </form>
        <p style={{
          color: '#D1D5DB',
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '0.9rem',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: '#3B82F6',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.color = '#1D4ED8'}
          onMouseLeave={(e) => e.target.style.color = '#3B82F6'}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;