import React, { useState } from 'react';
import { 
  X, Lock, Mail, User as UserIcon, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, ShieldCheck 
} from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  
  // Register form state
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setLoginEmail('hariom@chandigarh.edu');
    setLoginPassword('CareerTwin2026!');
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      setSuccessNotice('Authentication successful. Redirecting to workspace...');
      setTimeout(() => {
        onSuccess(res.user);
        onClose();
      }, 300);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim() || regName.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });
      setSuccessNotice('Account successfully registered! Workspace initialized.');
      setTimeout(() => {
        onSuccess(res.user);
        onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pigeon-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-pigeon-900 border border-pigeon-600 rounded-2xl shadow-sheet overflow-hidden text-almond-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-pigeon-600 flex items-center justify-between bg-pigeon-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-acid-500 flex items-center justify-center text-pigeon-950 font-black text-sm shadow-sm">
              CT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-almond-200 tracking-tight">CareerTwin 2.0</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pigeon-700 text-acid-400 border border-pigeon-600">
                  SQLite Auth
                </span>
              </div>
              <p className="text-[11px] text-almond-600">Connecting Skills, Demand and Success.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-pigeon-700/60 hover:bg-pigeon-700 border border-pigeon-600 flex items-center justify-center text-almond-400 hover:text-almond-200 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 p-2 bg-pigeon-950/40 border-b border-pigeon-600 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-pigeon-800 text-almond-200 shadow-sm border border-pigeon-600 font-bold'
                : 'text-almond-600 hover:text-almond-400'
            }`}
          >
            Sign In to Session
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-pigeon-800 text-almond-200 shadow-sm border border-pigeon-600 font-bold'
                : 'text-almond-600 hover:text-almond-400'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-tomato-950/60 border border-tomato-500/40 flex items-start gap-2.5 text-xs text-tomato-300">
              <AlertCircle size={16} className="text-tomato-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successNotice && (
            <div className="mb-4 p-3 rounded-lg bg-acid-950/60 border border-acid-600/40 flex items-start gap-2.5 text-xs text-acid-300">
              <CheckCircle2 size={16} className="text-acid-400 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-almond-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-almond-600" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@university.edu"
                    required
                    className="w-full bg-pigeon-950 border border-pigeon-600 rounded-lg pl-9 pr-3.5 py-2 text-xs text-almond-200 placeholder-almond-600 focus:outline-none focus:border-acid-500 focus:ring-1 focus:ring-acid-500/50 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-almond-400">
                    Password
                  </label>
                  <span className="text-[10px] text-almond-600 font-mono">
                    PBKDF2-HMAC-SHA256
                  </span>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-almond-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    required
                    className="w-full bg-pigeon-950 border border-pigeon-600 rounded-lg pl-9 pr-10 py-2 text-xs text-almond-200 placeholder-almond-600 focus:outline-none focus:border-acid-500 focus:ring-1 focus:ring-acid-500/50 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-almond-600 hover:text-almond-300"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Demo Account Quick-Fill Card */}
              <div className="p-3 rounded-lg bg-pigeon-800/70 border border-pigeon-600 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-almond-200">
                    <Sparkles size={12} className="text-acid-400" />
                    <span>Demo Benchmark Account</span>
                  </div>
                  <p className="text-[10px] text-almond-600 font-mono">hariom@chandigarh.edu</p>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="px-2.5 py-1 rounded bg-pigeon-700 hover:bg-pigeon-600 border border-pigeon-500 text-[11px] font-semibold text-almond-200 transition-colors shrink-0"
                >
                  Autofill
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-acid-500 hover:bg-acid-400 text-pigeon-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-pigeon-950 border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In to CareerTwin</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-almond-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-almond-600" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Jane Watson"
                    required
                    className="w-full bg-pigeon-950 border border-pigeon-600 rounded-lg pl-9 pr-3.5 py-2 text-xs text-almond-200 placeholder-almond-600 focus:outline-none focus:border-acid-500 focus:ring-1 focus:ring-acid-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-almond-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-almond-600" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. jane.watson@mit.edu"
                    required
                    className="w-full bg-pigeon-950 border border-pigeon-600 rounded-lg pl-9 pr-3.5 py-2 text-xs text-almond-200 placeholder-almond-600 focus:outline-none focus:border-acid-500 focus:ring-1 focus:ring-acid-500/50 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-almond-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-almond-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full bg-pigeon-950 border border-pigeon-600 rounded-lg pl-9 pr-10 py-2 text-xs text-almond-200 placeholder-almond-600 focus:outline-none focus:border-acid-500 focus:ring-1 focus:ring-acid-500/50 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-almond-600 hover:text-almond-300"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-almond-400 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-almond-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full bg-pigeon-950 border border-pigeon-600 rounded-lg pl-9 pr-3.5 py-2 text-xs text-almond-200 placeholder-almond-600 focus:outline-none focus:border-acid-500 focus:ring-1 focus:ring-acid-500/50 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Data Isolation Notice */}
              <div className="p-3 rounded-lg bg-pigeon-800/40 border border-pigeon-600 flex items-start gap-2.5 text-[11px] text-almond-400">
                <ShieldCheck size={15} className="text-acid-400 shrink-0 mt-0.5" />
                <p>
                  Your account provides an isolated workspace. Custom uploaded datasets remain private to your user ID, while benchmark datasets remain accessible.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-acid-500 hover:bg-acid-400 text-pigeon-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-pigeon-950 border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <span>Create Account & Enter Platform</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Enterprise SSO notice (Transparent, no fake flow) */}
          <div className="mt-5 pt-4 border-t border-pigeon-600 text-center">
            <p className="text-[10px] text-almond-600 font-mono">
              Enterprise SAML / OAuth SSO is disabled for hackathon evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
