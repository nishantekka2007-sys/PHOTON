'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxEnter = async () => {
    setLoading(true);
    await signInWithEmail('curator@photon.local', 'photon-demo-pass');
    router.push('/dashboard');
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
            Welcome back to your sanctuary.
          </h2>
          <p className="mt-1.5 text-xs font-mono text-photon-muted">
            Enter your credentials to unlock your private vault
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
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-photon-muted pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="curator@studio.com"
                  className="w-full rounded-xl bg-photon-card border border-photon-border pl-10 pr-4 py-3 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] font-mono text-photon-muted hover:text-white transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-photon-muted pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl bg-photon-card border border-photon-border pl-10 pr-10 py-3 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-photon-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-mono tracking-cinema uppercase font-semibold bg-photon-ivory hover:bg-white text-photon-obsidian shadow-soft transition-all active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Sandbox Access Divider */}
          <div className="mt-6 pt-6 border-t border-photon-border text-center">
            <button
              type="button"
              onClick={handleSandboxEnter}
              className="w-full py-3 px-4 rounded-xl text-xs font-mono tracking-wider uppercase border border-photon-border bg-photon-card/50 hover:bg-photon-card text-photon-light hover:text-white transition-colors flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="h-4 w-4 text-accent-emerald" />
              <span>Instant Local Sandbox Mode</span>
            </button>
            <p className="mt-2 text-[10px] font-mono text-photon-muted">
              Zero registration needed &bull; Complete IndexedDB offline privacy
            </p>
          </div>

          <div className="mt-6 text-center text-xs font-sans text-photon-muted">
            New to PHOTON?{' '}
            <Link href="/auth/register" className="text-white hover:underline font-medium">
              Create your private account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
