// Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      setError('');
      if (role === 'customer') {
        navigate('/dashboard');
      } else if (role === 'restaurant_admin') {
        navigate('/restaurant-admin');
      } else if (role === 'delivery_personnel') {
        navigate('/delivery');
      } else {
        setError('Unknown role');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#fffce5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 border border-[#e4b401]/20">
        <h2 className="text-3xl font-extrabold text-[#1F2937] text-center mb-6 tracking-tight">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1F2937] mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1F2937] mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-[#EF4444] text-sm text-center font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#e4b401] hover:bg-[#c99e01] transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-[#1F2937] text-sm text-center mt-6">
          Don’t have an account? <Link to="/register" className="text-[#e4b401] hover:underline font-medium transition-all duration-200">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;