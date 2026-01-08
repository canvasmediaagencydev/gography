"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          {/* Decorative element */}
          <div className="relative inline-block">
            <h1
              className="text-9xl md:text-[12rem] font-bold text-gray-200 dark:text-gray-800 leading-none select-none"
              style={{ fontFamily: "Rosella, sans-serif" }}
            >
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-bold bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Oops!
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              ขออภัย ไม่พบหน้านี้ที่คุณกำลังมองหา
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              หน้าเว็บที่คุณต้องการอาจถูกย้าย ลบออก หรือไม่มีอยู่จริง
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-orange-600/30 hover:shadow-orange-700/40 hover:-translate-y-1"
            >
              กลับสู่หน้าแรก
            </Link>
            <Link
              href="/trips"
              className="w-full sm:w-auto px-8 py-4 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 font-bold rounded-full transition-all duration-300"
            >
              ดูทริปทั้งหมด
            </Link>
          </div>

          {/* Optional: Small guide text */}
          <p className="text-sm text-gray-500 dark:text-gray-500 pt-8">
            The page you are looking for does not exist.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
