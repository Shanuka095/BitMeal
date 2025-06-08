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
    <div className="w-screen min-h-screen bg-[#e3e3e3] font-sans text-[#4f4f4f] flex flex-col">
      <div className="flex-grow pt-20">
        <h1 className="text-4xl font-bold text-center mb-8">Customer Dashboard</h1>
        <Restaurants standalone={false} />
      </div>
    </div>
  );
};

export default Dashboard;