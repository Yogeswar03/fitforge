import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import Button from '../components/ui/Button';
import AppLogo from '../components/ui/AppLogo';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle email registration
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await register(name.trim(), email.trim(), password);
      if (res?.success) {
        navigate('/onboarding');
      } else {
        setError(res?.error || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen flex flex-col justify-center px-4 md:px-6 py-12 max-w-md mx-auto relative select-none"
    >
      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-6 right-4 sm:right-6">
        <ThemeToggle showLabel={true} />
      </div>

      {/* Brand Header */}
      <div className="flex flex-col items-center mb-6 text-center">
        <AppLogo size={60} animated={true} className="mb-3" />
        <h1 className="text-3xl font-black tracking-tight gradient-accent-text">Join FitForge</h1>
        <p className={`text-xs mt-1 font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          Create your account and start your science-backed journey
        </p>
      </div>

      {/* Register Card */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl transition-colors ${
        isLight 
          ? 'bg-white border-gray-200 shadow-slate-100 text-gray-900' 
          : 'glass border-white/10 text-white shadow-2xl'
      }`}>
        {/* Error notification */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-rose-500 bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl text-xs font-semibold mb-4 flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleEmailRegister} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className={`text-xs font-bold block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium border focus:outline-none focus:border-accent transition-colors ${
                  isLight 
                    ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400' 
                    : 'bg-dark-800 border-white/10 text-white placeholder-gray-500'
                }`}
                placeholder="Alex Morgan"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className={`text-xs font-bold block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium border focus:outline-none focus:border-accent transition-colors ${
                  isLight 
                    ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400' 
                    : 'bg-dark-800 border-white/10 text-white placeholder-gray-500'
                }`}
                placeholder="alex@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className={`text-xs font-bold block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              Password (min 6 chars)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-2xl py-3.5 pl-11 pr-11 text-sm font-medium border focus:outline-none focus:border-accent transition-colors ${
                  isLight 
                    ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400' 
                    : 'bg-dark-800 border-white/10 text-white placeholder-gray-500'
                }`}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className={`text-xs font-bold block ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium border focus:outline-none focus:border-accent transition-colors ${
                  isLight 
                    ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400' 
                    : 'bg-dark-800 border-white/10 text-white placeholder-gray-500'
                }`}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg"
            loading={loading} 
            className="py-3.5 mt-2"
          >
            <span>Create Account</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        {/* Footer sign in link */}
        <p className={`text-center mt-6 text-xs ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>

      <div className={`mt-6 text-center text-[11px] flex items-center justify-center gap-1.5 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
        <ShieldCheck size={14} className="text-accent" />
        <span>Free Forever &bull; No credit card required</span>
      </div>
    </motion.div>
  );
}
