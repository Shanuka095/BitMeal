import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaArrowRight, FaChevronLeft } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API Call
      await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
      
      showAlert('OTP sent to your email!');
      // Navigate to OTP page, passing email in state
      navigate('/verify-reset-otp', { state: { email } });
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const bgPage = isDark ? 'bg-[#050505]' : 'bg-[#f4f7fa]';
  const cardBg = isDark 
    ? 'bg-[#121212]/80 border-white/10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.8)]' 
    : 'bg-white/80 border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputContainer = isDark 
    ? 'bg-black/40 border-white/5 focus-within:border-[#ffaa00]' 
    : 'bg-white border-gray-200 focus-within:border-[#ffaa00]';

  if (loading) return <PageLoader />;

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-700 px-4 ${bgPage}`}>
      
      {/* Background Blobs */}
      <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 animate-pulse ${isDark ? 'bg-purple-900' : 'bg-purple-200'}`}></div>
      <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 animate-pulse delay-1000 ${isDark ? 'bg-orange-900' : 'bg-orange-200'}`}></div>

      <div className={`relative w-full max-w-md p-10 rounded-[2.5rem] border backdrop-blur-2xl animate-scale-in ${cardBg}`}>
        
        <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-[#ffaa00] mb-8 hover:-translate-x-1 transition-transform w-fit">
            <FaChevronLeft /> Back to Login
        </Link>

        <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#ffaa00] to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-6">
                <FaEnvelope />
            </div>
            <h1 className={`text-3xl font-black mb-2 ${textMain}`}>Forgot Password?</h1>
            <p className={`text-sm ${textSub}`}>Enter your email and we'll send you a code to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`relative group rounded-2xl border-2 transition-all duration-300 ${inputContainer}`}>
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-lg transition-colors duration-300 ${isDark ? 'text-gray-500 group-focus-within:text-[#ffaa00]' : 'text-gray-400 group-focus-within:text-[#ffaa00]'}`}>
                    <FaEnvelope />
                </div>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-14 pr-6 py-4 bg-transparent outline-none font-bold text-sm transition-colors ${textMain} placeholder-gray-400`}
                    placeholder="Enter your email"
                />
            </div>

            <button 
                type="submit" 
                className="group relative w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl hover:shadow-orange-500/40 overflow-hidden transition-all active:scale-[0.98]"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffaa00] to-orange-600 transition-transform duration-500 group-hover:scale-105"></div>
                <span className="relative flex items-center justify-center gap-2">
                    Send OTP <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;