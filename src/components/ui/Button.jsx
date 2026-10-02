import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  icon,
  loading = false,
  type = 'button',
  className = ''
}) => {
  
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-95 focus:outline-none';
  
  const variants = {
    primary: 'gradient-accent text-dark-900 shadow-lg shadow-accent/20 hover:brightness-110',
    secondary: 'bg-dark-700 text-white hover:bg-dark-600',
    outline: 'border-2 border-accent bg-transparent text-accent hover:bg-accent/10',
    ghost: 'bg-transparent text-white hover:bg-dark-700',
    danger: 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600'
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed active:scale-100' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2" size={size === 'sm' ? 16 : 20} />
      ) : icon ? (
        typeof icon === 'function' ? (
          React.createElement(icon, { className: 'mr-2', size: size === 'sm' ? 18 : 24 })
        ) : (
          <span className="mr-2 inline-flex">{icon}</span>
        )
      ) : null}
      {children}
    </button>
  );
};

export default Button;
