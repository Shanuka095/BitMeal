import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
     import Login from './components/Login';
     import Register from './components/Register';
     import Verify from './components/Verify';
     import Dashboard from './components/Dashboard';
     import { useState, useEffect } from 'react';

     function ErrorBoundary({ children }) {
       const [hasError, setHasError] = useState(false);
       useEffect(() => {
         const errorHandler = (error) => {
           console.error('ErrorBoundary caught:', error);
           setHasError(true);
         };
         window.addEventListener('error', errorHandler);
         return () => window.removeEventListener('error', errorHandler);
       }, []);
       if (hasError) return <h1>Something went wrong. Check console for details.</h1>;
       return children;
     }

     function App() {
       console.log('App component rendering');
       return (
         <Router>
           <ErrorBoundary>
             <div>
               <RouteContent />
             </div>
           </ErrorBoundary>
         </Router>
       );
     }

     function RouteContent() {
       console.log('RouteContent rendering');
       const location = useLocation();
       const message = location.state?.message;

       return (
         <>
           {message && (
             <div style={{
               background: 'linear-gradient(90deg, #10B981, #059669)',
               color: '#FFFFFF',
               padding: '16px',
               textAlign: 'center',
               fontSize: '1rem',
             }}>
               {message}
             </div>
           )}
           <Routes>
             <Route path="/" element={<Login />} />
             <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
             <Route path="/verify" element={<Verify />} />
             <Route path="/dashboard" element={<Dashboard />} />
           </Routes>
         </>
       );
     }

     export default App;