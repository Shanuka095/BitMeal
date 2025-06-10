// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Restaurants from './Restaurants';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <div className="flex-grow pt-20">
        <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-12 tracking-wide">Customer Dashboard</h1>
        <Restaurants standalone={false} />
      </div>
    </div>
  );
};

export default Dashboard;