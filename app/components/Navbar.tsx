'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize language from cookie
  const getInitialLanguage = () => {
    if (typeof window === 'undefined') return 'TH';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; googtrans=`);
    const cookie = parts.length === 2 ? parts.pop()?.split(';').shift() : null;
    return cookie && cookie.includes('/en') ? 'EN' : 'TH';
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'หน้าแรก', href: '/' },
    { label: 'ทริป', href: '/trips' },
    { label: 'ทริปส่วนตัว', href: '/private-trips' },
    { label: 'แกลเลอรี', href: '/gallery' },
    { label: 'บทความ', href: '/articles' },
    { label: 'เกี่ยวกับเรา', href: '/about' },
    { label: 'ติดต่อเรา', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/img/logo-white.svg"
              alt="Gography Logo"
              width={46}
              height={48}
              priority
              className={isScrolled ? 'brightness-0' : ''}
            />
            <span
              className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              style={{ fontFamily: 'Rosella, sans-serif' }}
            >
              GOGRAPHY
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors text-sm ${
                  isScrolled
                    ? 'text-gray-900 hover:text-orange-600'
                    : 'text-white hover:text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Language Selector - Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`transition-colors text-sm border px-3 py-1 rounded flex items-center gap-1 ${
                  isScrolled
                    ? 'text-gray-900 border-gray-300 hover:bg-gray-100'
                    : 'text-white border-white/30 hover:bg-white/10'
                }`}
              >
                {language} ▼
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-32 rounded-md shadow-lg z-50 ${
                    isScrolled ? 'bg-white' : 'bg-gray-800'
                  }`}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        const deleteCookie = (name: string) => {
                          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        };

                        // Reset to Thai
                        deleteCookie('googtrans');
                        setLanguage('TH');
                        window.location.reload();
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        isScrolled
                          ? 'text-gray-900 hover:bg-gray-100'
                          : 'text-white hover:bg-gray-700'
                      } ${language === 'TH' ? 'font-bold' : ''}`}
                    >
                      🇹🇭 ไทย
                    </button>
                    <button
                      onClick={() => {
                        const setCookie = (name: string, value: string, days: number) => {
                          const expires = new Date(Date.now() + days * 864e5).toUTCString();
                          document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
                        };

                        // Set to English
                        setCookie('googtrans', '/th/en', 1);
                        setLanguage('EN');
                        window.location.reload();
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        isScrolled
                          ? 'text-gray-900 hover:bg-gray-100'
                          : 'text-white hover:bg-gray-700'
                      } ${language === 'EN' ? 'font-bold' : ''}`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
