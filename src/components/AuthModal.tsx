/**
 * @file AuthModal.tsx
 * @description iOS style Firebase Auth sheet modal for Harmony OS Super App.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Flame, User, Mail, Lock, LogIn, UserPlus, LogOut, CheckCircle2 } from 'lucide-react';
import { loginAnonymously, loginWithEmail, registerWithEmail, logoutUser } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { uid: string; email: string | null; displayName: string | null; isAnonymous: boolean } | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousAuth = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await loginAnonymously();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in anonymously');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-[#c9d1d9] shadow-2xl relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#30363d] mb-5">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">Firebase User Account</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-2">
                <User className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-white text-base">{currentUser.email || 'Anonymous User'}</h4>
              <p className="text-xs text-amber-300/80 font-mono mt-0.5">UID: {currentUser.uid}</p>
              <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Real-time Firestore Sync Active
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-2xl bg-red-600/30 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Firebase</span>
            </button>
          </div>
        ) : (
          <div>
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8b949e] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-white text-sm focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8b949e] mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8b949e] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-white text-sm focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Sign In with Email' : 'Create Account'}</span>
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px bg-[#30363d] flex-1" />
              <span className="text-[10px] uppercase text-[#8b949e] font-mono">OR</span>
              <div className="h-px bg-[#30363d] flex-1" />
            </div>

            <button
              onClick={handleAnonymousAuth}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-white font-semibold text-sm border border-[#30363d] transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Continue as Anonymous Guest</span>
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign In'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
