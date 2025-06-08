// src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

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
    <div className="w-screen min-h-screen bg-[#fffce5] flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 border border-[#e4b401]/20">
          <h2 className="text-3xl font-extrabold text-[#1F2937] text-center mb-6 tracking-tight">Join BitMeal</h2>
          <form onSubmit={handleRegister} className="space-y-6">
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
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#1F2937] mb-2">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent transition-all duration-200"
              >
                <option value="customer">Customer</option>
                <option value="restaurant_admin">Restaurant Admin</option>
                <option value="delivery_personnel">Delivery Personnel</option>
              </select>
            </div>
            {error && <p className="text-[#EF4444] text-sm text-center font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#e4b401] hover:bg-[#c99e01] transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-[#1F2937] text-sm text-center mt-6">
            Already have an account? <Link to="/login" className="text-[#e4b401] hover:underline font-medium transition-all duration-200">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;