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
    // Add Google Search Console verification here when available
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head />
      <body className="antialiased">
        <GoogleTranslateProvider />
        {children}
        <FloatingContactButton />
      </body>
    </html>
  );
}
