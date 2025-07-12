// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useModal } from '../context/ModalContext';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', phone: '', address: '', profileImage: null });
  const [registrationDate, setRegistrationDate] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const { showAlert } = useModal();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
        const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/users/profile', { // Use API Gateway
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, phone, address, profileImageUrl, createdAt } = response.data;

        setProfile({
          name: name || '',
          phone: phone || '',
          address: address || '',
          profileImage: null,
        });
        setPreview(profileImageUrl ? `http://localhost:3002/profile-uploads/${profileImageUrl}` : null);

        if (createdAt) {
          setRegistrationDate(new Date(createdAt));
        }

      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile');
        showAlert(`Error: ${err.response?.data?.error || 'Failed to fetch profile'}`); // Use custom alert
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, profileImage: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) {
        showAlert('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('phone', profile.phone);
      formData.append('address', profile.address);

      if (profile.profileImage) {
        formData.append('profileImage', profile.profileImage);
      } else if (preview && !preview.startsWith('blob:')) {
        const existingFilename = preview.split('/').pop();
        formData.append('profileImageUrl', existingFilename);
      } else {
        formData.append('profileImageUrl', '');
      }


      await axios.put('http://localhost:3000/api/users/profile', formData, { // Use API Gateway
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Profile updated successfully');
      if (profile.profileImage) {
        setPreview(URL.createObjectURL(profile.profileImage));
      }
      showAlert('Profile updated successfully!');
      setIsEditing(false); // Exit edit mode on successful update
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update profile';
      setError(errorMsg);
      showAlert(`Error: ${errorMsg}`);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  if (error && !loading) { // Only show error if not loading
    return (
      <div className="w-screen min-h-screen bg-[#fffce5] flex flex-col">
        <Navbar />
        <div className="flex-grow pt-20 flex justify-center items-center">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-[#fffce5] flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20 flex justify-center items-center">
        <div className="bg-white/95 rounded-2xl p-10 max-w-md w-full shadow-2xl border border-[#e4b401]/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-extrabold text-[#1F2937] tracking-tight">Your Profile</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700"
            >
              <FaEdit size={20} />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6">
              {preview ? (
                <img src={preview} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover border-4 border-[#ffaa00] shadow-lg mb-4" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-6xl mb-4">
                  <FaInfoCircle />
                </div>
              )}
              {isEditing && ( // Only show upload button in edit mode
                <label htmlFor="profileImage" className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                  Upload Profile Image
                </label>
              )}
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={!isEditing} // Disable input if not editing
              />
            </div>

            {/* Registration Date Display */}
            {registrationDate && (
              <div className="text-center text-gray-600 mb-4">
                <p className="text-sm font-medium">Registered On:</p>
                <p className="text-md font-semibold">{format(registrationDate, 'PPP p')}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1F2937] mb-2">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                  placeholder="Enter your name"
                  required
                />
              ) : (
                <p className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg">{profile.name || 'N/A'}</p>
              )}
            </div>
            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#1F2937] mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                  placeholder="Enter your phone"
                  required
                />
              ) : (
                <p className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg">{profile.phone || 'N/A'}</p>
              )}
            </div>
            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-[#1F2937] mb-2">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] text-[#1F2937] rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#e4b401] focus:border-transparent placeholder-[#6B7280] transition-all duration-200"
                  placeholder="Enter your address"
                />
              ) : (
                <p className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg">{profile.address || 'N/A'}</p>
              )}
            </div>
            {isEditing && ( // Only show update button in edit mode
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-[#1F2937] bg-[#e4b401] hover:bg-[#c99e01] transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            )}
          </form>
        </div>
      </div>
      {/* Footer is rendered by App.jsx */}
    </div>
  );
};

export default Profile;
