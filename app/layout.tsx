import type { Metadata } from "next";
import "./globals.css";
import GoogleTranslateProvider from "./components/GoogleTranslateProvider";
import FloatingContactButton from "./components/FloatingContactButton";

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
      <body className="antialiased">
        <GoogleTranslateProvider />
        {children}
        <FloatingContactButton />
      </body>
    </html>
  );
}
