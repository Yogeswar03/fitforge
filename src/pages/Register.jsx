import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, User, Mail, Lock, Phone, KeyRound, ShieldCheck, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const { register, sendPhoneOtp, verifyPhoneOtp } = useAuthStore();

  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  
  // Form states
  const [name, setName] = useState('');
  
  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Phone OTP states
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [testOtp, setTestOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle email registration
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
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
      await register(name, email, password);
      navigate('/onboarding');
    } catch (err) {
      setError('Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  // Handle send OTP for phone registration
  const handleSendPhoneOtp = async (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name first.');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);

    const fullPhone = `${countryCode}${cleanDigits.slice(-10)}`;
    const res = await sendPhoneOtp(fullPhone);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      setCountdown(30);
      setTestOtp(res.otp);
    } else {
      setError(res.error || 'Failed to send OTP.');
    }
  };

  // Handle verify OTP for phone registration
  const handleVerifyPhoneOtp = async (e) => {
    e?.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);

    const fullPhone = `${countryCode}${phone.replace(/\D/g, '').slice(-10)}`;
    const res = await verifyPhoneOtp(fullPhone, otpCode.trim(), name.trim());
    setLoading(false);

    if (res.success) {
      navigate('/onboarding');
    } else {
      setError(res.error || 'Invalid OTP code.');
    }
  };

  const autofillTestOtp = () => {
    if (testOtp) {
      setOtpCode(testOtp);
    } else {
      setOtpCode('123456');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-dark-900 text-white flex flex-col justify-center px-4 md:px-6 py-12 max-w-md mx-auto"
    >
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-xl shadow-accent/20 mb-3">
          <Dumbbell size={28} className="text-dark-900" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Join FitForge</h1>
        <p className="text-gray-400 text-xs mt-1">Start your science-backed fitness journey</p>
      </div>

      <div className="glass p-6 rounded-3xl border border-white/10 shadow-2xl">
        {/* Method Switcher Tabs */}
        <div className="flex bg-dark-800/90 p-1 rounded-2xl border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => { setAuthMethod('phone'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              authMethod === 'phone'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-dark-900 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Phone size={14} /> Phone OTP
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              authMethod === 'email'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-dark-900 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mail size={14} /> Email Signup
          </button>
        </div>

        {/* Error notification */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl text-xs font-semibold mb-4 flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================== */}
        {/* PHONE OTP SIGNUP */}
        {/* ============================================================== */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-accent transition-colors"
                      placeholder="Alex Turner"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-1.5">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="bg-dark-800 border border-white/10 rounded-2xl px-3 flex items-center text-sm font-bold text-accent">
                      {countryCode}
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        maxLength="10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-dark-800 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-accent transition-colors"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-accent" />
                    We will send a 6-digit SMS verification code
                  </p>
                </div>

                <Button type="submit" variant="primary" fullWidth loading={loading} className="py-3.5 mt-2">
                  Send Verification Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-2xl text-xs text-accent flex items-center justify-between">
                  <div>
                    <div className="font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Code Sent!
                    </div>
                    <div className="text-[11px] text-gray-300 mt-0.5">
                      Sent to {countryCode} {phone}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); setError(''); }}
                    className="text-[11px] text-accent underline font-semibold hover:opacity-80"
                  >
                    Change
                  </button>
                </div>

                {testOtp && (
                  <div className="p-2.5 bg-dark-800/80 border border-white/5 rounded-2xl text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Sparkles size={14} className="text-yellow-400" />
                      <span>Code: <strong className="text-accent tracking-widest">{testOtp}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={autofillTestOtp}
                      className="px-2.5 py-1 bg-accent/15 hover:bg-accent/25 text-accent text-[11px] font-bold rounded-lg transition-colors"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-1.5">
                    Enter 6-Digit OTP
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      maxLength="6"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-dark-800 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white font-mono text-xl tracking-[0.3em] font-extrabold text-center focus:outline-none focus:border-accent transition-colors"
                      placeholder="••••••"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                  <span>Didn't receive code?</span>
                  {countdown > 0 ? (
                    <span className="text-gray-500 font-medium">Resend in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      className="text-accent hover:underline font-bold flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> Resend OTP
                    </button>
                  )}
                </div>

                <Button type="submit" variant="primary" fullWidth loading={loading} className="py-3.5 mt-2">
                  Verify & Create Account
                </Button>
              </form>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* EMAIL & PASSWORD SIGNUP */}
        {/* ============================================================== */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="Alex Turner"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="athlete@fitforge.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading} className="py-3.5 mt-2">
              Create Account
            </Button>
          </form>
        )}

        <p className="text-center mt-6 text-gray-400 text-xs">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
