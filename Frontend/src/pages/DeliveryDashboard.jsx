import React, { useState, useEffect } from 'react';
import { FaMotorcycle, FaCheckCircle, FaTimesCircle, FaPowerOff } from 'react-icons/fa';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';

const DeliveryDashboard = () => {
    const [status, setStatus] = useState('offline');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { showAlert } = useModal();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [myProfile, setMyProfile] = useState(null);

    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
    let userId = null;
    if (token) {
        try { userId = jwtDecode(token).userId; } catch (e) {}
    }

    useEffect(() => {
        const fetchMyProfile = async () => {
            if (!userId || !token) return;
            try {
                const response = await axios.get(`http://localhost:3000/api/delivery?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const profileData = response.data[0];
                setMyProfile(profileData);
                setStatus(profileData.status);
            } catch (err) {
                showAlert('Failed to load profile.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchMyProfile();
    }, [userId, token]);

    const handleStatusToggle = async () => {
        const newStatus = status === 'available' ? 'offline' : 'available';
        if (!myProfile) return;
        setLoading(true);
        try {
            await axios.patch(`http://localhost:3000/api/delivery/${myProfile._id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus(newStatus);
            showAlert(`You are now ${newStatus === 'available' ? 'ONLINE' : 'OFFLINE'}`);
        } catch (err) {
            showAlert('Status update failed.');
        } finally {
            setLoading(false);
        }
    };

    // Theme Classes
    const cardBg = isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100';
    const textMain = isDark ? 'text-white' : 'text-gray-900';
    const textSub = isDark ? 'text-gray-400' : 'text-gray-500';

    if (pageLoading) return <PageLoader />;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className={`text-3xl font-black mb-8 ${textMain}`}>Dashboard</h1>

            {/* Status Card */}
            <div className={`p-8 rounded-[2.5rem] border shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500 ${cardBg}`}>
                
                {/* Background Glow */}
                <div className={`absolute top-0 left-0 w-full h-full opacity-10 transition-colors duration-500 ${status === 'available' ? 'bg-green-500' : 'bg-gray-500'}`}></div>

                <div className="relative z-10">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg transition-all duration-500 ${status === 'available' ? 'bg-green-500 text-white shadow-green-500/40' : 'bg-gray-200 text-gray-400 dark:bg-white/10'}`}>
                        <FaMotorcycle />
                    </div>
                    
                    <h2 className={`text-2xl font-black mb-1 ${textMain}`}>
                        {myProfile?.name}
                    </h2>
                    <p className={`text-sm font-bold uppercase tracking-widest mb-8 ${status === 'available' ? 'text-green-500' : 'text-gray-400'}`}>
                        Currently {status === 'available' ? 'Online' : 'Offline'}
                    </p>

                    <button
                        onClick={handleStatusToggle}
                        disabled={loading}
                        className={`
                            px-8 py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all transform active:scale-95 flex items-center gap-3
                            ${status === 'available' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-green-600 hover:bg-green-700 shadow-green-600/30'}
                        `}
                    >
                        {loading ? 'Updating...' : status === 'available' ? <><FaPowerOff /> Go Offline</> : <><FaCheckCircle /> Go Online</>}
                    </button>
                </div>
            </div>

            {/* Placeholder Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest ${textSub}`}>Total Deliveries</p>
                    <h3 className={`text-3xl font-black ${textMain}`}>0</h3>
                </div>
                <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest ${textSub}`}>Earnings</p>
                    <h3 className={`text-3xl font-black ${textMain}`}>Rs. 0.00</h3>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;