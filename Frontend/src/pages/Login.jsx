import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 1000);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      const { token, role } = response.data;
      const sessionKey = `token_${Date.now()}`;
      sessionStorage.setItem(sessionKey, token);
      setError('');

      if (role === 'customer') navigate('/dashboard');
      else if (role === 'restaurant_admin') navigate('/admin');
      else if (role === 'delivery_personnel') navigate('/delivery-personnel');
      else if (role === 'super_admin') navigate('/super-admin');

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
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

  return (
    <div className={`min-h-screen flex ${bgClass} transition-colors duration-500`}>
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
        <img 
            src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Login Visual" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 p-16 text-white max-w-lg">
            <span className="inline-block px-4 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-xs font-bold tracking-widest uppercase mb-6">Member Access</span>
            <h1 className="text-6xl font-black mb-6 leading-tight drop-shadow-xl">Taste the <br/><span className="text-[#ffaa00]">Extraordinary</span></h1>
            <p className="text-xl text-gray-200 font-light leading-relaxed">Join our community of food lovers and get the best meals delivered to your door.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 pt-32 relative">
        {!isDark && <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-orange-50 via-white to-white -z-10"></div>}

        <div className={`w-full max-w-md rounded-[2.5rem] p-10 md:p-12 border relative overflow-hidden animate-fade-in-up ${cardBg}`}>
            <div className="text-center mb-10">
                <h2 className={`text-4xl font-black mb-3 tracking-tight ${textMain}`}>Welcome Back</h2>
                <p className={`font-medium text-sm md:text-base ${textSub}`}>Sign in to continue your journey</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Email Address</label>
                    <div className="relative group">
                        <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ffaa00] transition-colors" />
                        <input 
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className={`w-full pl-14 pr-5 py-4 rounded-2xl border-2 focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-bold text-sm placeholder-gray-400 ${inputBg}`}
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className={`text-xs font-extrabold uppercase tracking-widest ${textSub}`}>Password</label>
                    </div>
                    <div className="relative group">
                        <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ffaa00] transition-colors" />
                        <input 
                            type={showPassword ? "text" : "password"} // Toggle Type
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            className={`w-full pl-14 pr-12 py-4 rounded-2xl border-2 focus:border-[#ffaa00] focus:ring-0 outline-none transition-all font-bold text-sm placeholder-gray-400 ${inputBg}`}
                            placeholder="••••••••"
                        />
                        {/* Eye Icon Toggle */}
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffaa00] transition-colors"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="flex justify-end pt-1">
                        <Link 
                            to="/forgot-password" 
                            className={`text-xs font-bold transition-colors ${textSub} hover:text-[#ffaa00] hover:underline`}
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">{error}</div>}

                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1 active:scale-95 bg-gradient-to-r from-[#ffaa00] to-orange-600 text-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            
            <p className={`text-sm text-center mt-10 font-medium ${textSub}`}>
                Don’t have an account? <Link to="/register" className="text-[#ffaa00] hover:text-orange-600 font-bold transition-colors underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-[#ffaa00]">Register Now</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;