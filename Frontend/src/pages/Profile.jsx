import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUser, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaPen, 
  FaChevronLeft, FaCrown, FaQrcode, FaCreditCard, FaShieldAlt
} from 'react-icons/fa';
import PageLoader from '../components/PageLoader';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import { format, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); 
  
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    address: '', 
    profileImage: null 
  });
  
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) return;

      const res = await axios.get('http://localhost:3002/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);
      setFormData({ 
        name: res.data.name || '', 
        phone: res.data.phone || '', 
        address: res.data.address || '',
        profileImage: null 
      });

      if (res.data.profileImageUrl) {
        setPreview(`http://localhost:3002/profile-uploads/${res.data.profileImageUrl}`);
      }
    } catch (err) {
      console.error("Profile Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      if (formData.profileImage) {
        data.append('profileImage', formData.profileImage);
      }

      const res = await axios.put('http://localhost:3002/api/users/profile', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      showAlert("Profile Updated Successfully!");
      setUser(res.data);
      setFormData(prev => ({ ...prev, profileImage: null })); 
      
    } catch (err) {
      showAlert("Update Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({ ...formData, profileImage: file });
        setPreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <PageLoader />;
  if (!user) return (
    <div className={`min-h-screen flex items-center justify-center pt-20 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
        Profile Not Found. Please Re-Register.
    </div>
  );

  // --- Dynamic Theme Variables ---
  const bgPage = isDark ? 'bg-[#050505]' : 'bg-[#f8f9fc]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  
  // Refined Container Style (No harsh borders, Soft Shadow)
  const containerStyle = isDark 
    ? 'bg-[#121212]/40 backdrop-blur-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]' 
    : 'bg-white/60 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]';

  // --- Membership Logic ---
  const joinDate = user.createdAt ? new Date(user.createdAt) : new Date();
  const daysActive = differenceInDays(new Date(), joinDate);
  const memberTier = daysActive > 365 ? 'Platinum' : daysActive > 30 ? 'Gold' : 'Silver';
  const tierGradient = daysActive > 365 
    ? 'bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400' 
    : daysActive > 30 
        ? 'bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600' 
        : 'bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400';
  
  const safeId = user.email ? user.email.split('@')[0].toUpperCase().substring(0, 8) : 'MEMBER';

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-700 ${bgPage}`}>
      
      {/* --- Ambient Background --- */}
      <div className={`absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 animate-pulse ${isDark ? 'bg-purple-900' : 'bg-purple-200'}`}></div>
      <div className={`absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 animate-pulse delay-1000 ${isDark ? 'bg-orange-900' : 'bg-orange-200'}`}></div>

      {/* --- Main Content --- */}
      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="md:hidden mb-6 flex items-center gap-2 text-sm font-bold text-[#ffaa00]">
            <FaChevronLeft /> Back
        </button>

        <div className={`w-full rounded-[3rem] p-1 flex flex-col lg:flex-row gap-8`}>
            
            {/* === LEFT COLUMN: Identity & Member Card === */}
            <div className="w-full lg:w-1/3 flex flex-col items-center gap-8 py-8">
                
                {/* 1. Avatar Section */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#ffaa00] to-orange-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className={`relative w-40 h-40 rounded-full border-4 shadow-2xl overflow-hidden ${isDark ? 'border-[#1a1a1a] bg-gray-800' : 'border-white bg-white'}`}>
                        {preview ? (
                            <img src={preview} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300"><FaUser /></div>
                        )}
                        <label className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-white">
                            <FaCamera size={24} className="mb-1" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Update</span>
                            <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
                        </label>
                    </div>
                </div>

                <div className="text-center -mt-2">
                    <h2 className={`text-3xl font-black ${textMain}`}>{user.name}</h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-500 shadow-sm'}`}>
                            <FaShieldAlt className="inline mr-1 text-[#ffaa00]" /> {user.role?.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* 2. Holographic Member Card */}
                <div className="w-full max-w-[340px] perspective-1000 group cursor-default mt-4">
                    <div className={`relative w-full h-52 rounded-[1.5rem] shadow-2xl transition-all duration-700 transform group-hover:rotate-x-6 group-hover:rotate-y-6 preserve-3d overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-900'}`}>
                        {/* Abstract Art */}
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${tierGradient} opacity-20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2`}></div>
                        
                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-black text-2xl italic tracking-tighter">BitMeal<span className="text-[#ffaa00]">.</span></h3>
                                    <p className="text-[9px] font-bold tracking-[0.3em] opacity-70 uppercase mt-1">Digital ID</p>
                                </div>
                                <FaQrcode className="text-4xl opacity-80" />
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FaCrown className={daysActive > 30 ? 'text-yellow-400' : 'text-gray-400'} />
                                    <span className={`text-xl font-black uppercase tracking-widest text-transparent bg-clip-text ${tierGradient}`}>
                                        {memberTier}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end opacity-60">
                                    <p className="font-mono text-xs tracking-widest">ID: {safeId}</p>
                                    <FaCreditCard />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === RIGHT COLUMN: Form & Settings === */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
                
                {/* Tabs */}
                <div className={`flex items-center gap-2 p-1.5 rounded-full w-fit mb-2 border ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'details' ? 'bg-[#ffaa00] text-white shadow-md' : `${textSub} hover:bg-gray-100 dark:hover:bg-white/5`}`}
                    >
                        Edit Details
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')} // Placeholder
                        className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'security' ? 'bg-[#ffaa00] text-white shadow-md' : `${textSub} hover:bg-gray-100 dark:hover:bg-white/5`}`}
                    >
                        Security
                    </button>
                </div>

                {/* Soft Glass Form Container */}
                <div className={`flex-1 rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 ${containerStyle}`}>
                    
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#ffaa00]/10 flex items-center justify-center text-[#ffaa00] text-xl">
                            <FaPen />
                        </div>
                        <div>
                            <h3 className={`text-2xl font-black ${textMain}`}>Update Information</h3>
                            <p className={`text-xs font-medium ${textSub}`}>Manage your personal details</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-8">
                        
                        {/* Name Input */}
                        <div className="relative group">
                            <label className={`block mb-2 text-[10px] font-extrabold uppercase tracking-widest ${textSub}`}>Full Name</label>
                            <div className={`relative flex items-center rounded-2xl transition-all duration-300 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                                <div className={`absolute left-5 text-lg transition-colors duration-300 group-focus-within:text-[#ffaa00] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                    <FaUser />
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className={`w-full pl-14 pr-6 py-4 bg-transparent outline-none font-bold text-sm ${textMain} placeholder-gray-400`}
                                    placeholder="Enter your name"
                                />
                                {/* Advanced Focus Animation: Bottom Gradient Border */}
                                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-gradient-to-r from-[#ffaa00] to-orange-600 -translate-x-full group-focus-within:translate-x-0 transition-transform duration-500 ease-out"></div>
                                </div>
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="relative group">
                            <label className={`block mb-2 text-[10px] font-extrabold uppercase tracking-widest ${textSub}`}>Phone Number</label>
                            <div className={`relative flex items-center rounded-2xl transition-all duration-300 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                                <div className={`absolute left-5 text-lg transition-colors duration-300 group-focus-within:text-[#ffaa00] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                    <FaPhone />
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className={`w-full pl-14 pr-6 py-4 bg-transparent outline-none font-bold text-sm ${textMain} placeholder-gray-400`}
                                    placeholder="+94 7X XXX XXXX"
                                />
                                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-gradient-to-r from-[#ffaa00] to-orange-600 -translate-x-full group-focus-within:translate-x-0 transition-transform duration-500 ease-out"></div>
                                </div>
                            </div>
                        </div>

                        {/* Address Input */}
                        <div className="relative group">
                            <label className={`block mb-2 text-[10px] font-extrabold uppercase tracking-widest ${textSub}`}>Delivery Address</label>
                            <div className={`relative flex items-center rounded-2xl transition-all duration-300 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                                <div className={`absolute left-5 text-lg transition-colors duration-300 group-focus-within:text-[#ffaa00] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                    <FaMapMarkerAlt />
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.address} 
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className={`w-full pl-14 pr-6 py-4 bg-transparent outline-none font-bold text-sm ${textMain} placeholder-gray-400`}
                                    placeholder="Enter address"
                                />
                                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-gradient-to-r from-[#ffaa00] to-orange-600 -translate-x-full group-focus-within:translate-x-0 transition-transform duration-500 ease-out"></div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                className="group relative w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl hover:shadow-orange-500/30 overflow-hidden transition-all active:scale-[0.98]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#ffaa00] to-orange-600 transition-transform duration-500 group-hover:scale-105"></div>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    <FaSave className="group-hover:rotate-12 transition-transform" /> Save Changes
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;