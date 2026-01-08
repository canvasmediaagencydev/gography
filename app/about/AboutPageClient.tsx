"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [galleryImages, setGalleryImages] = useState<
    Array<{
      id: string;
      storage_url: string;
      title: string;
      alt_text: string | null;
    }>
  >([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      alt: "Mountain landscape",
    },
    {
      url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
      alt: "Desert landscape",
    },
    {
      url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
      alt: "Aurora landscape",
    },
  ];

  // Fetch gallery images from database
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoadingGallery(true);
        const response = await fetch("/api/gallery?is_active=true&pageSize=12");
        const data = await response.json();
        if (data.images && data.images.length > 0) {
          setGalleryImages(data.images);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setIsLoadingGallery(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80)",
            }}
          >
            <div className="absolute inset-0 bg-black/40 dark:bg-black/50"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                &quot;เราเชื่อว่าทุกการเดินทาง
              </h1>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                คือของขวัญที่ควรพิเศษ&quot;
              </h2>
            </div>
          </div>
        </section>

        {/* GOGRAPHY Section */}
        <section className="py-20 px-6 bg-white dark:bg-gray-800">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                GOGRAPHY
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-5xl mx-auto leading-relaxed">
                ก่อตั้งจากความตั้งใจที่จะอยากมอบประสบการณ์การเดินทางที่อบอุ่นและเหมาะกับความต้องการที่แตกต่างของลูกค้า
                <br />
                เราเชื่อว่าการเดินทางคือของขวัญที่มีค่าสำหรับทุกคน
                ดังนั้นเราจึงให้ความสำคัญกับทุกรายละเอียดเพื่อสร้างประสบการณ์ที่น่าจดจำ
              </p>
            </div>

            {/* Carousel */}
            <div className="relative max-w-6xl mx-auto mb-12">
              <div className="flex gap-4 items-center justify-center">
                {/* Previous Button */}
                <button
                  onClick={prevSlide}
                  className="cursor-pointer shrink-0 w-12 h-12 rounded-full bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors z-10"
                  aria-label="Previous"
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

                {/* Images */}
                <div className="flex gap-4 overflow-hidden">
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-500 rounded-2xl overflow-hidden relative ${
                        index === currentSlide
                          ? "w-96 h-96 opacity-100"
                          : "w-80 h-80 opacity-60"
                      }`}
                      style={{
                        display:
                          Math.abs(index - currentSlide) <= 1
                            ? "block"
                            : "none",
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  className="cursor-pointer shrink-0 w-12 h-12 rounded-full bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors z-10"
                  aria-label="Next"
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
              </div>
            </div>

            {/* Description Text */}
            <div className="text-center max-w-5xl mx-auto">
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                เราเชื่อว่าไกด์ที่ดีในการจัดทริปควรมีความเชี่ยวชาญทั้งด้านการท่องเที่ยวและการถ่ายภาพ
                พร้อมด้วย{" "}
                <span className="text-orange-600 font-semibold">
                  ช่างภาพมืออาชีพ
                </span>{" "}
                ที่พร้อมบันทึกทุกช่วงเวลาพิเศษตลอดการเดินทาง
              </p>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-16">
              เราทำอะไร?
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-700 dark:border dark:border-gray-600 p-8 rounded-2xl shadow-md">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    เป็นผู้เชี่ยวชาญด้านการจัดทริปถ่ายภาพ จัดทริปด้วยกลุ่มเล็ก
                    และคัดสรรสถานที่ท่องเที่ยวอย่างพิถีพิถัน
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 dark:border dark:border-gray-600 p-8 rounded-2xl shadow-md">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    มุ่งมั่นที่จะมอบประสบการณ์การเดินทาง ที่เหนือความคาดหวัง
                    &quot;การันตีความประทับใจ ของทุกผู้ร่วมเดินทาง&quot;
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 dark:border dark:border-gray-600 p-8 rounded-2xl shadow-md">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    ทีมงานมีประสบการณ์การทำงานมากกว่า 15 ปี
                    ในการนำเที่ยวและถ่ายภาพ ที่หลากหลายประเทศ
                    ทั่วโลกทั้งในเอเชียและยุโรป
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 dark:border dark:border-gray-600 p-8 rounded-2xl shadow-md">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    ที่ปรึกษาการเดินทางส่วนตัว ช่วยวางแผนและจัดทริปให้ตรงกับ
                    ความต้องการและงบประมาณของคุณ
                  </p>
                </div>
              </div>

              {/* Right Side - Team Photo */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px]">
                  <Image
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80"
                    alt="Our Team"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section className="py-20 px-6 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-16">
              ภาพจากการเดินทาง
            </h2>

            {/* Gallery Grid */}
            {isLoadingGallery ? (
              <div className="flex items-center justify-center py-12 mb-12">
                <p className="text-gray-500 dark:text-gray-400">
                  กำลังโหลดรูปภาพ...
                </p>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-12 mb-12">
                <p className="text-gray-500 dark:text-gray-400">
                  ยังไม่มีรูปภาพในแกลเลอรี
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
                {galleryImages.map((image) => (
                  <Link
                    key={image.id}
                    href="/gallery"
                    className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative block"
                  >
                    <Image
                      src={image.storage_url}
                      alt={image.alt_text || image.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 16vw"
                      unoptimized
                    />
                  </Link>
                ))}
              </div>
            )}

            {/* View All Button */}
            <div className="text-center">
              <Link href="/gallery">
                <button className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
                  ดูภาพทั้งหมด
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              &quot;อยากให้
              <span className="text-orange-500 dark:text-orange-400">
                ความฝัน
              </span>
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-8">
              ในการเดินทางของคุณ
              <span className="text-orange-500 dark:text-orange-400">
                เป็นจริง
              </span>
              &quot;
            </h3>
            <p className="text-xl text-gray-300 dark:text-gray-400 mb-8 leading-relaxed">
              ปล่อยให้ทีมผู้เชี่ยวชาญของเราดูแลทุกรายละเอียด
              <br />
              เพื่อให้คุณได้เพลิดเพลินกับการท่องเที่ยวและสร้างความทรงจำที่ไม่มีวันลืมไปกับเรา
            </p>
            <p className="text-2xl font-bold text-white mb-8">
              เริ่มต้นการเดินทางของคุณวันนี้
            </p>
            <Link href="/contact">
              <button className="cursor-pointer bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg text-lg">
                สอบถามหรือจองทริป
              </button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
