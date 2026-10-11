import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

/**
 * ThemeToggle Component
 * Interactive toggle button between White (Light) and Dark themes.
 * Smoothly animates icons with spring motion.
 */
export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, toggleTheme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95 select-none shadow-sm ${
        isLight
          ? 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800'
          : 'bg-dark-800 hover:bg-dark-700 border-white/10 text-amber-400'
      } ${className}`}
      title={isLight ? 'Switch to Dark Theme' : 'Switch to White Theme'}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="flex items-center justify-center"
      >
        {isLight ? (
          <Moon size={16} className="text-gray-700" />
        ) : (
          <Sun size={16} className="text-amber-400" />
        )}
      </motion.div>

      {showLabel && (
        <span className={`text-xs font-bold ${isLight ? 'text-gray-800' : 'text-gray-300'}`}>
          {isLight ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
