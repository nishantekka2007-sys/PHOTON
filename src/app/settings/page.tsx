'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/context/auth-context';
import { 
  User, 
  Mail, 
  Moon, 
  Sun, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Sliders 
} from 'lucide-react';

export default function SettingsPage() {
  const { user, preferences, updateProfile, updatePreferences, signOut } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [successNote, setSuccessNote] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    await updateProfile({ full_name: fullName.trim() });
    setSuccessNote('Profile updated successfully.');
    setTimeout(() => setSuccessNote(''), 3000);
  };

  const handleThemeChange = (theme: 'dark' | 'light' | 'system') => {
    updatePreferences({ theme });
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you absolutely sure you want to delete your PHOTON account? This removes your local session and profile.')) {
      await signOut();
      window.location.href = '/';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-500" />
            Account & Profile
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage your personal profile, credentials, and visual appearance
          </p>
        </div>

        {successNote && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Personal Information
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full max-w-md rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'private@photon.local'}
                className="w-full max-w-md rounded-xl bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 text-xs text-zinc-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                Linked to your secure session. Contact support to transfer ownership.
              </p>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Appearance Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Interface Theme
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            Choose how PHOTON looks across your devices
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                preferences?.theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50'
              }`}
            >
              <Moon className="h-5 w-5 mx-auto mb-1 text-indigo-400" />
              <span className="text-xs font-medium">Dark Mode</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                preferences?.theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50'
              }`}
            >
              <Sun className="h-5 w-5 mx-auto mb-1 text-amber-500" />
              <span className="text-xs font-medium">Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('system')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                preferences?.theme === 'system'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50'
              }`}
            >
              <Sliders className="h-5 w-5 mx-auto mb-1 text-zinc-400" />
              <span className="text-xs font-medium">System Auto</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
          <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-1">
            Danger Zone
          </h3>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mb-4 leading-relaxed">
            Deleting your account will erase your preferences and disconnect this device session.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Account & Reset Local Identity</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
