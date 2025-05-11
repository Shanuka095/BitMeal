import { useState } from 'react';
     import axios from 'axios';
     import { useNavigate, Link } from 'react-router-dom';

     const Login = () => {
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');
       const [error, setError] = useState('');
       const navigate = useNavigate();

       const handleLogin = async (e) => {
         e.preventDefault();
         try {
           const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
           localStorage.setItem('token', response.data.token);
           localStorage.setItem('role', response.data.role);
           navigate('/dashboard');
         } catch (err) {
           setError(err.response?.data?.error || 'Login failed');
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
             <h2 style={{ color: '#F8FAFC', textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Login to BitMeal</h2>
             <form onSubmit={handleLogin}>
               <div style={{ marginBottom: '20px' }}>
                 <label style={{ color: '#F8FAFC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }} htmlFor="email">Email</label>
                 <input
                   type="email"
                   id="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   style={{
                     width: '100%',
                     padding: '12px',
                     borderRadius: '8px',
                     border: '1px solid rgba(248, 250, 252, 0.3)',
                     backgroundColor: 'rgba(248, 250, 252, 0.05)',
                     color: '#F8FAFC',
                     fontSize: '1rem',
                   }}
                   placeholder="Enter your email"
                   required
                 />
               </div>
               <div style={{ marginBottom: '20px' }}>
                 <label style={{ color: '#F8FAFC', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }} htmlFor="password">Password</label>
                 <input
                   type="password"
                   id="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   style={{
                     width: '100%',
                     padding: '12px',
                     borderRadius: '8px',
                     border: '1px solid rgba(248, 250, 252, 0.3)',
                     backgroundColor: 'rgba(248, 250, 252, 0.05)',
                     color: '#F8FAFC',
                     fontSize: '1rem',
                   }}
                   placeholder="Enter your password"
                   required
                 />
               </div>
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
                 Login
               </button>
             </form>
             <p style={{ color: '#F8FAFC', textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
               Don't have an account?{' '}
               <Link to="/register" style={{ color: '#EFB036', textDecoration: 'none', fontWeight: 'bold' }}>
                 Register
               </Link>
             </p>
           </div>
         </div>
       );
     };

     export default Login;