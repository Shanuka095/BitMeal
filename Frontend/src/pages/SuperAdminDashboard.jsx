import React, { useEffect, useState } from 'react';
import { FaBuilding, FaClipboardList, FaUsers } from 'react-icons/fa';
import axios from 'axios';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({ totalRestaurants: 0, pendingApprovals: 0, totalUsers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
        const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
        const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
        if (!token) return;

        try {
            // Fetch All Restaurants
            const resTotal = await axios.get('http://localhost:3003/api/restaurants/admin/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Calculate Stats
            const total = resTotal.data.length;
            const pending = resTotal.data.filter(r => r.status === 'pending').length;

            setStats({ totalRestaurants: total, pendingApprovals: pending, totalUsers: 'N/A' });
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
        }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-black text-gray-900 mb-2">Dashboard Overview</h1>
      <p className="text-gray-500 mb-10">Welcome back, Super Admin.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#ffaa00] flex items-center justify-center text-3xl"><FaBuilding /></div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Restaurants</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.totalRestaurants}</h3>
            </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-3xl"><FaClipboardList /></div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Approvals</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.pendingApprovals}</h3>
            </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-3xl"><FaUsers /></div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Users</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.totalUsers}</h3>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;