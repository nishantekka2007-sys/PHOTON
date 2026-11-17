'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { Mail, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await resetPassword(email);
      if (res.error) {
        setError(res.error);
      } else {
        setMessage(res.message || 'Passphrase recovery instructions dispatched.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch recovery email');
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
            Recover your access key.
          </h2>
          <p className="mt-1.5 text-xs font-mono text-photon-muted">
            Enter your email to receive recovery instructions
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
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-mono flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-photon-muted pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="curator@studio.com"
                  className="w-full rounded-xl bg-photon-card border border-photon-border pl-10 pr-4 py-2.5 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors font-sans"
                />
              </div>
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
                  <span>Send Recovery Instructions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-mono">
            <Link href="/auth/login" className="inline-flex items-center text-photon-muted hover:text-white transition-colors">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
