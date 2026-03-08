import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

// Arabic font with multiple weights for better typography
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Fallback Latin font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "نظام إدارة المخازن | GarageStock",
    template: "%s | نظام إدارة المخازن"
  },
  description: "نظام متكامل لإدارة المخازن والمبيعات - تتبع المخزون، إدارة المبيعات، تحليل الأرباح",
  keywords: [
    "إدارة المخازن", 
    "نظام مخازن", 
    "إدارة المبيعات", 
    "تتبع المخزون", 
    "برنامج مخازن",
    "GarageStock",
    "inventory management",
    "sales system"
  ],
  authors: [{ name: "GarageStock" }],
  creator: "GarageStock",
  publisher: "GarageStock",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/',
      'en': '/en',
    },
  },
  openGraph: {
    title: "نظام إدارة المخازن والمبيعات",
    description: "نظام متكامل لإدارة المخازن والمبيعات - تتبع المخزون، إدارة المبيعات، تحليل الأرباح",
    url: '/',
    siteName: "GarageStock",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GarageStock - نظام إدارة المخازن',
      },
    ],
    locale: 'ar_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "نظام إدارة المخازن والمبيعات",
    description: "نظام متكامل لإدارة المخازن والمبيعات",
    images: ['/og-image.png'],
    creator: '@garagestock',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon for all platforms */}
        <link rel="icon" type="image/x-icon" href="/inventory.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Theme color for browser */}
        <meta name="theme-color" content="#000000" />
        
        {/* Structured Data for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "GarageStock",
              "description": "نظام متكامل لإدارة المخازن والمبيعات",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "GarageStock"
              }
            })
          }}
        />
      </head>
      <body className="font-cairo antialiased min-h-screen bg-white text-gray-900">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 bg-black text-white px-4 py-2 rounded-lg z-50">
          تخطي إلى المحتوى الرئيسي
        </a>
        
        {/* Main content */}
        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        {/* Optional: Add a simple footer for better SEO */}
        <footer className="text-center py-4 text-xs text-gray-500 border-t border-gray-200">
          <div className="container mx-auto">
            <p>© {new Date().getFullYear()} GarageStock. جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}