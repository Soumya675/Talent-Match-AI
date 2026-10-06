import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';
import { Mail, Phone, Lock, ArrowRight, RefreshCw, X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRole = 'CANDIDATE'
}) => {
  const [authMode, setAuthMode] = useState<'OTP_INPUT' | 'OTP_VERIFY' | 'PASSWORD'>('OTP_INPUT');
  const [destination, setDestination] = useState('alex.rivera@example.com');
  const [role, setRole] = useState<UserRole>(initialRole);
  
  // 6-digit OTP code state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Timers
  const [expiresInSeconds, setExpiresInSeconds] = useState(300); // 5 min
  const [resendCooldown, setResendCooldown] = useState(60); // 60s
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  // Password fields
  const [password, setPassword] = useState('Password123!');

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  // Countdown timer for OTP expiry and resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authMode === 'OTP_VERIFY') {
      timer = setInterval(() => {
        setExpiresInSeconds(prev => (prev > 0 ? prev - 1 : 0));
        setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authMode]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maskDestination = (dest: string) => {
    if (dest.includes('@')) {
      const [name, domain] = dest.split('@');
      if (name.length <= 2) return `${name}***@${domain}`;
      return `${name[0]}***${name[name.length - 1]}@${domain}`;
    }
    // Phone
    return dest.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    if (!destination.trim()) {
      setErrorMsg('Please enter an email or mobile phone number');
      return;
    }

    setIsSending(true);
    // Simulate server call: POST /api/v1/auth/send-otp
    setTimeout(() => {
      setIsSending(false);
      // Generate demo 6-digit OTP
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoOtpHint(generated);
      setAuthMode('OTP_VERIFY');
      setExpiresInSeconds(300);
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 100);
    }, 600);
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const clean = value.replace(/\D/g, '');
    if (!clean && value !== '') return;

    const newDigits = [...otpDigits];
    
    // Handle paste of 6 digits
    if (clean.length > 1) {
      const pasted = clean.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      digitInputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = clean.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance
    if (clean && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits of your OTP code');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsVerifying(false);
      // Verification logic: accept the hint or default 482913
      if (entered === demoOtpHint || entered === '482913' || entered.length === 6) {
        const user: User = {
          id: `usr-${Date.now()}`,
          email: destination.includes('@') ? destination : undefined,
          phone: !destination.includes('@') ? destination : undefined,
          name: destination.includes('@') 
            ? destination.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
            : 'Verified Candidate',
          role: role,
          isVerified: true,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        };
        onSuccess(user);
        onClose();
      } else {
        setErrorMsg('Invalid verification code. Please check and try again.');
      }
    }, 600);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const user: User = {
        id: `usr-${Date.now()}`,
        email: destination,
        name: destination.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: role,
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      };
      onSuccess(user);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Quick Demo Pre-fill Bar */}
        <div className="mb-5 pb-4 border-b border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Demo Credentials:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setDestination('alex.rivera@example.com');
                setRole('CANDIDATE');
              }}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg border text-center transition-all ${
                role === 'CANDIDATE' && destination.includes('alex')
                  ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Candidate
            </button>

            <button
              type="button"
              onClick={() => {
                setDestination('sarah.chen@cloudscale.io');
                setRole('EMPLOYER');
              }}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg border text-center transition-all ${
                role === 'EMPLOYER'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Employer
            </button>

            <button
              type="button"
              onClick={() => {
                setDestination('admin@careerai.io');
                setRole('ADMIN');
              }}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg border text-center transition-all ${
                role === 'ADMIN'
                  ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* STATE 1: Enter Email / Mobile */}
        {authMode === 'OTP_INPUT' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                Welcome Back 👋
              </h2>
              <p className="text-xs text-slate-400">
                Sign in with OTP or password to access your {role.toLowerCase()} portal
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email / Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    {destination.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="user@example.com or +1555019283"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative px-3 text-[11px] uppercase tracking-wider text-slate-500 bg-slate-900">
                OR
              </span>
            </div>

            <button
              onClick={() => setAuthMode('PASSWORD')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition-colors"
            >
              Continue with Password
            </button>
          </div>
        )}

        {/* STATE 2: Verify 6-digit OTP */}
        {authMode === 'OTP_VERIFY' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Verify OTP
              </h2>
              <p className="text-xs text-slate-400">
                OTP sent to <span className="text-slate-200 font-medium">{maskDestination(destination)}</span>
              </p>
              {demoOtpHint && (
                <div className="mt-2 inline-block px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                  Test code: <strong className="font-bold tracking-wider">{demoOtpHint}</strong>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* 6 separate digit boxes */}
              <div className="flex justify-between items-center gap-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      digitInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-13 text-center text-xl font-bold font-mono bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                ))}
              </div>

              {/* Expiry Timer */}
              <div className="text-center">
                <p className="text-xs text-slate-400">
                  Expires in <span className="font-mono text-blue-400 font-semibold">{formatTimer(expiresInSeconds)}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying || otpDigits.join('').length < 6}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP</span>
                  </>
                )}
              </button>

              {/* Resend Link */}
              <div className="text-center text-xs text-slate-400">
                {resendCooldown > 0 ? (
                  <span>Didn't receive it? Resend OTP in {resendCooldown} seconds</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-blue-400 hover:underline font-semibold"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('OTP_INPUT')}
                  className="text-[11px] text-slate-500 hover:text-slate-300"
                >
                  Change email or phone number
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STATE 3: Password Fallback */}
        {authMode === 'PASSWORD' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">
                Password Login
              </h2>
              <p className="text-xs text-slate-400">
                Sign in with your email and master password
              </p>
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('OTP_INPUT')}
                className="w-full text-center text-xs text-blue-400 hover:underline pt-2 font-medium"
              >
                Switch back to passwordless OTP login
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
