'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [language, setLanguage] = useState('TH');
  const [isScrolled, setIsScrolled] = useState(false);

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
              className={`text-2xl font-bold transition-colors duration-300 ${
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

            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'TH' ? 'EN' : 'TH')}
              className={`transition-colors text-sm border px-3 py-1 rounded ${
                isScrolled
                  ? 'text-gray-900 border-gray-300 hover:bg-gray-100'
                  : 'text-white border-white/30 hover:text-gray-300'
              }`}
            >
              {language} ▼
            </button>
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
