"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/about/Low-4081.jpg",
      alt: "Gography team travel",
    },
    {
      image: "/about/IMG-3512.jpg",
      alt: "Travel photography",
    },
    {
      image: "/about/480901859_952908800298403_7670122924741797459_n.jpg",
      alt: "Gography adventure",
    },
    {
      image: "/about/25680613-DSC00386.jpg",
      alt: "Scenic destination",
    },
    {
      image: "/about/DSC06021.jpg",
      alt: "Nature landscape",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-white dark:bg-gray-800 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image Carousel */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-4/3 relative">
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
                    sizes="(max-width: 1024px) 100vw, 50vw"
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
                    index === currentSlide
                      ? "bg-white dark:bg-white w-8"
                      : "bg-white/60 dark:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">
              จากกลุ่มนักเดินทาง...สู่ผู้จัดทัวร์ มืออาชีพ
            </h2>

            <h3
              className="text-orange-600 dark:text-orange-500 text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "Rosella, sans-serif" }}
            >
              GOGRAPHY
            </h3>

            <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              <p>
                เริ่มต้นจากกลุ่มเพื่อนที่รัก
                <span className="text-orange-600 dark:text-orange-400 font-semibold">
                  การเดินทางและถ่ายภาพ
                </span>
              </p>
              <p>
                เราสั่งสมประสบการณ์กว่า 10 ปี จากการออกเดินทางทั่วโลก จนกลายเป็น
              </p>
              <p>
                แรงบันดาลใจในการก่อตั้งบริษัททัวร์ที่มุ่งแบ่งปันความประทับใจ
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/about">
                <button className="cursor-pointer bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-lg">
                  เรื่องราวของเรา
                </button>
              </Link>
              <Link href="/contact">
                <button className="cursor-pointer border-2 border-orange-600 dark:border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-semibold px-8 py-3 rounded-full transition-colors">
                  ติดต่อเรา
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
