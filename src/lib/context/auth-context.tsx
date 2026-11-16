'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile, UserPreferences } from '@/types';
import { idbGetPreferences, idbSavePreferences } from '@/lib/db/indexed-db';

interface AuthContextType {
  user: Profile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  isCloudConnected: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
}

const LOCAL_STORAGE_USER_KEY = 'photon_local_user';

const defaultPreferences = (userId: string): UserPreferences => ({
  user_id: userId,
  theme: 'dark',
  remember_recent_searches: true,
  compact_view: false,
  auto_detect_duplicates: true,
  cloud_sync_enabled: isSupabaseConfigured,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Apply theme to document element
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const theme = preferences?.theme || 'dark';
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [preferences?.theme]);

  // Initial session check
  useEffect(() => {
    async function initSession() {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile: Profile = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member',
              avatar_url: session.user.user_metadata?.avatar_url || null,
              storage_used_bytes: 0,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at,
            };
            setUser(profile);
            const savedPrefs = await idbGetPreferences(profile.id);
            setPreferences(savedPrefs || defaultPreferences(profile.id));
            setLoading(false);
            return;
          }
        }

        // Check local storage for offline / local-first session
        const localUserJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (localUserJson) {
          const localUser = JSON.parse(localUserJson) as Profile;
          setUser(localUser);
          const savedPrefs = await idbGetPreferences(localUser.id);
          setPreferences(savedPrefs || defaultPreferences(localUser.id));
        } else {
          // Provide instant offline guest identity if no user logged in
          const guestUser: Profile = {
            id: 'local-owner-001',
            email: 'you@photon.local',
            full_name: 'PHOTON Owner',
            avatar_url: null,
            storage_used_bytes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestUser));
          setUser(guestUser);
          const savedPrefs = await idbGetPreferences(guestUser.id);
          setPreferences(savedPrefs || defaultPreferences(guestUser.id));
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
      } finally {
        setLoading(false);
      }
    }

    initSession();

    // Listen for Supabase auth state changes if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile: Profile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member',
            avatar_url: session.user.user_metadata?.avatar_url || null,
            storage_used_bytes: 0,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at,
          };
          setUser(profile);
          const savedPrefs = await idbGetPreferences(profile.id);
          setPreferences(savedPrefs || defaultPreferences(profile.id));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const profile: Profile = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url || null,
          storage_used_bytes: 0,
          created_at: data.user.created_at,
          updated_at: data.user.created_at,
        };
        setUser(profile);
        return {};
      }
    }

    // Local / Offline authentication fallback
    const localUser: Profile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      full_name: email.split('@')[0],
      avatar_url: null,
      storage_used_bytes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
    const prefs = defaultPreferences(localUser.id);
    await idbSavePreferences(prefs);
    setPreferences(prefs);
    return {};
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) return { error: error.message };
      if (data.user && !data.session) {
        return { message: 'Confirmation link sent to your email. Please verify to sign in.' };
      }
      if (data.user) {
        const profile: Profile = {
          id: data.user.id,
          email,
          full_name: fullName,
          avatar_url: null,
          storage_used_bytes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(profile);
        return { message: 'Account created successfully!' };
      }
    }

    // Local registration fallback
    const localUser: Profile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      full_name: fullName || email.split('@')[0],
      avatar_url: null,
      storage_used_bytes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
    const prefs = defaultPreferences(localUser.id);
    await idbSavePreferences(prefs);
    setPreferences(prefs);
    return { message: 'Local secure account created!' };
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setUser(null);
    setPreferences(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!preferences || !user) return;
    const updated = { ...preferences, ...updates, updated_at: new Date().toISOString() };
    setPreferences(updated);
    await idbSavePreferences(updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('user_preferences').upsert(updated);
    }
  };

  const resetPassword = async (email: string) => {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) return { error: error.message };
      return { message: 'Password reset link sent to your email.' };
    }
    return { message: 'Offline mode: Password reset instructions simulated for ' + email };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        preferences,
        loading,
        isCloudConnected: isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateProfile,
        updatePreferences,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
