// src/pages/Dashboard.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Restaurants from './Restaurants';

const Dashboard = () => {
  return (
    <div className="w-screen min-h-screen bg-[#fffce5] font-sans flex flex-col">
      <Navbar />
      <div className="flex-grow pt-16">
        <Restaurants />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;