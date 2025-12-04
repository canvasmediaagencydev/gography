import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleTranslateProvider from "./components/GoogleTranslateProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gography - ทัวร์ถ่ายภาพและท่องเที่ยว",
  description: "ทัวร์ท่องเที่ยวจากผู้หลงใหลในการเดินทางและการถ่ายภาพ พร้อมสร้างประสบการณ์พิเศษทั่วโลกให้กับคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleTranslateProvider />
        {children}
      </body>
    </html>
  );
}
