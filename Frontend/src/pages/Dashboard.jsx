// src/pages/Dashboard.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Restaurants from './Restaurants';

const Dashboard = () => {
  return (
    <div className="w-screen min-h-screen bg-[#e3e3e3] font-sans flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20">
        <Restaurants standalone={false} />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;