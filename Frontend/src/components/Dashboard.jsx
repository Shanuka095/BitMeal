import { useState, useEffect } from 'react';
     import { useNavigate } from 'react-router-dom';

     const Dashboard = () => {
       const [role, setRole] = useState('');
       const navigate = useNavigate();

       useEffect(() => {
         const storedRole = localStorage.getItem('role');
         if (!storedRole) {
           navigate('/login');
         } else {
           setRole(storedRole);
         }
       }, [navigate]);

       return (
         <div style={{
           minHeight: '100vh',
           background: 'linear-gradient(135deg, #6B7280, #1F2937)',
           animation: 'gradient 15s ease infinite',
           backgroundSize: '200% 200%',
           padding: '20px',
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
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
             maxWidth: '800px',
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
             border: '1px solid rgba(255, 255, 255, 0.2)',
             color: '#FFFFFF',
             textAlign: 'center',
           }}>
             <h2 style={{
               fontSize: '2.5rem',
               fontWeight: 'bold',
               marginBottom: '30px',
               letterSpacing: '1px',
             }}>
               Welcome to BitMeal Dashboard
             </h2>
             <p style={{
               fontSize: '1.2rem',
               marginBottom: '20px',
             }}>
               Role: {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
             </p>
             {role === 'customer' && (
               <div>
                 <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Customer Actions</h3>
                 <button style={{
                   padding: '12px 24px',
                   borderRadius: '8px',
                   background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)',
                   color: '#FFFFFF',
                   fontSize: '1rem',
                   fontWeight: 'bold',
                   border: 'none',
                   cursor: 'pointer',
                   margin: '10px',
                   transition: 'transform 0.2s ease',
                 }}
                 onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                 onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                   Browse Menu
                 </button>
                 <button style={{
                   padding: '12px 24px',
                   borderRadius: '8px',
                   background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)',
                   color: '#FFFFFF',
                   fontSize: '1rem',
                   fontWeight: 'bold',
                   border: 'none',
                   cursor: 'pointer',
                   margin: '10px',
                   transition: 'transform 0.2s ease',
                 }}
                 onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                 onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                   View Orders
                 </button>
               </div>
             )}
             {role === 'restaurant_admin' && (
               <div>
                 <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Restaurant Admin Actions</h3>
                 <button style={{
                   padding: '12px 24px',
                   borderRadius: '8px',
                   background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)',
                   color: '#FFFFFF',
                   fontSize: '1rem',
                   fontWeight: 'bold',
                   border: 'none',
                   cursor: 'pointer',
                   margin: '10px',
                   transition: 'transform 0.2s ease',
                 }}
                 onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                 onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                   Add Menu Item
                 </button>
                 <button style={{
                   padding: '12px 24px',
                   borderRadius: '8px',
                   background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)',
                   color: '#FFFFFF',
                   fontSize: '1rem',
                   fontWeight: 'bold',
                   border: 'none',
                   cursor: 'pointer',
                   margin: '10px',
                   transition: 'transform 0.2s ease',
                 }}
                 onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                 onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                   View Orders
                 </button>
               </div>
             )}
             {role === 'delivery_personnel' && (
               <div>
                 <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Delivery Personnel Actions</h3>
                 <button style={{
                   padding: '12px 24px',
                   borderRadius: '8px',
                   background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)',
                   color: '#FFFFFF',
                   fontSize: '1rem',
                   fontWeight: 'bold',
                   border: 'none',
                   cursor: 'pointer',
                   margin: '10px',
                   transition: 'transform 0.2s ease',
                 }}
                 onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                 onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                   View Assigned Orders
                 </button>
               </div>
             )}
             <button
               onClick={() => {
                 localStorage.removeItem('token');
                 localStorage.removeItem('role');
                 navigate('/login');
               }}
               style={{
                 padding: '12px 24px',
                 borderRadius: '8px',
                 background: 'linear-gradient(90deg, #EF4444, #B91C1C)',
                 color: '#FFFFFF',
                 fontSize: '1rem',
                 fontWeight: 'bold',
                 border: 'none',
                 cursor: 'pointer',
                 marginTop: '20px',
                 transition: 'transform 0.2s ease',
               }}
               onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
               onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
               Logout
             </button>
           </div>
         </div>
       );
     };

     export default Dashboard;