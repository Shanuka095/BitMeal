import { Link } from 'react-router-dom';

const Dashboard = () => {
  const role = localStorage.getItem('role');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
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
        maxWidth: '600px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        transform: 'scale(1)',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '20px',
          letterSpacing: '1px',
        }}>Welcome to BitMeal</h2>
        <p style={{
          color: '#D1D5DB',
          fontSize: '1.2rem',
          marginBottom: '30px',
        }}>Role: {role}</p>
        <Link to="/profile" style={{
          display: 'inline-block',
          padding: '12px 24px',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)',
          color: '#FFFFFF',
          fontSize: '1rem',
          fontWeight: 'bold',
          textDecoration: 'none',
          transition: 'background 0.3s ease, transform 0.2s ease',
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;