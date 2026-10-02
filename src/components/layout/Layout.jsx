import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-900 text-gray-100 overflow-hidden relative">
      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto no-scrollbar pb-24 scroll-smooth">
        <div className="max-w-md mx-auto min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
