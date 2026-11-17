import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/context/auth-context';
import { MediaProvider } from '@/lib/context/media-context';

export const metadata: Metadata = {
  title: 'PHOTON — Your memories. Beautifully organized.',
  description:
    'A premium, privacy-first personal photo and video platform. Secure storage, intelligent deduplication, and complete personal isolation with zero trackers.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-zinc-950 font-sans antialiased text-zinc-900 dark:text-zinc-100 transition-colors">
        <AuthProvider>
          <MediaProvider>{children}</MediaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

