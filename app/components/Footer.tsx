import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-800 dark:bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4">
          {/* Left Section - Logo and Address */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <Image
                src="/img/logo-white.svg"
                alt="Gography Logo"
                width={50}
                height={50}
                style={{ width: "auto", height: "auto" }}
                unoptimized
              />
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Gography
              </span>
            </div>

            <h3
              className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
              style={{ fontFamily: "Rosella, sans-serif" }}
            >
              GOGRAPHY
            </h3>

            <div className="text-gray-300 dark:text-gray-400 text-sm space-y-1">
              <p>75/53 ร่มเกล้าซอย 1</p>
              <p>แขวงมีนบุรี เขตมีนบุรี กรุงเทพมหานคร 10240</p>
            </div>
          </div>

          {/* Right Section - Contact Info */}
          <div className="text-center md:text-left">
            <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
              Follow us
            </h4>

            <div className="space-y-2 mb-6 text-sm">
              <p className="text-gray-300 dark:text-gray-400">
                Tel: 097-919-9293
              </p>
              <p className="text-gray-300 dark:text-gray-400">
                Email: info@gography.net
              </p>
              <p className="text-gray-300 dark:text-gray-400">
                Line: @Gography
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-3 justify-center md:justify-start">
              <Link
                href="https://www.facebook.com/gographyofficial"
                target="_blank"
                className="cursor-pointer bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>

              <Link
                href="https://www.instagram.com/gographyth"
                target="_blank"
                className="cursor-pointer bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>

              <Link
                href="https://line.me/ti/p/@Gography"
                target="_blank"
                className="cursor-pointer bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Line"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-700 dark:border-gray-700">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <p className="text-center text-gray-400 dark:text-gray-500 text-xs">
            Copyright © 2025 Gography. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
