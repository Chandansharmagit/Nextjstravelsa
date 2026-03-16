import type { Metadata } from 'next';
import { Inter, Outfit, Playfair_Display } from 'next/font/google'; // Adding Playfair Display for aesthetic typography
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { AuthProvider } from '@/context/AuthContext';
import NewsletterPopup from '@/components/NewsletterPopup';
import SeasonalOffer from '@/components/SeasonalOffer';

// Load fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic']
});

import { CONFIG } from '../lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.SITE_URL),
  title: 'Travel Sansar - Best Travel Agency in Nepal | Fly Now',
  description: 'Experience the world with Travel Sansar. Discover handpicked destinations, adventure tours, and cultural experiences in Nepal, Bhutan, and Tibet.',
  keywords: ['travel agency Nepal', 'tours in Nepal', 'trekking in Nepal', 'Bhutan tours', 'Tibet tours', 'Travel Sansar', 'adventure travel'],
  authors: [{ name: 'Travel Sansar', url: CONFIG.SITE_URL }],
  creator: 'Travel Sansar',
  publisher: 'Travel Sansar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: 'width=device-width, initial-scale=1',
  alternates: {
    canonical: CONFIG.SITE_URL,
  },
  openGraph: {
    title: 'Travel Sansar - Best Travel Agency in Nepal',
    description: 'Experience the world with Travel Sansar. Best destinations, tours and experiences.',
    url: CONFIG.SITE_URL,
    siteName: 'Travel Sansar',
    images: [
      {
        url: CONFIG.LOGO_URL,
        width: 1200,
        height: 630,
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
    images: [CONFIG.LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo-new.png',
    apple: '/logo-new.png',
  },
  verification: {
    google: 'GNquOv-LsT90SUtmNbAoy9vkdt3I1mBnnbLZYppMaf4',
  },
  other: {
    'apple-mobile-web-app-title': 'Travel Sansar',
    'application-name': 'Travel Sansar',
  }
};

import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${playfair.variable} font-sans`}>
        {/* CookieYes Banner */}
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/bb6fabec6e847069137c97e35351c79f/script.js"
          strategy="lazyOnload"
        />

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LGTRJDSD9V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-LGTRJDSD9V');
          `}
        </Script>
        <AuthProvider>
          <LayoutWrapper>
            <Toaster position="top-center" />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify([
                  {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "@id": `${CONFIG.SITE_URL}/#organization`,
                    "name": "Travel Sansar",
                    "alternateName": "Travel Sansar Nepal",
                    "url": CONFIG.SITE_URL,
                    "logo": {
                      "@type": "ImageObject",
                      "url": CONFIG.LOGO_URL,
                      "width": 190,
                      "height": 60
                    },
                    "sameAs": [
                      "https://www.facebook.com/TravelSansr",
                      "https://www.instagram.com/travel_sansr",
                      "https://twitter.com/travel_sansr",
                      "https://www.facebook.com/share/v/1BMuExj5x5/"
                    ],
                    "contactPoint": {
                      "@type": "ContactPoint",
                      "telephone": "+977-9855051795",
                      "contactType": "customer service",
                      "areaServed": "NP",
                      "availableLanguage": ["en", "ne"]
                    }
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "@id": `${CONFIG.SITE_URL}/#website`,
                    "name": "Travel Sansar",
                    "url": CONFIG.SITE_URL,
                    "description": "Best Travel Agency in Nepal | Fly Now",
                    "potentialAction": {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${CONFIG.SITE_URL}/search?query={search_term_string}`
                      },
                      "query-input": "required name=search_term_string"
                    }
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": [
                      {
                        "@type": "SiteNavigationElement",
                        "position": 1,
                        "name": "Nepal Destinations",
                        "url": `${CONFIG.SITE_URL}/destinations`
                      },
                      {
                        "@type": "SiteNavigationElement",
                        "position": 2,
                        "name": "Adventure Trekking & Tours",
                        "url": `${CONFIG.SITE_URL}/tours`
                      },
                      {
                        "@type": "SiteNavigationElement",
                        "position": 3,
                        "name": "Expedition & Trip Planner",
                        "url": `${CONFIG.SITE_URL}/expedition-planner`
                      },
                      {
                        "@type": "SiteNavigationElement",
                        "position": 4,
                        "name": "Contact Travel Experts",
                        "url": `${CONFIG.SITE_URL}/contact`
                      }
                    ]
                  }
                ]),
              }}
            />
            {children}
            <NewsletterPopup />
            <SeasonalOffer />
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html >
  );
}
