import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';

const VerifyResetOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30); // 30s Countdown
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      showAlert('Session expired. Please start again.');
      navigate('/forgot-password');
    }
  }, [email, navigate, showAlert]);

  // Countdown Logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-reset-otp', { email, otp });
      const { resetToken } = response.data;
      showAlert('OTP Verified!');
      navigate('/reset-password', { state: { resetToken } });
    } catch (err) {
      showAlert(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
        // Reuse forgot-password endpoint to send the Reset Email again
        await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
        showAlert('New OTP sent to your email.');
        setTimer(30); // Reset Timer
    } catch (err) {
        showAlert('Failed to resend OTP.');
    } finally {
        setLoading(false);
    }
  };

  const bgPage = isDark ? 'bg-[#050505]' : 'bg-[#f4f7fa]';
  const cardBg = isDark ? 'bg-[#121212]/80 border-white/10' : 'bg-white/80 border-white/60';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputContainer = isDark ? 'bg-black/40 border-white/5' : 'bg-white border-gray-200';

  if (loading) return <PageLoader />;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${bgPage}`}>
      <div className={`relative w-full max-w-md p-10 rounded-[2.5rem] border backdrop-blur-2xl animate-fade-in-up ${cardBg}`}>
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-6">
                <FaShieldAlt />
            </div>
            <h1 className={`text-3xl font-black mb-2 ${textMain}`}>Enter OTP</h1>
            <p className={`text-sm ${textSub}`}>We sent a code to <span className="text-[#ffaa00] font-bold">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`relative group rounded-2xl border-2 focus-within:border-green-500 transition-all duration-300 ${inputContainer}`}>
                <input 
                    type="text" 
                    required
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`w-full text-center py-4 bg-transparent outline-none font-black text-2xl tracking-[0.5em] transition-colors ${textMain} placeholder-gray-500`}
                    placeholder="••••••"
                />
            </div>

            <button 
                type="submit" 
                className="group relative w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl hover:shadow-green-500/40 overflow-hidden transition-all active:scale-[0.98]"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 transition-transform duration-500 group-hover:scale-105"></div>
                <span className="relative flex items-center justify-center gap-2">
                    Verify Code <FaArrowRight />
                </span>
            </button>
        </form>

        {/* Resend Logic */}
        <div className="text-center mt-6">
            <p className={`text-xs font-bold ${textSub}`}>
                Didn't receive the code?{' '}
                <button 
                    onClick={handleResend}
                    disabled={timer > 0}
                    className={`uppercase tracking-wider ml-1 transition-colors ${timer > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-[#ffaa00] hover:underline cursor-pointer'}`}
                >
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
                </button>
            </p>
        </div>

      </div>
    </div>
  );
};

export default VerifyResetOTP;