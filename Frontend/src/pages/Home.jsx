// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-screen min-h-screen bg-[#e3e3e3] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-[#4f4f4f] mb-6">Welcome to BitMeal</h1>
      <p className="text-lg text-[#4f4f4f] mb-8">Please sign in or register to continue.</p>
      <div className="space-x-4">
        <Link to="/login" className="px-4 py-2 bg-[#ffaa00] text-white rounded hover:bg-[#cc8800]">
          Sign In
        </Link>
        <Link to="/register" className="px-4 py-2 bg-[#ffaa00] text-white rounded hover:bg-[#cc8800]">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;