'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { useMedia } from '@/lib/context/media-context';
import { 
  Sparkles, 
  Search, 
  Upload, 
  Sun, 
  Moon, 
  ShieldCheck, 
  CloudOff, 
  Cloud, 
  LogOut, 
  User, 
  Settings,
  X
} from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
}

export function Navbar({ onOpenUpload }: NavbarProps) {
  const { user, preferences, updatePreferences, signOut, isCloudConnected } = useAuth();
  const { searchQuery, setSearchQuery } = useMedia();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = preferences?.theme === 'dark' ? 'light' : 'dark';
    updatePreferences({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 sm:px-6 transition-colors">
      {/* Search Bar */}
      <div className="flex flex-1 items-center max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos, videos, cameras, dates..."
            className="w-full rounded-full bg-zinc-100 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 pl-9 pr-9 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Cloud / Local status badge */}
        <div 
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
          title={isCloudConnected ? "Connected to Supabase PostgreSQL & Storage" : "Operating in Private Local First mode via IndexedDB"}
        >
          {isCloudConnected ? (
            <>
              <Cloud className="h-3.5 w-3.5 text-emerald-500" />
              <span>Cloud Sync</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Private Local-First</span>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          {preferences?.theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all active:scale-95"
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Upload Media</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2 p-1 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-400 flex items-center justify-center text-white text-xs font-semibold">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'P'}
            </div>
          </button>

          {userDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={() => setUserDropdownOpen(false)}
            >
              <div className="px-3.5 py-2 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {user?.full_name || 'PHOTON Member'}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {user?.email || 'private@photon.local'}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  className="flex items-center px-3.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <User className="mr-2 h-3.5 w-3.5" /> Profile & Account
                </Link>
                <Link
                  href="/settings/privacy"
                  className="flex items-center px-3.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Privacy & Security
                </Link>
                <Link
                  href="/settings/storage"
                  className="flex items-center px-3.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Settings className="mr-2 h-3.5 w-3.5" /> Storage Quota
                </Link>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center px-3.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
