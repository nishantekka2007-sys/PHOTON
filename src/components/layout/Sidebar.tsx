'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMedia } from '@/lib/context/media-context';
import { formatBytes } from '@/lib/media/metadata';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Film,
  FolderOpen,
  Calendar,
  Sparkles,
  CopyCheck,
  Trash2,
  HardDrive,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { storageUsage } = useMedia();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Photos', href: '/photos', icon: ImageIcon },
    { name: 'Videos', href: '/videos', icon: Film },
    { name: 'Albums', href: '/albums', icon: FolderOpen },
    { name: 'Timeline', href: '/timeline', icon: Calendar },
    { name: 'Smart Organize', href: '/smart-organize', icon: Sparkles },
    { name: 'Duplicate Finder', href: '/duplicates', icon: CopyCheck },
    { name: 'Trash', href: '/deleted', icon: Trash2 },
  ];

  const percentageUsed = Math.min(
    100,
    Math.round((storageUsage.totalUsedBytes / storageUsage.maxQuotaBytes) * 100)
  );

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 h-screen sticky top-0 px-4 py-5 select-none transition-colors">
      {/* Brand Identity */}
      <Link href="/dashboard" className="flex items-center space-x-2.5 px-2 mb-6 group">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <Zap className="h-5 w-5 fill-white text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
            PHOTON
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              PRO
            </span>
          </span>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            Your memories. Organized.
          </p>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1">
        <p className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
          Library
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Real Storage Meter Widget */}
      <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center font-medium text-zinc-800 dark:text-zinc-200">
              <HardDrive className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
              Storage
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {percentageUsed}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentageUsed > 90
                  ? 'bg-rose-500'
                  : percentageUsed > 75
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.max(percentageUsed, 3)}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>{formatBytes(storageUsage.totalUsedBytes)} used</span>
            <span>{formatBytes(storageUsage.maxQuotaBytes)} free</span>
          </div>

          <Link
            href="/settings/storage"
            className="mt-2.5 block text-center text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Manage Storage →
          </Link>
        </div>

        {/* Privacy Assurance Badge */}
        <div className="mt-3 flex items-center justify-center space-x-1.5 py-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Privacy First • Zero Tracking</span>
        </div>
      </div>
    </aside>
  );
}
