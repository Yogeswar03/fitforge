import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Mail, Lock } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || password.length < 6) {
      setError('Invalid email or password (min 6 chars).');
      return;
    }
    setError('');
    login(email, password);
    navigate('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-dark-900 text-white flex flex-col justify-center px-6 pb-24"
    >
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center shadow-lg shadow-accent/20 mb-4">
          <Dumbbell size={36} className="text-dark-900" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">FitForge</h1>
        <p className="text-accent2 mt-1">Forge Your Fitness</p>
      </div>

      <div className="glass p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6">Welcome back</h2>
        
        {error && <div className="text-red-400 bg-red-400/10 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-400 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-800 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-800 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth className="mt-6">
            Log In
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
