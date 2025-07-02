import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

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
      const sessionKey = `token_${Date.now()}`; // Generate a unique key for this session
      sessionStorage.setItem(sessionKey, token); // Store token ONLY in sessionStorage

      setError('');
      if (role === 'customer') {
        navigate('/dashboard', { state: { sessionKey } }); // Pass sessionKey in state
      } else if (role === 'restaurant_admin') {
        navigate('/admin', { state: { sessionKey } }); // Pass sessionKey in state
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
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-[#ffaa00]/20 transform transition-all duration-300 hover:shadow-3xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center tracking-wide">Welcome Back</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-400 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-400 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-[#ffaa00] hover:bg-[#e59400] transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-gray-600 text-sm text-center mt-6">
            Don’t have an account?{' '}
            <Link to="/register" className="text-[#ffaa00] hover:text-[#e59400] font-medium transition-all duration-200">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
