import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ProgressRing = ({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  color = '#00E676',
  label,
  value,
  icon
}) => {
  const [offset, setOffset] = useState(0);
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  
  // Ensure progress stays within 0-100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    const progressOffset = ((100 - normalizedProgress) / 100) * circumference;
    setOffset(progressOffset);
  }, [normalizedProgress, circumference]);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-md">
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#16213E" /* dark-700 approx */
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color}80)`
          }}
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        {icon && (typeof icon === 'function' ? React.createElement(icon, { size: 24, color, className: 'mb-1' }) : <span className="mb-1">{icon}</span>)}
        {value && <span className="text-xl font-bold text-white">{value}</span>}
        {label && <span className="text-xs text-gray-400 mt-0.5">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
