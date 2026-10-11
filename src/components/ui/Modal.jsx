import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

const Modal = ({ isOpen, onClose, title, children }) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) {
                  onClose();
                }
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl pointer-events-auto border overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
                isLight 
                  ? 'bg-white border-gray-200 text-gray-900 shadow-slate-200' 
                  : 'bg-dark-800 border-white/10 text-white'
              }`}
            >
              {/* Drag Handle (Mobile) */}
              <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing">
                <div className={`w-12 h-1.5 rounded-full ${isLight ? 'bg-gray-300' : 'bg-gray-600'}`} />
              </div>

              {/* Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${
                isLight ? 'border-gray-200' : 'border-white/5'
              }`}>
                <h2 className={`text-xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{title}</h2>
                <button 
                  onClick={onClose}
                  className={`p-2 -mr-2 rounded-full transition-colors focus:outline-none ${
                    isLight 
                      ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto no-scrollbar flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
