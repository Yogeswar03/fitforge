import React from 'react';

const StatCard = ({
  icon,
  label,
  value,
  target,
  unit,
  color = '#00E676',
  onClick,
  progress
}) => {
  const isClickable = !!onClick;
  
  return (
    <div 
      onClick={onClick}
      className={`glass rounded-2xl p-4 flex flex-col relative overflow-hidden transition-transform ${isClickable ? 'cursor-pointer active:scale-95 hover:bg-white/5' : ''}`}
    >
      <div className="flex items-center gap-3 mb-3">
      {icon && (
          <div 
            className="p-2 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20`, color: color }}
          >
            {typeof icon === 'function' ? React.createElement(icon, { size: 28 }) : icon}
          </div>
        )}
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      
      <div className="flex items-baseline gap-1 mt-auto">
        <span className="text-2xl font-bold text-white">{value}</span>
        {target && (
          <span className="text-sm text-gray-400 font-medium">
            / {target} {unit}
          </span>
        )}
        {!target && unit && (
          <span className="text-sm text-gray-400 font-medium">{unit}</span>
        )}
      </div>

      {progress !== undefined && (
        <div className="w-full h-1.5 bg-dark-700 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
              backgroundColor: color 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;
