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
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#fffce5',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      border: 'none',
    }}>
      <Navbar />
      <div style={{ flexGrow: 1, paddingTop: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(228, 180, 1, 0.2)',
        }}>
          <h2 style={{ color: '#1F2937', textAlign: 'center', marginBottom: '30px', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Your Profile</h2>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#1F2937', display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }} htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#F9FAFB',
                  color: '#1F2937',
                  fontSize: '1rem',
                  border: '1px solid #E5E7EB',
                  transition: 'all 0.2s',
                }}
                placeholder="Enter your name"
                onFocus={(e) => e.target.style.borderColor = '#e4b401'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#1F2937', display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }} htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#F9FAFB',
                  color: '#1F2937',
                  fontSize: '1rem',
                  border: '1px solid #E5E7EB',
                  transition: 'all 0.2s',
                }}
                placeholder="Enter your phone"
                onFocus={(e) => e.target.style.borderColor = '#e4b401'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#1F2937', display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }} htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#F9FAFB',
                  color: '#1F2937',
                  fontSize: '1rem',
                  border: '1px solid #E5E7EB',
                  transition: 'all 0.2s',
                }}
                placeholder="Enter your address"
                onFocus={(e) => e.target.style.borderColor = '#e4b401'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            {message && <p style={{ color: '#e4b401', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500 }}>{message}</p>}
            {error && <p style={{ color: '#EF4444', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500 }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: loading ? '#6B7280' : '#e4b401',
                color: '#1F2937',
                fontSize: '1rem',
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#c99e01')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#e4b401')}
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