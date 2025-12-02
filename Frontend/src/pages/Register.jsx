import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';
import { FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 1000);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const authResponse = await axios.post('http://localhost:3001/api/auth/register', form);
      showAlert('Registration successful! Check email for OTP.');
      navigate('/verify-otp', { state: { email: form.email, otpToken: authResponse.data.otpToken } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <PageLoader />;

  // Theme Classes
  const bgClass = isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]';
  const cardBg = isDark 
    ? 'bg-[#1a1a1a] border-white/5 shadow-black/50' 
    : 'bg-white/80 border-white/60 shadow-2xl shadow-orange-500/5 backdrop-blur-xl';
    
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  
  const inputBg = isDark 
    ? 'bg-white/5 text-white border-transparent focus:bg-black' 
    : 'bg-gray-50 text-gray-900 border-transparent focus:bg-white focus:shadow-md';

  // Reusable Input Component Style
  const renderInput = (icon, type, placeholder, value, field) => (
    <div className="space-y-1">
        <label className={`text-xs font-extrabold uppercase tracking-wider ml-1 ${textSub}`}>{field}</label>
        <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ffaa00] transition-colors">{icon}</span>
            <input 
                type={type} 
                value={value} 
                onChange={(e) => setForm({ ...form, [field.toLowerCase().split(' ')[0]]: e.target.value })} 
                className={`w-full pl-14 pr-5 py-4 rounded-2xl border-2 focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-bold text-sm placeholder-gray-400 ${inputBg}`} 
                placeholder={placeholder} 
                required 
            />
        </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex ${bgClass} transition-colors duration-500`}>
      
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
        <img 
            src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Register Visual" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent"></div>
        <div className="relative z-10 p-16 text-white max-w-lg">
            <span className="inline-block px-4 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-xs font-bold tracking-widest uppercase mb-6">Join Us</span>
            <h1 className="text-6xl font-black mb-6 leading-tight drop-shadow-xl">Join the <br/><span className="text-[#ffaa00]">Revolution</span></h1>
            <p className="text-xl text-gray-200 font-light leading-relaxed">Create an account today and experience the future of food ordering.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 pt-32 relative">
        {!isDark && <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-orange-50 via-white to-white -z-10"></div>}

        <div className={`w-full max-w-md rounded-[2.5rem] p-10 border relative overflow-hidden animate-fade-in-up ${cardBg}`}>
            
            <div className="text-center mb-8">
                <h2 className={`text-4xl font-black mb-2 ${textMain}`}>Create Account</h2>
                <p className={`${textSub}`}>Sign up to get started</p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-5">
                {renderInput(<FaUser />, "text", "John Doe", form.name, "name")}
                {renderInput(<FaPhone />, "text", "0712345678", form.phone, "phone")}
                {renderInput(<FaEnvelope />, "email", "name@example.com", form.email, "email")}
                {renderInput(<FaLock />, "password", "••••••••", form.password, "password")}

                {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">{error}</div>}

                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:scale-95 bg-gradient-to-r from-[#ffaa00] to-orange-600 text-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
            
            <p className={`text-center mt-8 text-sm font-medium ${textSub}`}>
                Already have an account? <Link to="/login" className="text-[#ffaa00] font-bold hover:underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-[#ffaa00]">Log In</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Register;