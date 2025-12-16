import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google'; // Adding Outfit as requested for modern typography
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { AuthProvider } from '@/context/AuthContext';

// Load fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Travel Sansar - Fly Now',
  description: 'Experience the world with Travel Sansar. Best destinations, tours and experiences.',
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <AuthProvider>
          <LayoutWrapper>
            <Toaster position="top-center" />
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
