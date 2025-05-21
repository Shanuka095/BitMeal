import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token); // Store token
      setError('');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#2A3335', padding: '20px', color: '#F8FAFC' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Login</h2>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'rgba(248, 250, 252, 0.05)', color: '#F8FAFC' }}
            required
          />
          {error && <p style={{ color: '#EF4444' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#EFB036', color: '#2A3335', borderRadius: '8px' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;