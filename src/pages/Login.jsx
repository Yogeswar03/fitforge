import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import Button from '../components/ui/Button';
import AppLogo from '../components/ui/AppLogo';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle standard email login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.success) {
        navigate('/');
      } else {
        setError(res?.error || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
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
      <div className="flex flex-col items-center mb-7 text-center">
        <AppLogo size={68} animated={true} className="mb-3" />
        <h1 className="text-3xl font-black tracking-tight gradient-accent-text">FitForge</h1>
        <p className={`text-xs mt-1 font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          Forge Your Ultimate Fitness & Nutrition
        </p>
      </div>

      {/* Login Card */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl transition-colors ${
        isLight 
          ? 'bg-white border-gray-200 shadow-slate-100 text-gray-900' 
          : 'glass border-white/10 text-white shadow-2xl'
      }`}>
        <div className="mb-6">
          <h2 className="text-xl font-extrabold tracking-tight">Welcome Back 👋</h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
            Sign in with your email and password to access your workouts and diet.
          </p>
        </div>

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

        <form onSubmit={handleEmailLogin} className="space-y-4">
          {/* Email input */}
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
                placeholder="athlete@fitforge.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-bold ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                Password
              </label>
            </div>
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
                autoComplete="current-password"
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

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg"
            loading={loading} 
            className="py-3.5 mt-2"
          >
            <span>Sign In</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        {/* Footer sign up link */}
        <p className={`text-center mt-6 text-xs ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
          Don't have an account?{' '}
          <Link to="/register" className="text-accent font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>

      <div className={`mt-6 text-center text-[11px] flex items-center justify-center gap-1.5 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
        <ShieldCheck size={14} className="text-accent" />
        <span>End-to-End Encrypted Fitness Cloud Sync</span>
      </div>
    </motion.div>
  );
}
