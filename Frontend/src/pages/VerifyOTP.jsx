import { useState, useEffect } from 'react';
     import axios from 'axios';
     import { useNavigate, useLocation } from 'react-router-dom';

     const VerifyOTP = () => {
       const [otp, setOTP] = useState('');
       const [error, setError] = useState('');
       const [message, setMessage] = useState('');
       const navigate = useNavigate();
       const location = useLocation();
       const otpToken = location.state?.otpToken || '';

       useEffect(() => {
         if (!otpToken) {
           setError('No OTP session provided. Please register again.');
           setTimeout(() => navigate('/register'), 2000);
         }
         if (location.state?.message) {
           setMessage(location.state.message);
         }
       }, [otpToken, location.state, navigate]);

       const handleVerifyOTP = async (e) => {
         e.preventDefault();
         try {
           const response = await axios.post('http://localhost:3000/api/auth/verify-otp', { otp, otpToken });
           setMessage(response.data.message);
           setError('');
           setTimeout(() => navigate('/login'), 2000);
         } catch (err) {
           setError(err.response?.data?.error || 'OTP verification failed');
           setMessage('');
         }
       };

       return (
         <div style={{
           minHeight: '100vh',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           backgroundColor: '#2A3335',
           padding: '20px',
         }}>
           <div style={{
             backgroundColor: 'rgba(248, 250, 252, 0.1)',
             backdropFilter: 'blur(10px)',
             borderRadius: '20px',
             padding: '40px',
             width: '100%',
             maxWidth: '400px',
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
             border: '1px solid rgba(248, 250, 252, 0.2)',
           }}>
             <h2 style={{ color: '#F8FAFC', textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Verify OTP</h2>
             <form onSubmit={handleVerifyOTP}>
               <div style={{ marginBottom: '20px' }}>
                 <label style={{ color: '#F8FAFC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }} htmlFor="otp">OTP Code</label>
                 <input
                   type="text"
                   id="otp"
                   value={otp}
                   onChange={(e) => setOTP(e.target.value)}
                   style={{
                     width: '100%',
                     padding: '12px',
                     borderRadius: '8px',
                     border: '1px solid rgba(248, 250, 252, 0.3)',
                     backgroundColor: 'rgba(248, 250, 252, 0.05)',
                     color: '#F8FAFC',
                     fontSize: '1rem',
                   }}
                   placeholder="Enter OTP code"
                   required
                 />
               </div>
               {error && <p style={{ color: '#EF4444', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px' }}>{error}</p>}
               {message && <p style={{ color: '#EFB036', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px' }}>{message}</p>}
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
                 Verify OTP
               </button>
             </form>
           </div>
         </div>
       );
     };

     export default VerifyOTP;