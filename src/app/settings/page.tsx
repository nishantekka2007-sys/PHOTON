'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/context/auth-context';
import { 
  User, 
  Moon, 
  Sun, 
  Trash2, 
  Check, 
  Sliders 
} from 'lucide-react';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

export default function SettingsPage() {
  const { user, preferences, updateProfile, updatePreferences, signOut } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [successNote, setSuccessNote] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    await updateProfile({ full_name: fullName.trim() });
    setSuccessNote('Profile specifications updated.');
    setTimeout(() => setSuccessNote(''), 3000);
  };

  const handleThemeChange = (theme: 'dark' | 'light' | 'system') => {
    updatePreferences({ theme });
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you absolutely certain you wish to purge your local session identity?')) {
      await signOut();
      window.location.href = '/';
    }
  };

  return (
    <AppLayout>
      <motion.div
        variants={staggerEditorial}
        initial="hidden"
        animate="show"
        className="max-w-3xl space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemFadeUp} className="pb-6 border-b border-photon-border">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
            <User className="h-3.5 w-3.5" />
            <span>Curator Identity</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            Profile & Atmosphere
          </h1>
          <p className="text-xs font-mono text-photon-muted mt-1">
            Manage your curator credentials, personal metadata, and visual studio atmosphere
          </p>
        </motion.div>

        {successNote && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-mono flex items-center gap-2"
          >
            <Check className="h-4 w-4 shrink-0" />
            <span>{successNote}</span>
          </motion.div>
        )}

        {/* Curator Profile Card */}
        <motion.div
          variants={itemFadeUp}
          className="p-6 sm:p-8 rounded-3xl bg-photon-card border border-photon-border shadow-soft space-y-6"
        >
          <h3 className="font-serif text-xl font-normal text-white">
            Curator Credentials
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase mb-2">
                Public Exhibition Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full max-w-md rounded-xl bg-photon-dark border border-photon-border px-4 py-2.5 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase mb-2">
                Sovereign Key Identifier (Email)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'curator@photon.local'}
                className="w-full max-w-md rounded-xl bg-photon-dark/50 border border-photon-border px-4 py-2.5 text-xs text-photon-muted cursor-not-allowed font-mono"
              />
              <p className="text-[10px] font-mono text-photon-muted mt-1.5">
                Bound to your PostgreSQL RLS session token.
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-photon-ivory hover:bg-white text-photon-obsidian text-xs font-mono tracking-cinema uppercase font-semibold transition-all active:scale-[0.98]"
            >
              Update Credentials
            </button>
          </form>
        </motion.div>

        {/* Studio Atmosphere */}
        <motion.div
          variants={itemFadeUp}
          className="p-6 sm:p-8 rounded-3xl bg-photon-card border border-photon-border shadow-soft space-y-4"
        >
          <div>
            <h3 className="font-serif text-xl font-normal text-white">
              Studio Atmosphere
            </h3>
            <p className="text-xs font-sans text-photon-light font-light mt-0.5">
              Select your preferred visual environment
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md pt-2">
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-2xl border text-center transition-all ${
                preferences?.theme === 'dark'
                  ? 'border-white bg-photon-dark text-white ring-1 ring-white/30'
                  : 'border-photon-border bg-photon-dark/50 text-photon-muted hover:text-white'
              }`}
            >
              <Moon className="h-5 w-5 mx-auto mb-2 text-accent-titanium" />
              <span className="text-xs font-mono uppercase tracking-wider">Darkroom</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-2xl border text-center transition-all ${
                preferences?.theme === 'light'
                  ? 'border-white bg-photon-dark text-white ring-1 ring-white/30'
                  : 'border-photon-border bg-photon-dark/50 text-photon-muted hover:text-white'
              }`}
            >
              <Sun className="h-5 w-5 mx-auto mb-2 text-accent-gold" />
              <span className="text-xs font-mono uppercase tracking-wider">Gallery</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('system')}
              className={`p-4 rounded-2xl border text-center transition-all ${
                preferences?.theme === 'system'
                  ? 'border-white bg-photon-dark text-white ring-1 ring-white/30'
                  : 'border-photon-border bg-photon-dark/50 text-photon-muted hover:text-white'
              }`}
            >
              <Sliders className="h-5 w-5 mx-auto mb-2 text-photon-muted" />
              <span className="text-xs font-mono uppercase tracking-wider">Automatic</span>
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          variants={itemFadeUp}
          className="p-6 sm:p-8 rounded-3xl border border-accent-crimson/30 bg-accent-crimson/5 space-y-4"
        >
          <div>
            <h3 className="font-serif text-xl font-normal text-accent-crimson">
              Reset Vault Identity
            </h3>
            <p className="text-xs font-sans text-photon-light font-light mt-1">
              Purges your remembered preferences and terminates this browser session.
            </p>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full border border-accent-crimson/40 bg-accent-crimson/10 text-accent-crimson text-xs font-mono uppercase tracking-wider hover:bg-accent-crimson hover:text-white transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Reset Identity Token</span>
          </button>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
