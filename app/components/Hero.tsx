'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('ประเทศที่จัดทริป');
  const [selectedMonth, setSelectedMonth] = useState('กุมภาพันธ์ 2569');

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      alt: 'Mountain landscape'
    },
    {
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
      alt: 'Road through forest'
    },
    {
      image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80',
      alt: 'Mountain reflection'
    },
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      alt: 'Northern lights'
    }
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Main Heading */}
        <p className="text-white/90 text-lg md:text-xl mb-2">
          "ออกเดินทางไปกับ"
        </p>
        <h1
          className="text-white text-2xl md:text-4xl lg:text-6xl font-bold mb-6"
          style={{ fontFamily: 'Rosella, sans-serif' }}
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
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 md:p-8 max-w-3xl w-full">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Country Dropdown */}
            <div className="flex-1">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-white/50 appearance-none cursor-pointer"
              >
                <option value="ประเทศที่จัดทริป">ประเทศที่จัดทริป</option>
                <option value="ไอซ์แลนด์">ไอซ์แลนด์</option>
                <option value="นอร์เวย์">นอร์เวย์</option>
                <option value="ญี่ปุ่น">ญี่ปุ่น</option>
              </select>
            </div>

            {/* Month Dropdown */}
            <div className="flex-1">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-white/50 appearance-none cursor-pointer"
              >
                <option value="กุมภาพันธ์ 2569">กุมภาพันธ์ 2569</option>
                <option value="มีนาคม 2569">มีนาคม 2569</option>
                <option value="เมษายน 2569">เมษายน 2569</option>
              </select>
            </div>

            {/* Search Button */}
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Bottom Text */}
          <p className="text-white text-center text-sm md:text-base mb-4">
            เที่ยวอย่างสบายใจ ในด้วงงานแคมเปญ
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-full transition-colors">
              จองทริป
            </button>
            <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-full transition-colors">
              ดูรสัมภาษณ์
            </button>
          </div>
        </div>

        {/* Carousel Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Chat Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg transition-colors"
        aria-label="Chat with us"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </section>
  );
}
