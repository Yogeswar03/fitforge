import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import useThemeStore from '../../store/useThemeStore';

const Layout = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div className={`flex flex-col min-h-screen overflow-hidden relative transition-colors duration-200 ${
      isLight ? 'bg-[#F8FAFC] text-gray-900' : 'bg-dark-900 text-gray-100'
    }`}>
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
