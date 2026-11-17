'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMedia } from '@/lib/context/media-context';
import { formatBytes } from '@/lib/media/metadata';
import {
  Compass,
  Image as ImageIcon,
  Film,
  FolderKanban,
  Clock,
  Sparkles,
  CopyCheck,
  Trash2,
  HardDrive,
  ShieldCheck,
  Heart,
  Settings
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { storageUsage } = useMedia();

  const primaryNavigation = [
    { name: 'Overview', href: '/dashboard', icon: Compass },
    { name: 'All Photos', href: '/photos', icon: ImageIcon },
    { name: 'Videos', href: '/videos', icon: Film },
    { name: 'Collections', href: '/albums', icon: FolderKanban },
    { name: 'Favorites', href: '/photos?favorites=true', icon: Heart },
    { name: 'Timeline', href: '/timeline', icon: Clock },
  ];

  const studioTools = [
    { name: 'Spatial Studio', href: '/smart-organize', icon: Sparkles },
    { name: 'Duplicate Review', href: '/duplicates', icon: CopyCheck },
    { name: 'Recently Deleted', href: '/deleted', icon: Trash2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const percentageUsed = Math.min(
    100,
    Math.round((storageUsage.totalUsedBytes / storageUsage.maxQuotaBytes) * 100)
  );

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-photon-border bg-photon-dark h-screen sticky top-0 px-4 py-6 select-none transition-colors">
      {/* Brand Monogram */}
      <Link href="/dashboard" className="flex items-center space-x-3 px-3 mb-8 group">
        <div className="h-8 w-8 rounded-full border border-white/20 bg-photon-card flex items-center justify-center text-white font-serif text-sm group-hover:border-white transition-colors">
          P
        </div>
        <div>
          <span className="font-serif text-lg tracking-widest text-white uppercase block leading-none font-normal">
            PHOTON
          </span>
          <span className="text-[10px] font-mono tracking-widest text-photon-muted uppercase">
            Personal Studio
          </span>
        </div>
      </Link>

      {/* Main Library Navigation */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 pb-2 text-[10px] font-mono tracking-widest text-photon-muted uppercase font-semibold">
            Library
          </p>
          <div className="space-y-1">
            {primaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-sans transition-all ${
                    isActive
                      ? 'bg-photon-card text-white border border-photon-border font-medium shadow-soft'
                      : 'text-photon-light hover:text-white hover:bg-photon-card/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-accent-gold' : 'text-photon-muted'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-3 pb-2 text-[10px] font-mono tracking-widest text-photon-muted uppercase font-semibold">
            Studio & System
          </p>
          <div className="space-y-1">
            {studioTools.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-sans transition-all ${
                    isActive
                      ? 'bg-photon-card text-white border border-photon-border font-medium shadow-soft'
                      : 'text-photon-light hover:text-white hover:bg-photon-card/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-accent-gold' : 'text-photon-muted'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Storage Gauge - Architectural & Minimal */}
      <div className="mt-auto pt-5 border-t border-photon-border">
        <div className="p-3.5 rounded-2xl bg-photon-card/70 border border-photon-border">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-photon-light flex items-center gap-1.5">
              <HardDrive className="h-3 w-3 text-photon-muted" />
              <span>Storage Usage</span>
            </span>
            <span className="text-photon-muted text-[11px]">{percentageUsed}%</span>
          </div>

          <div className="h-1 w-full bg-photon-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentageUsed > 90
                  ? 'bg-accent-crimson'
                  : percentageUsed > 75
                  ? 'bg-accent-amber'
                  : 'bg-white'
              }`}
              style={{ width: `${Math.max(percentageUsed, 3)}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-photon-muted">
            <span>{formatBytes(storageUsage.totalUsedBytes)} used</span>
            <span>{formatBytes(storageUsage.maxQuotaBytes)} quota</span>
          </div>

          <Link
            href="/settings/storage"
            className="mt-2.5 block text-center text-[10px] font-mono text-photon-light hover:text-white uppercase tracking-wider transition-colors"
          >
            Storage Details &rarr;
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] font-mono text-photon-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
          <span>Local Sandbox &bull; Private</span>
        </div>
      </div>
    </aside>
  );
}
