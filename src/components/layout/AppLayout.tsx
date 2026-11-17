'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { UploadModal } from '@/components/media/UploadModal';
import { useAuth } from '@/lib/context/auth-context';
import { ShieldCheck, X } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  onOpenUpload?: () => void;
}

export function AppLayout({ children, onOpenUpload }: AppLayoutProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [dismissedNotice, setDismissedNotice] = useState(false);
  const { isCloudConnected } = useAuth();

  const handleOpenUpload = () => {
    if (onOpenUpload) {
      onOpenUpload();
    } else {
      setIsUploadOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-photon-obsidian text-photon-ivory flex transition-colors film-grain selection:bg-neutral-800">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Exhibition Stage */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Navbar onOpenUpload={handleOpenUpload} />

        {/* Local First Informational Ribbon (Subtle & Architectural) */}
        {!isCloudConnected && !dismissedNotice && (
          <div className="bg-photon-card/90 border-b border-photon-border px-6 py-2.5 text-xs font-mono flex items-center justify-between text-photon-light">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="h-4 w-4 text-accent-emerald shrink-0" />
              <span>
                <strong className="text-white">Local-First Sandbox Active:</strong> Photographs remain strictly inside your browser&apos;s IndexedDB sandbox.
              </span>
            </div>
            <button
              onClick={() => setDismissedNotice(true)}
              className="text-photon-muted hover:text-white p-1 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Cinematic Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
