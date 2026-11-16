'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Film, 
  FolderOpen, 
  Sparkles 
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Photos', href: '/photos', icon: ImageIcon },
    { name: 'Videos', href: '/videos', icon: Film },
    { name: 'Albums', href: '/albums', icon: FolderOpen },
    { name: 'Smart', href: '/smart-organize', icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-2 py-1.5 flex justify-around items-center">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
