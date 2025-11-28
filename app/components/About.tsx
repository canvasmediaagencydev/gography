'use client';

import { useState, useEffect } from 'react';

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      alt: 'Mountain landscape with travelers'
    },
    {
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
      alt: 'Scenic view'
    },
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      alt: 'Mountain peak'
    },
    {
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
      alt: 'Nature landscape'
    },
    {
      image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&q=80',
      alt: 'Scenic destination'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-white py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image Carousel */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-[4/3] relative">
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
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight">
              จากกลุ่มนักเดินทาง...สู่ผู้จัดทัวร์ มืออาชีพ
            </h2>

            <h3
              className="text-orange-600 text-4xl md:text-5xl font-bold"
              style={{ fontFamily: 'Rosella, sans-serif' }}
            >
              GOGRAPHY
            </h3>

            <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>
                เริ่มต้นจากกลุ่มเพื่อนที่รัก<span className="text-orange-600 font-semibold">การเดินทางและถ่ายภาพ</span>
              </p>
              <p>
                เราจะสอบประสบการณ์กว่า 10 ปี จากการออกเดินทางทั่วโลก จนหลาย เป็น
              </p>
              <p>
                แรงบันดาลใจในการก่อตั้งบริษัททัวร์ที่มุ่งแบ่งปันความประทับใจ
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-lg">
                เรื่องราวของเรา
              </button>
              <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3 rounded-full transition-colors">
                ติดต่อเรา
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
