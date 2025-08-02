import React, { useState, useEffect } from 'react';
import { FaMotorcycle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useModal } from '../context/ModalContext';

const DeliveryDashboard = () => {
    const [status, setStatus] = useState('offline'); // Initial status from state
    const [loading, setLoading] = useState(false);
    const { showAlert } = useModal();
    const [myProfile, setMyProfile] = useState(null);

    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
    let userId = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userId = decoded.userId;
        } catch (e) {
            console.error("Failed to decode token:", e);
        }
    }

    const fetchMyProfile = async () => {
        if (!userId || !token) return;
        setLoading(true);
        try {
            // Fetch the driver's profile from the DeliveryService
            const response = await axios.get(`http://localhost:3000/api/delivery?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const profileData = response.data[0];
            setMyProfile(profileData);
            setStatus(profileData.status); // Sync status with backend
        } catch (err) {
            console.error('Failed to fetch profile:', err.response?.data || err);
            showAlert('Failed to load your profile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProfile();
    }, [userId, token]);

    const handleStatusToggle = async () => {
        const newStatus = status === 'available' ? 'offline' : 'available';
        if (!myProfile) {
            showAlert('Your profile is not yet available.');
            return;
        }
        setLoading(true);
        try {
            await axios.patch(`http://localhost:3000/api/delivery/${myProfile._id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus(newStatus);
            showAlert(`Status updated to ${newStatus}.`);
        } catch (err) {
            console.error('Failed to toggle status:', err.response?.data || err);
            showAlert('Failed to update status.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (currentStatus) => {
        switch (currentStatus) {
            case 'available': return 'bg-green-600';
            case 'on_delivery': return 'bg-blue-600';
            case 'offline': return 'bg-gray-400';
            default: return 'bg-yellow-500';
        }
    };

    if (loading || !myProfile) {
        return <div className="p-6 text-center"><p className="text-gray-600">Loading your dashboard...</p></div>;
    }

    return (
        <div className="p-8 bg-white rounded-xl shadow-2xl flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Driver Dashboard</h1>

            <div className="flex items-center space-x-4 mb-8">
                <FaMotorcycle className="text-5xl text-yellow-500" />
                <h3 className="text-2xl font-semibold">{myProfile.name}</h3>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-inner flex flex-col items-center w-full max-w-sm">
                <p className="text-lg text-gray-700 mb-4">
                    Current Status: <span className={`font-bold capitalize text-white px-3 py-1 rounded-full ${getStatusColor(status)}`}>{status.replace(/_/g, ' ')}</span>
                </p>
                <button
                    onClick={handleStatusToggle}
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                        ${status === 'available' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`
                    }
                >
                    {loading ? 'Updating...' : status === 'available' ? <><FaTimesCircle className="inline mr-2" /> Go Offline</> : <><FaCheckCircle className="inline mr-2" /> Go Online</>}
                </button>
            </div>

            {/* A placeholder for future features */}
            <div className="mt-8 text-center text-gray-500">
                <p>Simulating automatic location updates every 10 seconds.</p>
                <p>New orders will appear here when assigned.</p>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
