'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { useMedia } from '@/lib/context/media-context';
import { 
  Search, 
  Upload, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Cloud, 
  LogOut, 
  User, 
  Settings,
  X,
  Plus
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-photon-border/80 bg-photon-obsidian/80 dark:bg-photon-obsidian/80 backdrop-blur-xl px-5 sm:px-8 transition-colors">
      {/* Search Input */}
      <div className="flex flex-1 items-center max-w-sm sm:max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-photon-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search optics, locations, timestamps..."
            className="w-full rounded-full bg-photon-card/80 border border-photon-border pl-9 pr-9 py-1.5 text-xs text-photon-ivory placeholder-photon-muted focus:border-white/40 focus:outline-none transition-colors font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-photon-muted hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Cloud / Local status badge */}
        <div 
          className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider text-photon-light border border-photon-border bg-photon-card/60"
          title={isCloudConnected ? "Supabase PostgreSQL RLS Active" : "IndexedDB Local Sandbox Active"}
        >
          {isCloudConnected ? (
            <>
              <Cloud className="h-3 w-3 text-accent-emerald" />
              <span>CLOUD SYNC</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3 w-3 text-accent-titanium" />
              <span>LOCAL SANDBOX</span>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-full text-photon-muted hover:text-white hover:bg-photon-card border border-transparent hover:border-photon-border transition-colors"
        >
          {preferences?.theme === 'dark' ? (
            <Sun className="h-3.5 w-3.5 text-accent-amber" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Shutter Style Upload Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase bg-photon-ivory hover:bg-white text-photon-obsidian font-semibold transition-all shadow-soft active:scale-[0.98]"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Media</span>
        </button>

        {/* User Identity Popover */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2 p-1 rounded-full border border-photon-border hover:border-photon-subtle transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-photon-card border border-white/10 flex items-center justify-center text-white text-xs font-serif">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'P'}
            </div>
          </button>

          {userDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-photon-dark border border-photon-border shadow-cinema py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setUserDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-photon-border">
                <p className="text-xs font-medium text-white truncate">
                  {user?.full_name || 'Curator'}
                </p>
                <p className="text-[11px] font-mono text-photon-muted truncate">
                  {user?.email || 'private@photon.local'}
                </p>
              </div>

              <div className="py-1 text-xs font-sans">
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-photon-light hover:text-white hover:bg-photon-card transition-colors"
                >
                  <User className="mr-2.5 h-3.5 w-3.5 text-photon-muted" /> Identity & Profile
                </Link>
                <Link
                  href="/settings/privacy"
                  className="flex items-center px-4 py-2 text-photon-light hover:text-white hover:bg-photon-card transition-colors"
                >
                  <ShieldCheck className="mr-2.5 h-3.5 w-3.5 text-photon-muted" /> Security & Privacy
                </Link>
                <Link
                  href="/settings/storage"
                  className="flex items-center px-4 py-2 text-photon-light hover:text-white hover:bg-photon-card transition-colors"
                >
                  <Settings className="mr-2.5 h-3.5 w-3.5 text-photon-muted" /> Storage Quota
                </Link>
              </div>

              <div className="border-t border-photon-border pt-1">
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center px-4 py-2 text-xs text-accent-crimson hover:bg-accent-crimson/10 transition-colors"
                >
                  <LogOut className="mr-2.5 h-3.5 w-3.5" /> Close Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
