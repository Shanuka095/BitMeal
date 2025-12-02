import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaKey, FaArrowLeft, FaShieldAlt, FaLock } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';

const VerifyOTP = () => {
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [timer, setTimer] = useState(60); 
  
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // State to hold the token, allowing updates on resend
  const [otpToken, setOtpToken] = useState(location.state?.otpToken || '');
  const email = location.state?.email || '';

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 800);
    
    if (!otpToken || !email) {
      setError('Session expired. Please register again.');
    }
    if (location.state?.message) {
      setMessage(location.state.message);
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, location.state]); // Removed otpToken from dependency to avoid loop on update

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-otp', { otp, otpToken });
      setMessage(response.data.message);
      setError('');
      showAlert('Verification Successful! Welcome to BitMeal.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check the code.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Handle Resend Logic
  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
        const response = await axios.post('http://localhost:3001/api/auth/resend-otp', { email });
        // Update token with the new one from backend
        setOtpToken(response.data.otpToken); 
        setMessage('New code sent successfully!');
        setTimer(60); // Reset timer
    } catch (err) {
        setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
        setLoading(false);
    }
  };

  if (pageLoading) return <PageLoader />;

  const bgClass = isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]';
  const cardBg = isDark 
    ? 'bg-[#1a1a1a] border-white/5 shadow-black/50' 
    : 'bg-white border-white/60 shadow-2xl shadow-orange-500/5 backdrop-blur-xl';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark 
    ? 'bg-[#0f0f0f] text-white border-[#333] focus:border-[#ffaa00] focus:bg-black' 
    : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-[#ffaa00] focus:bg-white';

  return (
    <div className={`min-h-screen flex ${bgClass} transition-colors duration-500 font-sans`}>
      
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit.png')]"></div>
        <div className="relative z-10 flex flex-col items-center text-center p-12">
            <div className="w-24 h-24 rounded-full bg-[#ffaa00]/10 border border-[#ffaa00]/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,170,0,0.2)] animate-pulse">
                <FaShieldAlt className="text-5xl text-[#ffaa00]" />
            </div>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Account <br/> Security</h1>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                We use advanced encryption to keep your data safe. Please verify your identity to continue.
            </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffaa00]/10 rounded-full blur-[120px] -ml-20 -mb-20"></div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 relative">
        {!isDark && <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white to-gray-50 -z-10 lg:hidden"></div>}

        <div className="max-w-md w-full mx-auto">
            <button 
                onClick={() => navigate('/register')}
                className={`mb-8 p-3 rounded-full transition-all flex items-center gap-2 text-sm font-bold ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            >
                <FaArrowLeft /> Back
            </button>

            <div className={`rounded-[2.5rem] p-8 sm:p-12 border relative overflow-hidden animate-fade-in-up ${cardBg}`}>
                
                <div className="text-center mb-10">
                    <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-4 ${isDark ? 'bg-white/5 text-[#ffaa00]' : 'bg-orange-50 text-[#ffaa00]'}`}>
                        <FaLock />
                    </div>
                    <h2 className={`text-3xl font-black mb-2 tracking-tight ${textMain}`}>Verify OTP</h2>
                    <p className={`text-sm font-medium leading-relaxed ${textSub}`}>
                        We sent a 6-digit code to <br/>
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{email}</span>
                    </p>
                </div>
                
                <form onSubmit={handleVerifyOTP} className="space-y-8">
                    <div className="space-y-3">
                        <div className="relative group">
                            <FaKey className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-gray-600 group-focus-within:text-[#ffaa00]' : 'text-gray-400 group-focus-within:text-[#ffaa00]'}`} />
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOTP(e.target.value.replace(/[^0-9]/g, ''))} 
                                required
                                className={`w-full pl-16 pr-6 py-5 rounded-2xl border-2 outline-none transition-all font-mono font-bold text-2xl text-center tracking-[0.5em] ${inputBg}`}
                                placeholder="······"
                                maxLength={6}
                            />
                        </div>
                    </div>

                    {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center animate-pulse">⚠️ {error}</div>}
                    {message && !error && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold text-center">✅ {message}</div>}

                    <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-[#ffaa00]/30 transition-all transform hover:-translate-y-1 active:scale-95 bg-gradient-to-r from-[#ffaa00] to-orange-600 text-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {loading ? 'Verifying...' : 'Verify & Proceed'}
                    </button>
                </form>
                
                <div className="text-center mt-8">
                    <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${textSub}`}>Didn't receive code?</p>
                    {timer > 0 ? (
                        <span className="text-gray-400 font-mono text-sm">Resend in 00:{timer < 10 ? `0${timer}` : timer}</span>
                    ) : (
                        <button 
                            onClick={handleResendOTP}
                            disabled={loading}
                            className="text-[#ffaa00] font-black text-sm hover:underline decoration-2 underline-offset-4 transition-colors hover:text-orange-400"
                        >
                            Resend Code
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;