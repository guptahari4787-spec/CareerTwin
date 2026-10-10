import React, { useState } from 'react';
import { 
  Lock, Mail, User as UserIcon, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, ShieldCheck, 
  Database, Cpu, BarChart3, Binary
} from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('hariom@chandigarh.edu');
  const [loginPassword, setLoginPassword] = useState<string>('CareerTwin2026!');
  
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

  const handleFillDemo = () => {
    setLoginEmail('hariom@chandigarh.edu');
    setLoginPassword('CareerTwin2026!');
    setErrorMessage(null);
  };

  const handleQuickDemoLogin = async () => {
    setErrorMessage(null);
    try {
      setLoading(true);
      const res = await api.login({
        email: 'hariom@chandigarh.edu',
        password: 'CareerTwin2026!',
      });
      setSuccessNotice('Signed in as Hackathon Evaluator (Hariom Gupta). Entering workspace...');
      setTimeout(() => {
        onAuthSuccess(res.user);
      }, 350);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to backend authentication service.');
    } finally {
      setLoading(false);
    }
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
      setSuccessNotice('Authentication verified. Loading analytical environment...');
      setTimeout(() => {
        onAuthSuccess(res.user);
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
      setSuccessNotice('Account created successfully! Initializing personalized workspace...');
      setTimeout(() => {
        onAuthSuccess(res.user);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soil-950 text-cream font-sans flex flex-col justify-between selection:bg-basil selection:text-soil-950">
      
      {/* Top Navbar Header */}
      <header className="h-16 border-b border-border px-6 md:px-12 flex items-center justify-between bg-soil-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-basil flex items-center justify-center text-soil-950 font-black text-sm shadow-sm">
            CT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-cream-heading text-base">CAREERTWIN</span>
              <span className="text-[10px] font-bold bg-basil-soft text-basil-300 border border-basil-dark px-1.5 py-0.5 rounded font-mono">
                2.0
              </span>
            </div>
            <p className="text-[11px] text-cream-muted font-medium">Workforce Intelligence & Analytical Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-basil animate-pulse"></span>
          <span className="text-cream-muted font-mono hidden sm:inline">17,743 Records Live in SQLite</span>
        </div>
      </header>

      {/* Main Split Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Product Value & Analytical Context */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border text-xs text-basil font-mono">
              <Sparkles size={13} />
              <span>Connecting Skills, Demand and Success</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-cream-heading tracking-tight leading-[1.15]">
              Data-Driven Workforce Intelligence & Outcome Prediction
            </h1>
            <p className="text-sm md:text-base text-cream-secondary leading-relaxed max-w-2xl">
              CareerTwin bridges the gap between macroeconomic market hiring signals, student capabilities, and empirical post-graduation career success through rigorous machine learning validation and deterministic alignment models.
            </p>
          </div>

          {/* Analytical Stack Proof Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Database size={15} className="text-basil" />
                <h4 className="text-xs font-bold text-cream-heading">17,743 Real Postings</h4>
              </div>
              <p className="text-[11px] text-cream-muted leading-relaxed">
                Full-funnel demand extraction across roles, technical capabilities, seniority tiers, and regional distributions.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Cpu size={15} className="text-basil" />
                <h4 className="text-xs font-bold text-cream-heading">Empirical Validation</h4>
              </div>
              <p className="text-[11px] text-cream-muted leading-relaxed">
                Statsmodels Logit odds ratios cross-validated against Scikit-Learn Random Forest outcome classifiers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-2.5 mb-1.5">
                <BarChart3 size={15} className="text-basil" />
                <h4 className="text-xs font-bold text-cream-heading">Isolated Workspaces</h4>
              </div>
              <p className="text-[11px] text-cream-muted leading-relaxed">
                Custom dataset uploads and simulator experiments are safely partitioned by authenticated user ID in SQLite.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Binary size={15} className="text-basil" />
                <h4 className="text-xs font-bold text-cream-heading">PBKDF2-HMAC-SHA256</h4>
              </div>
              <p className="text-[11px] text-cream-muted leading-relaxed">
                Cryptographic salted password hashing with 260,000 rounds and secure bearer session authentication.
              </p>
            </div>
          </div>

          {/* Quick Evaluator Access Banner */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-basil"></span>
                <span className="text-xs font-bold text-cream-heading">Evaluating for Hackathon / Jury Review?</span>
              </div>
              <p className="text-xs text-cream-muted mt-0.5">
                Skip credential entry and access the pre-configured verified student profile directly.
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-basil hover:bg-basil-600 text-soil-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 disabled:opacity-50"
            >
              <Sparkles size={14} />
              <span>1-Click Evaluator Sign In</span>
            </button>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-5">
          <div className="w-full max-w-md mx-auto bg-soil-900 border border-border rounded-2xl shadow-sheet overflow-hidden text-cream flex flex-col">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-soil-950 border-b border-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-surface text-cream-heading shadow-sm font-bold border border-border'
                    : 'text-cream-muted hover:text-cream'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-surface text-cream-heading shadow-sm font-bold border border-border'
                    : 'text-cream-muted hover:text-cream'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="p-6">
              
              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-tomato-950/60 border border-tomato-500/40 flex items-start gap-2.5 text-xs text-tomato-300">
                  <AlertCircle size={15} className="text-tomato-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Message */}
              {successNotice && (
                <div className="mb-4 p-3 rounded-lg bg-basil-950/60 border border-basil-500/40 flex items-start gap-2.5 text-xs text-basil-300">
                  <CheckCircle2 size={15} className="text-basil-400 shrink-0 mt-0.5" />
                  <span>{successNotice}</span>
                </div>
              )}

              {mode === 'login' ? (
                /* ================= SIGN IN FORM ================= */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-cream-secondary mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-muted" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="name@university.edu"
                        required
                        className="w-full bg-soil-950 border border-border rounded-lg pl-9 pr-3.5 py-2 text-xs text-cream placeholder-cream-muted focus:outline-none focus:border-basil focus:ring-1 focus:ring-basil transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-cream-secondary">
                        Password
                      </label>
                      <span className="text-[10px] text-cream-muted font-mono">
                        PBKDF2 SHA-256
                      </span>
                    </div>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter account password"
                        required
                        className="w-full bg-soil-950 border border-border rounded-lg pl-9 pr-10 py-2 text-xs text-cream placeholder-cream-muted focus:outline-none focus:border-basil focus:ring-1 focus:ring-basil transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-muted hover:text-cream"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Pre-filled Benchmark Credentials Helper */}
                  <div className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-cream-heading">
                        <Sparkles size={12} className="text-basil" />
                        <span>Demo Account</span>
                      </div>
                      <p className="text-[10px] text-cream-muted font-mono">hariom@chandigarh.edu</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleFillDemo}
                      className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-surface border border-border text-[11px] font-semibold text-cream transition-colors shrink-0"
                    >
                      Autofill
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-lg bg-basil hover:bg-basil-600 text-soil-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-soil-950 border-t-transparent rounded-full animate-spin"></span>
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        <span>Sign In to Platform</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ================= REGISTER FORM ================= */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-cream-secondary mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-muted" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Hariom Gupta"
                        required
                        className="w-full bg-soil-950 border border-border rounded-lg pl-9 pr-3.5 py-2 text-xs text-cream placeholder-cream-muted focus:outline-none focus:border-basil focus:ring-1 focus:ring-basil transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-secondary mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-muted" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. hariom@chandigarh.edu"
                        required
                        className="w-full bg-soil-950 border border-border rounded-lg pl-9 pr-3.5 py-2 text-xs text-cream placeholder-cream-muted focus:outline-none focus:border-basil focus:ring-1 focus:ring-basil transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-secondary mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        className="w-full bg-soil-950 border border-border rounded-lg pl-9 pr-10 py-2 text-xs text-cream placeholder-cream-muted focus:outline-none focus:border-basil focus:ring-1 focus:ring-basil transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-muted hover:text-cream"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-secondary mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        required
                        className="w-full bg-soil-950 border border-border rounded-lg pl-9 pr-3.5 py-2 text-xs text-cream placeholder-cream-muted focus:outline-none focus:border-basil focus:ring-1 focus:ring-basil transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Isolated workspace guarantee */}
                  <div className="p-3 rounded-lg bg-surface border border-border flex items-start gap-2.5 text-[11px] text-cream-muted">
                    <ShieldCheck size={15} className="text-basil shrink-0 mt-0.5" />
                    <p>
                      Your account creates an isolated workspace in SQLite. Uploaded datasets and scenarios are private to your user ID.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-lg bg-basil hover:bg-basil-600 text-soil-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-soil-950 border-t-transparent rounded-full animate-spin"></span>
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
            </div>

            {/* Card Footer */}
            <div className="p-3 border-t border-border bg-soil-950/60 text-center">
              <span className="text-[10px] text-cream-muted font-mono">
                CareerTwin 2.0 Security Subsystem • SQLite PBKDF2 Hashing
              </span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-border px-6 md:px-12 flex items-center justify-between text-xs text-cream-muted bg-soil-900/40">
        <div>© 2026 CareerTwin Intelligence Framework. All rights reserved.</div>
        <div className="font-mono text-[11px] text-basil">Status: Operational</div>
      </footer>

    </div>
  );
};
