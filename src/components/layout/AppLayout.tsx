'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { UploadModal } from '@/components/media/UploadModal';
import { useAuth } from '@/lib/context/auth-context';
import { ShieldCheck, Info, X } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [dismissedNotice, setDismissedNotice] = useState(false);
  const { isCloudConnected } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Navbar onOpenUpload={() => setIsUploadOpen(true)} />

        {/* Local First Informational Banner if Supabase is not configured */}
        {!isCloudConnected && !dismissedNotice && (
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-200 dark:border-indigo-900/50 px-4 py-2 text-xs flex items-center justify-between text-indigo-900 dark:text-indigo-200">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>
                <strong>Private Local-First Mode Active:</strong> Your photos & videos are stored securely in your browser&apos;s IndexedDB sandbox. Zero data leaves your device.
              </span>
            </div>
            <button
              onClick={() => setDismissedNotice(true)}
              className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200 p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
