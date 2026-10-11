import React from 'react';
import { motion } from 'framer-motion';

/**
 * AppLogo Component
 * Premium, custom-designed forged emblem for FitForge:
 * - Titanium squircle with neon emerald-to-cyan gradient rim
 * - Interlocking aerodynamic forged wing plates (stylized 'F' & heavy barbell)
 * - Central forged shield with radiant fire core & diamond highlight
 */
export default function AppLogo({ 
  size = 56, 
  showGlow = true, 
  className = '', 
  animated = false 
}) {
  const containerStyle = {
    width: size,
    height: size,
  };

  return (
    <div 
      className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`} 
      style={containerStyle}
    >
      {/* Outer ambient blur glow */}
      {showGlow && (
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-emerald-500/35 via-cyan-500/25 to-indigo-500/20 rounded-3xl blur-xl pointer-events-none transform scale-110"
        />
      )}

      {/* Main SVG Emblem */}
      <motion.svg
        whileHover={animated ? { scale: 1.05, rotate: 1 } : {}}
        whileTap={animated ? { scale: 0.95 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        viewBox="0 0 128 128" 
        width="100%" 
        height="100%"
        className="relative z-10 drop-shadow-2xl"
      >
        <defs>
          {/* Dark Titanium Background Gradient */}
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B0D17" />
            <stop offset="50%" stopColor="#121728" />
            <stop offset="100%" stopColor="#060810" />
          </linearGradient>

          {/* Outer Rim Neon Gradient */}
          <linearGradient id="logoRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E676" />
            <stop offset="50%" stopColor="#00B0FF" />
            <stop offset="100%" stopColor="#7C4DFF" />
          </linearGradient>

          {/* Primary Emerald-Cyan Blade Gradient */}
          <linearGradient id="logoPrimaryBlade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF87" />
            <stop offset="100%" stopColor="#60EFFF" />
          </linearGradient>

          {/* Secondary Cyan-Violet Blade Gradient */}
          <linearGradient id="logoSecondaryBlade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B0FF" />
            <stop offset="100%" stopColor="#651FFF" />
          </linearGradient>

          {/* Forge Fire Core Gradient */}
          <linearGradient id="logoForgeFlame" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF1744" />
            <stop offset="50%" stopColor="#FF9100" />
            <stop offset="100%" stopColor="#FFEA00" />
          </linearGradient>

          {/* Radial Core Glow */}
          <radialGradient id="logoCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#00B0FF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Neon Drop Shadow Filter */}
          <filter id="logoNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* App Icon Base Squircle */}
        <rect 
          x="4" y="4" 
          width="120" height="120" 
          rx="30" 
          fill="url(#logoBgGrad)" 
          stroke="url(#logoRimGrad)" 
          strokeWidth="2.5" 
        />

        {/* Ambient Center Glow */}
        <circle cx="64" cy="64" r="42" fill="url(#logoCoreGlow)" />

        {/* Diagonal Tech Background Hatching */}
        <line x1="16" y1="36" x2="36" y2="16" stroke="white" strokeOpacity="0.05" strokeWidth="2" />
        <line x1="92" y1="112" x2="112" y2="92" stroke="white" strokeOpacity="0.05" strokeWidth="2" />

        {/* ============================================================== */}
        {/* FITFORGE EMBLEM: Interlocking Forged Dumbbell & Flame Blades */}
        {/* ============================================================== */}

        {/* Left Barbell / "F" Wing Plate */}
        <path 
          d="M 28 38 L 46 26 L 46 44 L 38 50 L 38 78 L 46 84 L 46 102 L 28 90 Z" 
          fill="url(#logoPrimaryBlade)" 
          filter="url(#logoNeonGlow)" 
        />

        {/* Right Barbell / "F" Wing Plate */}
        <path 
          d="M 100 38 L 82 26 L 82 44 L 90 50 L 90 78 L 82 84 L 82 102 L 100 90 Z" 
          fill="url(#logoSecondaryBlade)" 
          filter="url(#logoNeonGlow)" 
        />

        {/* Central Heavy Barbell Shaft */}
        <rect x="42" y="60" width="44" height="8" rx="2" fill="#F1F5F9" />
        <rect x="48" y="58" width="3" height="12" rx="1" fill="#94A3B8" />
        <rect x="77" y="58" width="3" height="12" rx="1" fill="#94A3B8" />

        {/* Center Forged Core: Athletic Hexagonal Shield */}
        <polygon 
          points="64,32 78,41 78,87 64,96 50,87 50,41" 
          fill="#0B0E17" 
          stroke="url(#logoPrimaryBlade)" 
          strokeWidth="2.5" 
        />

        {/* Inner Forge Flame (Power & Transformation) */}
        <path 
          d="M 64 42 Q 72 54 70 66 Q 69 76 64 86 Q 59 76 58 66 Q 56 54 64 42 Z" 
          fill="url(#logoForgeFlame)" 
          filter="url(#logoNeonGlow)" 
        />

        {/* Diamond Spark Highlight */}
        <polygon points="64,54 67,64 64,74 61,64" fill="#FFFFFF" opacity="0.95" />

        {/* Top Gloss Arc */}
        <path 
          d="M 14 36 Q 64 8 114 36" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeOpacity="0.18" 
          fill="none" 
          strokeLinecap="round" 
        />
      </motion.svg>
    </div>
  );
}
