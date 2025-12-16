import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaEye, FaEyeSlash, FaKey, FaShieldAlt } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const resetToken = location.state?.resetToken;

  useEffect(() => {
    if (!resetToken) {
      showAlert('Unauthorized. Please restart the process.');
      navigate('/forgot-password');
    }
  }, [resetToken, navigate, showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        return showAlert("Passwords do not match!");
    }
    
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/api/auth/reset-password', { 
        resetToken, 
        newPassword 
      });
      
      showAlert('Password Reset Successfully! Please Login.');
      navigate('/login');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // --- Dynamic Theme Styles ---
  const bgPage = isDark ? 'bg-[#050505]' : 'bg-[#f4f7fa]';
  const cardBg = isDark 
    ? 'bg-[#121212]/80 border-white/10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.8)]' 
    : 'bg-white/80 border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]';
  
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  
  // Advanced Input Style (Glow on Focus)
  const inputContainer = isDark 
    ? 'bg-black/40 border-white/5 focus-within:border-[#ffaa00] focus-within:shadow-[0_0_20px_-5px_rgba(255,170,0,0.3)]' 
    : 'bg-white border-gray-200 focus-within:border-[#ffaa00] focus-within:shadow-[0_10px_30px_-10px_rgba(255,170,0,0.15)]';

  const iconColor = isDark ? 'text-gray-500 group-focus-within:text-[#ffaa00]' : 'text-gray-400 group-focus-within:text-[#ffaa00]';

  if (loading) return <PageLoader />;

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-700 px-4 ${bgPage}`}>
      
      {/* Background Blobs */}
      <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 animate-pulse ${isDark ? 'bg-purple-900' : 'bg-purple-200'}`}></div>
      <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 animate-pulse delay-1000 ${isDark ? 'bg-blue-900' : 'bg-blue-200'}`}></div>

      <div className={`relative w-full max-w-md p-10 rounded-[2.5rem] border backdrop-blur-2xl animate-scale-in ${cardBg}`}>
        
        <div className="text-center mb-10">
            <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffaa00] to-orange-600 rounded-2xl blur opacity-40 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-[#ffaa00] to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">
                    <FaKey />
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-4 ${isDark ? 'bg-[#121212] border-[#121212]' : 'bg-white border-white'} text-green-500`}>
                    <FaShieldAlt size={12} />
                </div>
            </div>
            
            <h1 className={`text-3xl font-black mb-2 ${textMain}`}>Reset Password</h1>
            <p className={`text-sm ${textSub}`}>Secure your account with a strong password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* New Password Input */}
            <div className="space-y-2">
                <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>New Password</label>
                <div className={`relative group rounded-2xl border-2 transition-all duration-300 ${inputContainer}`}>
                    <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-lg transition-colors duration-300 ${iconColor}`}>
                        <FaLock />
                    </div>
                    <input 
                        type={showNewPass ? "text" : "password"} 
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full pl-14 pr-12 py-4 bg-transparent outline-none font-bold text-sm transition-colors ${textMain} placeholder-gray-400`}
                        placeholder="••••••••"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowNewPass(!showNewPass)} 
                        className={`absolute right-5 top-1/2 -translate-y-1/2 transition-colors hover:text-[#ffaa00] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                        {showNewPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
                <label className={`text-[10px] font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Confirm Password</label>
                <div className={`relative group rounded-2xl border-2 transition-all duration-300 ${inputContainer}`}>
                    <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-lg transition-colors duration-300 ${iconColor}`}>
                        <FaCheckCircle />
                    </div>
                    <input 
                        type={showConfirmPass ? "text" : "password"} 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-14 pr-12 py-4 bg-transparent outline-none font-bold text-sm transition-colors ${textMain} placeholder-gray-400`}
                        placeholder="••••••••"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowConfirmPass(!showConfirmPass)} 
                        className={`absolute right-5 top-1/2 -translate-y-1/2 transition-colors hover:text-[#ffaa00] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                        {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            {/* Action Button */}
            <button 
                type="submit" 
                className="group relative w-full py-4 mt-4 rounded-2xl font-black text-lg text-white shadow-xl hover:shadow-orange-500/40 overflow-hidden transition-all active:scale-[0.98]"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffaa00] to-orange-600 transition-transform duration-500 group-hover:scale-105"></div>
                <span className="relative flex items-center justify-center gap-2">
                    Update Password
                </span>
            </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;