"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine initial language synchronously (Client-side)
  const [language, setLanguage] = useState<"TH" | "EN">(() => {
    if (typeof window !== "undefined") {
      // 1. Check Cookie Direct Match (Best Practice for Google Translate)
      // We explicitly look for the 'googtrans' cookie.
      // If it exists and contains '/en', we are in English mode.
      try {
        const cookies = document.cookie.split(";");
        for (const c of cookies) {
          const [key, val] = c.trim().split("=");
          if (key === "googtrans") {
            // Check for both encoded and raw values just to be safe
            // e.g. "/th/en" or "%2Fth%2Fen"
            if (
              val.includes("/en") ||
              decodeURIComponent(val).includes("/en")
            ) {
              return "EN";
            }
          }
        }
      } catch {
        // Fallback if formatting fails
        return "TH";
      }
    }
    return "TH";
  });

  // Sync language state with Google Translate after mount
  useEffect(() => {
    // Get language - prioritize Cookie as Single Source of Truth
    const getLanguage = (): "TH" | "EN" => {
      // 1. Check Cookies
      const cookies = document.cookie.split(";");
      for (const c of cookies) {
        const [key, val] = c.trim().split("=");
        if (key === "googtrans") {
          if (val.includes("/en") || decodeURIComponent(val).includes("/en")) {
            return "EN";
          }
        }
      }

      // 2. Fallback: Check HTML class if cookie fails (e.g. initial widget load)
      const htmlClass = document.documentElement.className || "";
      if (htmlClass.includes("translated-ltr")) return "EN";

      return "TH";
    };

    // Update language state
    const updateLanguage = () => {
      const detectedLang = getLanguage();
      setLanguage((prev) => {
        // Only update if different to avoid unnecessary re-renders
        return prev !== detectedLang ? detectedLang : prev;
      });
    };

    // Monitor Google Translate select element (primary method)
    const setupSelectListener = () => {
      const select = document.querySelector(
        "#google_translate_element select"
      ) as HTMLSelectElement;
      if (select) {
        select.addEventListener("change", updateLanguage);
        return true;
      }
      return false;
    };

    // Try to setup listener immediately
    if (!setupSelectListener()) {
      // If select not ready, check periodically (max 5 seconds)
      let attempts = 0;
      const maxAttempts = 50; // 50 * 100ms = 5 seconds
      const checkInterval = setInterval(() => {
        attempts++;
        updateLanguage(); // Force check language sources (including cookies)
        if (setupSelectListener() || attempts >= maxAttempts) {
          clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => {
      const select = document.querySelector(
        "#google_translate_element select"
      ) as HTMLSelectElement;
      if (select) {
        select.removeEventListener("change", updateLanguage);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "หน้าแรก", href: "/" },
    { label: "ทริป", href: "/trips" },
    { label: "ทริปส่วนตัว", href: "/private-trips" },
    { label: "แกลเลอรี", href: "/gallery" },
    { label: "บทความ", href: "/articles" },
    { label: "เกี่ยวกับเรา", href: "/about" },
    { label: "ติดต่อเรา", href: "/contact" },
  ];

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white dark:bg-gray-800 shadow-md" : "bg-transparent"
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
                className={`transition-all duration-300 ${
                  isScrolled ? "brightness-0 dark:brightness-100" : ""
                }`}
              />
              <span
                className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-gray-900 dark:text-white" : "text-white"
                }`}
                style={{ fontFamily: "Rosella, sans-serif" }}
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
                      ? "text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400"
                      : "text-white hover:text-gray-300 dark:hover:text-gray-200"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Language Selector - Dropdown */}
              <div className="relative">
                <button
                  suppressHydrationWarning
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`cursor-pointer transition-colors text-sm border px-3 py-1 rounded flex items-center gap-1 ${
                    isScrolled
                      ? "text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      : "text-white border-white/30 dark:border-white/20 hover:bg-white/10 dark:hover:bg-white/5"
                  }`}
                >
                  <span suppressHydrationWarning>{language}</span> ▼
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-32 rounded-md shadow-lg z-50 ${
                      isScrolled ? "bg-white dark:bg-gray-800" : "bg-gray-800"
                    }`}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="py-1">
                      <button
                        suppressHydrationWarning // Allow text to differ from server (Best Practice for client-side init)
                        onClick={() => {
                          const deleteCookie = (name: string) => {
                            const hostname = window.location.hostname;

                            // 1. Delete on current path (Standard)
                            document.cookie =
                              name +
                              "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                            // 2. Extra cleanup for Localhost
                            if (hostname === "localhost") {
                              document.cookie =
                                name +
                                "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";
                            }
                            // 3. Root domain cleanup for Production
                            else {
                              const domain = hostname.substring(
                                hostname.lastIndexOf(
                                  ".",
                                  hostname.lastIndexOf(".") - 1
                                ) + 1
                              );
                              document.cookie =
                                name +
                                "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." +
                                domain;
                              document.cookie =
                                name +
                                "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
                                domain;
                            }
                          };

                          // Reset to Thai
                          deleteCookie("googtrans");
                          setLanguage("TH");
                          setTimeout(() => {
                            window.location.href =
                              window.location.pathname +
                              "?refresh=" +
                              new Date().getTime();
                          }, 100);
                        }}
                        className={`cursor-pointer w-full text-left px-4 py-2 text-sm transition-colors ${
                          isScrolled
                            ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            : "text-white hover:bg-gray-700"
                        } ${language === "TH" ? "font-bold" : ""}`}
                      >
                        <span suppressHydrationWarning>🇹🇭 ไทย</span>
                      </button>
                      <button
                        suppressHydrationWarning
                        onClick={() => {
                          const setCookie = (
                            name: string,
                            value: string,
                            days: number
                          ) => {
                            const expires = new Date(
                              Date.now() + days * 864e5
                            ).toUTCString();
                            const hostname = window.location.hostname;

                            // Set on path=/
                            document.cookie =
                              name +
                              "=" +
                              value +
                              "; expires=" +
                              expires +
                              "; path=/";

                            // Set on root domain if not localhost
                            if (hostname !== "localhost") {
                              const domain = hostname.substring(
                                hostname.lastIndexOf(
                                  ".",
                                  hostname.lastIndexOf(".") - 1
                                ) + 1
                              );
                              document.cookie =
                                name +
                                "=" +
                                value +
                                "; expires=" +
                                expires +
                                "; path=/; domain=." +
                                domain;
                            }
                          };

                          // Set to English
                          setCookie("googtrans", "/th/en", 1);
                          setLanguage("EN");
                          setTimeout(() => {
                            window.location.href =
                              window.location.pathname +
                              "?refresh=" +
                              new Date().getTime();
                          }, 100);
                        }}
                        className={`cursor-pointer w-full text-left px-4 py-2 text-sm transition-colors ${
                          isScrolled
                            ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            : "text-white hover:bg-gray-700"
                        } ${language === "EN" ? "font-bold" : ""}`}
                      >
                        <span suppressHydrationWarning>🇬🇧 English</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`cursor-pointer lg:hidden transition-colors ${
                isScrolled ? "text-gray-900 dark:text-white" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="pb-6 pt-2 px-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="transition-all duration-200 text-sm py-3 px-4 rounded-md text-gray-900 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Mobile Language Selector */}
                  <div className="mt-4 pt-4 px-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold mb-3 text-gray-600 dark:text-gray-400">
                      ภาษา / Language
                    </p>
                    <div className="flex gap-2">
                      <button
                        suppressHydrationWarning
                        onClick={() => {
                          const deleteCookie = (name: string) => {
                            const hostname = window.location.hostname;

                            // 1. Delete on current path (Standard)
                            document.cookie =
                              name +
                              "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                            // 2. Extra cleanup for Localhost
                            if (hostname === "localhost") {
                              document.cookie =
                                name +
                                "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";
                            }
                            // 3. Root domain cleanup for Production
                            else {
                              const domain = hostname.substring(
                                hostname.lastIndexOf(
                                  ".",
                                  hostname.lastIndexOf(".") - 1
                                ) + 1
                              );
                              document.cookie =
                                name +
                                "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." +
                                domain;
                              document.cookie =
                                name +
                                "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
                                domain;
                            }
                          };
                          deleteCookie("googtrans");
                          setLanguage("TH");
                          setIsMobileMenuOpen(false);
                          setTimeout(() => {
                            window.location.href =
                              window.location.pathname +
                              "?refresh=" +
                              new Date().getTime();
                          }, 100);
                        }}
                        className={`cursor-pointer flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          language === "TH"
                            ? "bg-orange-600 dark:bg-orange-500 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <span suppressHydrationWarning>🇹🇭 ไทย</span>
                      </button>
                      <button
                        suppressHydrationWarning
                        onClick={() => {
                          const setCookie = (
                            name: string,
                            value: string,
                            days: number
                          ) => {
                            const expires = new Date(
                              Date.now() + days * 864e5
                            ).toUTCString();
                            const hostname = window.location.hostname;

                            // Set on current domain
                            document.cookie =
                              name +
                              "=" +
                              value +
                              "; expires=" +
                              expires +
                              "; path=/";

                            if (hostname !== "localhost") {
                              const domain = hostname.substring(
                                hostname.lastIndexOf(
                                  ".",
                                  hostname.lastIndexOf(".") - 1
                                ) + 1
                              );
                              document.cookie =
                                name +
                                "=" +
                                value +
                                "; expires=" +
                                expires +
                                "; path=/; domain=." +
                                domain;
                            }
                          };
                          setCookie("googtrans", "/th/en", 1);
                          setLanguage("EN");
                          setIsMobileMenuOpen(false);
                          setTimeout(() => {
                            window.location.href =
                              window.location.pathname +
                              "?refresh=" +
                              new Date().getTime();
                          }, 100);
                        }}
                        className={`cursor-pointer flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          language === "EN"
                            ? "bg-orange-600 dark:bg-orange-500 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <span suppressHydrationWarning>🇬🇧 English</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
