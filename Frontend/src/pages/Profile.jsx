import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users/profile', {
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
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      setMessage('');
    }
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#2A3335',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
    }}>
      <div style={{
        backgroundColor: 'rgba(248, 250, 252, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: 'none',
      }}>
        <h2 style={{ color: '#F8FAFC', textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Your Profile</h2>
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#F8FAFC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }} htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(248, 250, 252, 0.05)',
                color: '#F8FAFC',
                fontSize: '1rem',
                border: 'none',
              }}
              placeholder="Enter your name"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#F8FAFC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }} htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(248, 250, 252, 0.05)',
                color: '#F8FAFC',
                fontSize: '1rem',
                border: 'none',
              }}
              placeholder="Enter your phone"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#F8FAFC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }} htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(248, 250, 252, 0.05)',
                color: '#F8FAFC',
                fontSize: '1rem',
                border: 'none',
              }}
              placeholder="Enter your address"
            />
          </div>
          {message && <p style={{ color: '#EFB036', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px' }}>{message}</p>}
          {error && <p style={{ color: '#EF4444', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px' }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#EFB036',
              color: '#2A3335',
              fontSize: '1rem',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;