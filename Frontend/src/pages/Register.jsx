import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaUtensils, FaMotorcycle, FaIdCard, FaCar } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', vehicleType: '', licensePlate: '' });
  const [role, setRole] = useState('customer'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setPageLoading(false), 800); }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Construct payload based on role
    const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        role: role
    };

    if (role === 'delivery_personnel') {
        payload.vehicleType = form.vehicleType;
        payload.licensePlate = form.licensePlate;
    }

    try {
      const authResponse = await axios.post('http://localhost:3001/api/auth/register', payload);
      showAlert('Registration successful! Check email for OTP.');
      navigate('/verify-otp', { state: { email: form.email, otpToken: authResponse.data.otpToken } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <PageLoader />;

  // Theme Styles
  const bgClass = isDark ? 'bg-[#0f0f0f]' : 'bg-white';
  const cardBg = isDark 
    ? 'bg-[#1a1a1a] border-white/5 shadow-black/50' 
    : 'bg-white/80 border-white/60 shadow-2xl shadow-orange-500/5 backdrop-blur-xl';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark 
    ? 'bg-white/5 text-white border-transparent focus:bg-black focus:border-[#ffaa00]' 
    : 'bg-gray-50 text-gray-900 border-transparent focus:bg-white focus:border-[#ffaa00] focus:shadow-md';

  const roles = [
    { id: 'customer', label: 'Customer', icon: <FaUser /> },
    { id: 'restaurant_admin', label: 'Restaurant', icon: <FaUtensils /> },
    { id: 'delivery_personnel', label: 'Driver', icon: <FaMotorcycle /> },
  ];

  return (
    <div className={`min-h-screen flex ${bgClass} transition-colors duration-500`}>
      
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
        <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Register Visual" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent"></div>
        <div className="relative z-10 p-16 text-white max-w-lg">
            <span className="inline-block px-4 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-xs font-bold tracking-widest uppercase mb-6">Join Us</span>
            <h1 className="text-6xl font-black mb-6 leading-tight drop-shadow-xl">Start Your <br/><span className="text-[#ffaa00]">Journey</span></h1>
            <p className="text-xl text-gray-200 font-light leading-relaxed">Whether you want to eat, cook, or deliver — we have a place for you.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 pt-24 relative">
        {!isDark && <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-orange-50 via-white to-white -z-10"></div>}

        <div className={`w-full max-w-md rounded-[2.5rem] p-10 border relative overflow-hidden animate-fade-in-up ${cardBg}`}>
            
            <div className="text-center mb-8">
                <h2 className={`text-3xl font-black mb-2 ${textMain}`}>Create Account</h2>
                <p className={`${textSub}`}>Select your role to get started</p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {roles.map((r) => (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                            role === r.id 
                            ? 'border-[#ffaa00] bg-[#ffaa00]/10 text-[#ffaa00] shadow-md scale-105' 
                            : `${isDark ? 'border-white/10 text-gray-500 hover:bg-white/5' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`
                        }`}
                    >
                        <div className="text-xl mb-1">{r.icon}</div>
                        <span className="text-[10px] font-bold uppercase tracking-wide">{r.label}</span>
                    </button>
                ))}
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                    <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Full Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputBg + " w-full pl-5 pr-5 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm"} placeholder="John Doe" required />
                </div>
                <div className="space-y-1">
                    <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Phone</label>
                    <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputBg + " w-full pl-5 pr-5 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm"} placeholder="0712345678" required />
                </div>
                
                {/* Driver Specific Fields */}
                {role === 'delivery_personnel' && (
                    <>
                        <div className="space-y-1">
                            <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Vehicle Type</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><FaCar /></span>
                                <input type="text" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} className={inputBg + " w-full pl-12 pr-5 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm"} placeholder="Bike / Scooter / Car" required />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>License Plate</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><FaIdCard /></span>
                                <input type="text" value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} className={inputBg + " w-full pl-12 pr-5 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm"} placeholder="ABC-1234" required />
                            </div>
                        </div>
                    </>
                )}

                <div className="space-y-1">
                    <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputBg + " w-full pl-5 pr-5 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm"} placeholder="name@example.com" required />
                </div>
                <div className="space-y-1">
                    <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 ${textSub}`}>Password</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputBg + " w-full pl-5 pr-5 py-3.5 rounded-2xl border-2 outline-none font-bold text-sm"} placeholder="••••••••" required />
                </div>

                {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">{error}</div>}

                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:scale-95 bg-gradient-to-r from-[#ffaa00] to-orange-600 text-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {loading ? 'Creating...' : `Join as ${roles.find(r => r.id === role).label}`}
                </button>
            </form>
            
            <p className={`text-center mt-6 text-sm font-medium ${textSub}`}>
                Already have an account? <Link to="/login" className="text-[#ffaa00] font-bold hover:underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-[#ffaa00]">Log In</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Register;