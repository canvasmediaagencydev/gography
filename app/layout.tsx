import type { Metadata } from "next";
import "./globals.css";
import GoogleTranslateProvider from "./components/GoogleTranslateProvider";
import FloatingContactButton from "./components/FloatingContactButton";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gography.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gography - ทัวร์ถ่ายภาพและท่องเที่ยว",
    template: "%s | Gography"
  },
  description: "ทัวร์ท่องเที่ยวจากผู้หลงใหลในการเดินทางและการถ่ายภาพ พร้อมสร้างประสบการณ์พิเศษทั่วโลกให้กับคุณ Photography tours and travel experiences from passionate travelers and photographers.",
  keywords: ["ทัวร์ถ่ายภาพ", "ทัวร์ท่องเที่ยว", "photography tour", "travel tour", "ทัวร์ต่างประเทศ", "กลุ่มเล็ก", "small group tour", "private tour", "ทัวร์ส่วนตัว"],
  authors: [{ name: "Gography" }],
  creator: "Gography",
  publisher: "Gography",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "Gography",
    title: "Gography - ทัวร์ถ่ายภาพและท่องเที่ยว",
    description: "ทัวร์ท่องเที่ยวจากผู้หลงใหลในการเดินทางและการถ่ายภาพ พร้อมสร้างประสบการณ์พิเศษทั่วโลกให้กับคุณ",
    images: [
      {
        url: `${siteUrl}/img/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Gography - Photography Tours & Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gography - ทัวร์ถ่ายภาพและท่องเที่ยว",
    description: "ทัวร์ท่องเที่ยวจากผู้หลงใหลในการเดินทางและการถ่ายภาพ พร้อมสร้างประสบการณ์พิเศษทั่วโลกให้กับคุณ",
    images: [`${siteUrl}/img/og-image.jpg`],
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
  verification: {
    // TODO: Add your Google Search Console verification code here
    // Steps to get verification code:
    // 1. Go to https://search.google.com/search-console
    // 2. Add your property (https://gography.com)
    // 3. Choose "HTML tag" verification method
    // 4. Copy the content value from the meta tag
    // 5. Paste it below:
    // google: 'your-verification-code-here',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'th-TH': siteUrl,
      'en-US': `${siteUrl}/en`,
      'x-default': siteUrl,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="antialiased">
        <GoogleTranslateProvider />
        {children}
        <FloatingContactButton />
      </body>
    </html>
  );
}
