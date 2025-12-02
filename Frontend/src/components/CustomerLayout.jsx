import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ActiveOrderBanner from './ActiveOrderBanner';

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ActiveOrderBanner />
      
      {/* Main Content Wrapper */}
      <div className="main-content-wrapper flex-grow min-h-[calc(100vh-112px)]">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default CustomerLayout;