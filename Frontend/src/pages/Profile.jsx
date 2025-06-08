// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3003/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data.profile || { name: '', phone: '', address: '' });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3003/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#fffce5] flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20 flex justify-center items-center">
        <div className="bg-white/95 rounded-2xl p-10 max-w-md w-full shadow-2xl border border-[#e4b401]/20">
          <h2 className="text-4xl font-extrabold text-[#1F2937] text-center mb-8 tracking-tight">Your Profile</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1F2937] mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#1F2937] mb-2">Phone</label>
              <input
                type="text"
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                placeholder="Enter your phone"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-[#1F2937] mb-2">Address</label>
              <input
                type="text"
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                placeholder="Enter your address"
              />
            </div>
            {message && <p className="text-[#e4b401] text-center text-sm font-medium">{message}</p>}
            {error && <p className="text-[#EF4444] text-center text-sm font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#e4b401] hover:bg-[#c99e01] transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;