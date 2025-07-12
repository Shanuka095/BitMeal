// src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useModal } from '../context/ModalContext';

const Register = () => {
  // Removed 'address' from initial state
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useModal();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Send name, phone, email, and password to AuthService
      const authResponse = await axios.post('http://localhost:3001/api/auth/register', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });

      showAlert('Registration successful! Please check your email for the OTP code.');
      navigate('/verify-otp', {
        state: {
          email: form.email,
          otpToken: authResponse.data.otpToken,
          message: 'Please check your email for the OTP code to verify your account.',
        },
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      showAlert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-[#ffaa00]/20 transform transition-all duration-300 hover:shadow-3xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center tracking-wide">Join BitMeal</h2>
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-400 transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-400 transition-all duration-200"
                placeholder="e.g., 0712345678 or +94712345678"
                required
              />
            </div>
            {/* Address field removed */}
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 text-gray-800 rounded-lg border border-[#ffaa00]/20 focus:ring-2 focus:ring-[#ffaa00] focus:border-transparent placeholder-gray-400 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-gray-600 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#ffaa00] hover:text-[#e59400] font-medium transition-all duration-200">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
