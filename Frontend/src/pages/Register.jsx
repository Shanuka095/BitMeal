import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', { email, password, role });
      navigate('/verify-otp', { state: { email, otpToken: response.data.otpToken, message: 'Please check your email for the OTP code.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#fffada] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-[#1F2937] text-center mb-6">Join BitMeal</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1F2937] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-[#1F2937] rounded-lg border-none focus:ring-2 focus:ring-[#d1b700] placeholder-[#6B7280]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1F2937] mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-[#1F2937] rounded-lg border-none focus:ring-2 focus:ring-[#d1b700] placeholder-[#6B7280]"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[#1F2937] mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-[#1F2937] rounded-lg border-none focus:ring-2 focus:ring-[#d1b700]"
            >
              <option value="customer">Customer</option>
              <option value="restaurant_admin">Restaurant Admin</option>
              <option value="delivery_personnel">Delivery Personnel</option>
            </select>
          </div>
          {error && <p className="text-[#EF4444] text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#d1b700] hover:bg-[#b89f00] transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-[#1F2937] text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-[#d1b700] hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;