import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Restaurants from './Restaurants';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 font-sans">
      <header className="bg-white shadow-md p-6">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">Welcome to Your Dashboard</h1>
        <p className="text-center text-gray-600 mt-2">Explore restaurants and manage your orders easily!</p>
      </header>
      <main className="p-6">
        <Restaurants standalone={false} />
      </main>
    </div>
  );
};

export default Dashboard;