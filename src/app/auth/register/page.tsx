'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { ShieldCheck, Lock, Mail, User, ArrowRight, Eye, EyeOff, Loader2, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strength = getStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!agreePrivacy) {
      setError('Please acknowledge our zero-data-harvesting privacy terms.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const result = await signUpWithEmail(email, password, fullName);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage(result.message || 'Account established successfully.');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-photon-obsidian text-photon-ivory flex flex-col justify-center py-12 px-6 relative film-grain selection:bg-neutral-800">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-4">
            <span className="font-serif text-3xl tracking-widest text-white uppercase">
              PHOTON
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-normal text-white tracking-tight">
            Claim your sovereign vault.
          </h2>
          <p className="mt-1.5 text-xs font-mono text-photon-muted">
            Independent, encrypted, and isolated by PostgreSQL Row Level Security
          </p>
        </div>

        <div className="border border-photon-border rounded-3xl bg-photon-dark/95 p-8 shadow-cinema backdrop-blur-xl">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-accent-crimson/10 border border-accent-crimson/30 text-accent-crimson text-xs font-mono"
              >
                {error}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-mono flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase mb-1.5">
                Curator Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-photon-muted pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full rounded-xl bg-photon-card border border-photon-border pl-10 pr-4 py-2.5 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-photon-muted pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@studio.com"
                  className="w-full rounded-xl bg-photon-card border border-photon-border pl-10 pr-4 py-2.5 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase mb-1.5">
                Master Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-photon-muted pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl bg-photon-card border border-photon-border pl-10 pr-10 py-2.5 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-photon-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength indicators */}
              {password && (
                <div className="mt-2 flex items-center space-x-1.5">
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 1 ? 'bg-accent-crimson' : 'bg-photon-border'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 2 ? 'bg-accent-amber' : 'bg-photon-border'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-accent-emerald' : 'bg-photon-border'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 4 ? 'bg-white' : 'bg-photon-border'}`} />
                </div>
              )}
            </div>

            <div className="pt-2 flex items-start space-x-2.5">
              <input
                type="checkbox"
                id="privacyCheck"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-0.5 rounded border-photon-border bg-photon-card text-white focus:ring-0"
              />
              <label htmlFor="privacyCheck" className="text-[11px] text-photon-light leading-relaxed font-light">
                I understand PHOTON never trains AI models on my photos, never tracks my identity, and isolates my data with Row-Level Security.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-mono tracking-cinema uppercase font-semibold bg-photon-ivory hover:bg-white text-photon-obsidian shadow-soft transition-all active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Create Sovereign Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-sans text-photon-muted">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-white hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
