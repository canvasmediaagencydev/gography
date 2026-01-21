"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FilterOption {
  value: string;
  label: string;
  flag?: string;
}

interface FilterOptions {
  countries: FilterOption[];
  months: FilterOption[];
}

export default function Hero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    countries: [],
    months: [],
  });

  // Load filter options from API
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const res = await fetch("/api/trips/filters");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data && typeof data === "object") {
          setFilterOptions({
            countries: Array.isArray(data.countries) ? data.countries : [],
            months: Array.isArray(data.months) ? data.months : [],
          });
        }
      } catch {
        setFilterOptions({ countries: [], months: [] });
      }
    };
    loadFilterOptions();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      image: "/hero/DSC06021.jpg",
      alt: "Gography travel photography",
    },
    {
      image: "/hero/Gography-S-Canada-87.jpg",
      alt: "Canada landscape",
    },
    {
      image: "/hero/Gography-S-Canada-86.jpg",
      alt: "Canada scenery",
    },
    {
      image: "/hero/LINE_ALBUM_Aurora_250312_4.jpg",
      alt: "Aurora borealis",
    },
  ];

  // Handle search and navigation with filters
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCountry) {
      params.append("country", selectedCountry);
    }
    if (selectedMonth) {
      params.append("month", selectedMonth);
    }
    router.push(`/trips${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // Handle book trip - navigate to trips or open LINE
  const handleBookTrip = () => {
    handleSearch(); // Navigate to trips page with filters
  };

  // Handle contact via LINE
  const handleContactLine = () => {
    const message = encodeURIComponent(
      "สวัสดีครับ สนใจสอบถามข้อมูลเกี่ยวกับทริป"
    );
    window.open(`https://line.me/ti/p/@Gography?text=${message}`, "_blank");
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Main Heading */}
        <p className="text-white/90 text-lg md:text-xl mb-2">
          &quot;ออกเดินทางไปกับ&quot;
        </p>
        <h1
          className="text-white text-2xl md:text-4xl lg:text-6xl font-bold mb-6"
          style={{ fontFamily: "Rosella, sans-serif" }}
        >
          GOGRAPHY
        </h1>

        {/* Description */}
        <div className="max-w-3xl mb-12">
          <p className="text-white text-base md:text-lg leading-relaxed">
            <span className="font-semibold">ทัวร์ท่องเที่ยวจากผู้หลงใหลใน</span>
            <span className="font-semibold">การเดินทางและการถ่ายภาพ</span>
          </p>
          <p className="text-white text-base md:text-lg leading-relaxed">
            พร้อมสร้างประสบการณ์พิเศษทั่วโลกให้กับคุณ
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-md rounded-lg p-6 md:p-8 max-w-3xl w-full dark:border dark:border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Country Dropdown */}
            <div className="flex-1">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-white/50 appearance-none cursor-pointer hero-select"
                aria-label="เลือกประเทศที่จัดทริป"
              >
                <option value="">ประเทศที่จัดทริป</option>
                {filterOptions.countries?.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.flag} {country.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Dropdown */}
            <div className="flex-1">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-white/50 appearance-none cursor-pointer hero-select"
                aria-label="เลือกเดือน"
              >
                <option value="">ทุกเดือน</option>
                {filterOptions.months?.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="cursor-pointer bg-transparent border-2 border-white dark:border-gray-300 text-white dark:text-gray-100 px-6 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800/30 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Bottom Text */}
          <p className="text-white text-center text-sm md:text-base mb-4">
            ให้ทุกความทรงจำในการเดินทางของคุณ เล่าผ่านภาพถ่ายที่สวยงาม
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookTrip}
              className="cursor-pointer bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              จองทริป
            </button>
            <button
              onClick={handleContactLine}
              className="cursor-pointer bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              สอบถามข้อมูล
            </button>
          </div>
        </div>

        {/* Carousel Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`cursor-pointer w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white dark:bg-white w-8"
                  : "bg-white/50 dark:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="cursor-pointer hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 dark:bg-gray-800/30 hover:bg-white/30 dark:hover:bg-gray-800/40 backdrop-blur-sm text-white p-3 rounded-full transition-colors"
        aria-label="Previous slide"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="cursor-pointer hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 dark:bg-gray-800/30 hover:bg-white/30 dark:hover:bg-gray-800/40 backdrop-blur-sm text-white p-3 rounded-full transition-colors"
        aria-label="Next slide"
      >
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
}
