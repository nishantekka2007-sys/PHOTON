'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  Image as ImageIcon, 
  Film, 
  FolderKanban, 
  Sparkles 
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Exhibition', href: '/dashboard', icon: Compass },
    { name: 'Photos', href: '/photos', icon: ImageIcon },
    { name: 'Videos', href: '/videos', icon: Film },
    { name: 'Albums', href: '/albums', icon: FolderKanban },
    { name: 'Studio', href: '/smart-organize', icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-photon-dark/95 backdrop-blur-xl border-t border-photon-border px-3 py-2 flex justify-around items-center">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-mono tracking-wider transition-colors ${
              isActive
                ? 'text-white font-semibold'
                : 'text-photon-muted hover:text-photon-light'
            }`}
          >
            <Icon className={`h-4 w-4 mb-1 ${isActive ? 'text-accent-gold' : 'text-photon-muted'}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
