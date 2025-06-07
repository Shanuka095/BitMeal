// src/pages/VerifyOTP.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const VerifyOTP = () => {
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const otpToken = location.state?.otpToken || '';

  useEffect(() => {
    if (!otpToken) {
      setError('No OTP session provided. Please register again.');
      setTimeout(() => navigate('/register'), 2000);
    }
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [otpToken, location.state, navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3003/api/auth/verify-otp', { otp, otpToken });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
      setMessage('');
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#fffce5] flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 border border-[#e4b401]/20">
          <h2 className="text-3xl font-extrabold text-[#1F2937] text-center mb-6 tracking-tight">Verify OTP</h2>
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-[#1F2937] mb-2">OTP Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                placeholder="Enter OTP code"
                required
              />
            </div>
            {error && <p className="text-[#EF4444] text-sm text-center font-medium">{error}</p>}
            {message && <p className="text-[#e4b401] text-sm text-center font-medium">{message}</p>}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#e4b401] hover:bg-[#c99e01] transition-all duration-200 hover:shadow-lg"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyOTP;