import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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
      const response = await axios.post('http://localhost:3000/api/auth/verify-otp', { otp, otpToken });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
      setMessage('');
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#2A3335] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[rgba(248,250,252,0.1)] backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[rgba(248,250,252,0.1)]">
        <h2 className="text-3xl font-bold text-[#F8FAFC] text-center mb-6">Verify OTP</h2>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-[#F8FAFC] mb-1">OTP Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(248,250,252,0.05)] text-[#F8FAFC] rounded-lg border-none focus:ring-2 focus:ring-[#EFB036] placeholder-[#A1A1AA]"
              placeholder="Enter OTP code"
              required
            />
          </div>
          {error && <p className="text-[#EF4444] text-sm text-center">{error}</p>}
          {message && <p className="text-[#EFB036] text-sm text-center">{message}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg font-semibold text-[#2A3335] bg-[#EFB036] hover:bg-[#D97706] transition-colors duration-200"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;