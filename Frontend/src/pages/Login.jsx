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
      const { token } = response.data;
      localStorage.setItem('token', token);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#2A3335] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[rgba(248,250,252,0.1)] backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[rgba(248,250,252,0.1)]">
        <h2 className="text-3xl font-bold text-[#F8FAFC] text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#F8FAFC] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036] placeholder-[#A1A1AA]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#F8FAFC] mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036] placeholder-[#A1A1AA]"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-[#EF4444] text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-[#2A3335] bg-[#EFB036] hover:bg-[#D97706] transition-colors duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-[#F8FAFC] text-sm text-center mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-[#EFB036] hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;