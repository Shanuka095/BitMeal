import { Link } from 'react-router-dom';

const Dashboard = () => {
  const role = localStorage.getItem('role');

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
        maxWidth: '600px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: 'none',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#F8FAFC', marginBottom: '20px', fontSize: '2.5rem', fontWeight: 'bold' }}>Welcome to BitMeal</h2>
        <p style={{ color: '#F8FAFC', fontSize: '1.2rem', marginBottom: '30px' }}>Role: {role}</p>
        <Link to="/profile" style={{
          display: 'inline-block',
          padding: '12px 24px',
          borderRadius: '8px',
          backgroundColor: '#EFB036',
          color: '#2A3335',
          fontSize: '1rem',
          fontWeight: 'bold',
          textDecoration: 'none',
          marginRight: '10px',
        }}>
          View Profile
        </Link>
        {role === 'restaurant_admin' && (
          <Link to="/restaurant-admin" style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: '#EFB036',
            color: '#2A3335',
            fontSize: '1rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            marginRight: '10px',
          }}>
            Manage Restaurant
          </Link>
        )}
        {role === 'customer' && (
          <Link to="/restaurants" style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: '#EFB036',
            color: '#2A3335',
            fontSize: '1rem',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}>
            View Restaurants
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;