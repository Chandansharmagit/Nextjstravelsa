import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google'; // Adding Outfit as requested for modern typography
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { AuthProvider } from '@/context/AuthContext';

// Load fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Travel Sansar - Best Travel Agency in Nepal | Fly Now',
  description: 'Experience the world with Travel Sansar. Discover handpicked destinations, adventure tours, and cultural experiences in Nepal, Bhutan, and Tibet.',
  keywords: ['travel agency Nepal', 'tours in Nepal', 'trekking in Nepal', 'Bhutan tours', 'Tibet tours', 'Travel Sansar', 'adventure travel'],
  authors: [{ name: 'Travel Sansar', url: 'https://travelsansr.com' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://travelsansr.com',
  },
  openGraph: {
    title: 'Travel Sansar - Best Travel Agency in Nepal',
    description: 'Experience the world with Travel Sansar. Best destinations, tours and experiences.',
    url: 'https://travelsansr.com',
    siteName: 'Travel Sansar',
    images: [
      {
        url: 'https://travelsansr.com/logo-new.png',
        width: 800,
        height: 600,
        alt: 'Travel Sansar Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Sansar - Best Travel Agency in Nepal',
    description: 'Experience the world with Travel Sansar. Best destinations, tours and experiences.',
    images: ['https://travelsansr.com/logo-new.png'],
  },
  icons: {
    icon: '/logo-new.png',
    apple: '/logo-new.png',
  },
  verification: {
    google: 'GNquOv-LsT90SUtmNbAoy9vkdt3I1mBnnbLZYppMaf4',
  },
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
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "Travel Sansar",
                  "url": "https://travelsansr.com",
                  "logo": "https://travelsansr.com/logo-new.png",
                  "sameAs": [
                    "https://www.facebook.com/TravelSansar",
                    "https://www.instagram.com/travel_sansar"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+977-9855051795",
                    "contactType": "customer service"
                  }
                })
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "Travel Sansar",
                  "url": "https://travelsansr.com",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://travelsansr.com/search?query={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                })
              }}
            />
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
