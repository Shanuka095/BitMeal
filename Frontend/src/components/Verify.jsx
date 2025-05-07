import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Verify = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('Verification token:', token);
    if (!token) {
      setError('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        console.log('Sending verify request to backend...');
        const response = await axios.post('http://localhost:3001/api/auth/verify', { token });
        console.log('Backend response:', response.data);
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        console.error('Verification error:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6B7280, #1F2937)',
      animation: 'gradient 15s ease infinite',
      backgroundSize: '200% 200%',
      padding: '20px',
    }}>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transform: 'scale(1)',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: '30px',
          letterSpacing: '1px',
        }}>Email Verification</h2>
        {message && <p style={{
          color: '#10B981',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: '500',
        }}>{message}</p>}
        {error && <p style={{
          color: '#EF4444',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: '500',
        }}>{error}</p>}
        {!message && !error && <p style={{
          color: '#D1D5DB',
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: '500',
        }}>Verifying your email...</p>}
      </div>
    </div>
  );
};

export default Verify;