import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Plus, History, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/plan/workout', icon: ClipboardList, label: 'Plan' },
    { path: '/log', icon: Plus, label: 'Log', isFab: true },
    { path: '/history', icon: History, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/plan/workout') return location.pathname.startsWith('/plan');
    if (path === '/history') return location.pathname === '/history' || location.pathname === '/calendar';
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-30 safe-bottom">
      <div className="glass-strong border-t border-white/5 px-2 py-2">
        <div className="flex justify-around items-end max-w-md mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            if (item.isFab) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="relative flex flex-col items-center justify-center -top-6 outline-none"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-accent/20 transition-transform active:scale-90 ${
                    active ? 'gradient-accent text-dark-900' : 'bg-dark-700 text-accent border-2 border-accent'
                  }`}>
                    <Icon size={28} />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center py-2 px-3 outline-none min-w-[64px]"
              >
                <div className={`mb-1 transition-colors duration-300 ${active ? 'text-accent' : 'text-gray-400'}`}>
                  <Icon size={28} />
                </div>
                <span className={`text-[10px] sm:text-xs font-medium transition-colors duration-300 ${active ? 'text-accent' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
