import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/context/auth-context';
import { MediaProvider } from '@/lib/context/media-context';

export const metadata: Metadata = {
  title: 'PHOTON — Your memories. Beautifully organized.',
  description: 'A calm, privacy-first home for your photographs and videos. Organize your memories in a beautiful personal studio.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F7F5EF] font-sans antialiased text-[#25231F]">
        <AuthProvider><MediaProvider>{children}</MediaProvider></AuthProvider>
      </body>
    </html>
  );
}
