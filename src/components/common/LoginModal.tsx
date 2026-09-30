import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, User, KeyRound } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { login, users, switchUser } = useApp();
  const [email, setEmail] = useState('dulce.rhea@aflia.com');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your company email address.');
      return;
    }
    const success = login(email, password);
    if (!success) {
      setErrorMsg('Invalid credentials. Please select one of the registered staff demo accounts below.');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setResetModalOpen(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071733] via-[#0f2b5c] to-[#1e3a8a] flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Decorative background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Top Header Card with Authentic Official Logo on White Ground */}
        <div className="bg-white px-8 pt-8 pb-5 text-center relative border-b border-slate-200">
          <div className="flex justify-center mb-1">
            <Logo size="lg" variant="color" layout="stacked" showSubtitle={true} />
          </div>
          <div className="inline-block mt-3 px-3.5 py-1 rounded-full bg-slate-100 text-[#0f2b5c] text-[10px] font-extrabold uppercase tracking-widest border border-slate-200">
            Internal Staff Management Portal
          </div>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
            Authorized attendance, work arrangement, and leave management system.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Staff Corporate Email
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c] focus:bg-white"
                  placeholder="name@aflia.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2b5c] focus:bg-white"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-[#0f2b5c] hover:bg-[#153a7a] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <span>Authenticate & Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Quick Demo Instant Sign-in:</span>
              <span className="text-[10px] text-amber-600 font-semibold">1-Click</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  switchUser('user-admin');
                }}
                className="p-2.5 text-left rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#0f2b5c]">
                  <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">Dulce Rhea Buling</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">CEO (Administrator)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchUser('user-merelil');
                }}
                className="p-2.5 text-left rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">Merelil Mitra</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Recruitment Officer</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchUser('user-allen');
                }}
                className="p-2.5 text-left rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Allen Mae Balangitan-Del Sol</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">GOA / Admin</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchUser('user-maria');
                }}
                className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">Maria Santos</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Senior Underwriter (Staff)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-600" />
          <span>AFLIA Encrypted Employee Gateway · Internal Use Only</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0f2b5c]">Password Recovery</h3>
                <p className="text-xs text-slate-500">AFLIA Security Protocol</p>
              </div>
            </div>

            {resetSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Password reset link sent to registered email! Redirecting...
                </span>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-3">
                <p className="text-xs text-slate-600">
                  Enter your registered staff email address to receive secure OTP reset credentials.
                </p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="your.email@aflia.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                  required
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#0f2b5c] hover:bg-[#153a7a] rounded-lg"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
