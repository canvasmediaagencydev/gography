'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      alt: 'Mountain landscape'
    },
    {
      url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
      alt: 'Desert landscape'
    },
    {
      url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
      alt: 'Aurora landscape'
    }
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=400&q=80',
    'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80',
    'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&q=80',
    'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&q=80'
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80)' }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                "เราเชื่อว่าทุกการเดินทาง
              </h1>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                คือของขวัญที่ควรพิเศษ"
              </h2>
            </div>
          </div>
        </section>

        {/* GOGRAPHY Section */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">GOGRAPHY</h2>
              <p className="text-gray-700 text-lg md:text-xl max-w-5xl mx-auto leading-relaxed">
                ก่อตั้งจากความตั้งใจที่จะอยากมอบประสบการณ์การเดินทางที่อบอุ่นและเหมาะกับความต้องการที่แตกต่างของลูกค้า
                <br />
                เราเชื่อว่าการมีที่จใบประสบการ่อบขวั้นสำหรับทุกดน เคนเรขึงให้เว้นพิ้เขตสัมผั่น
              </p>
            </div>

            {/* Carousel */}
            <div className="relative max-w-6xl mx-auto mb-12">
              <div className="flex gap-4 items-center justify-center">
                {/* Previous Button */}
                <button
                  onClick={prevSlide}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors z-10"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Images */}
                <div className="flex gap-4 overflow-hidden">
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-500 rounded-2xl overflow-hidden ${
                        index === currentSlide
                          ? 'w-96 h-96 opacity-100'
                          : 'w-80 h-80 opacity-60'
                      }`}
                      style={{
                        display: Math.abs(index - currentSlide) <= 1 ? 'block' : 'none'
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors z-10"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Description Text */}
            <div className="text-center max-w-5xl mx-auto">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                เราเชื่อว่าการมีที่ดีในการจัดทริปดควรเเบรนยขึ้มระเท่านั่งเองมาควรบและและขจรมผลท่องเที่ยวซึ่งย้นยัม
                พร้อมขึ้น <span className="text-orange-600 font-semibold">ช่างภาพมืออาชีพ</span> พร้อยบนท์กทุกของมต้วยมันทั้งการต้วน
              </p>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">เราทำอีกไร?</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-md">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    เป็นผู้เชี่ยวชาญกับท่านทุก
                    จัดทริปด้วยเนื้อหาน้อย และ คัดสรรส่งต้วนจน
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    ข้อตจถยมอทข้า ทัพ ที่จตรรผล
                    ข่องผลขเป้นเป้ได้เผบค่าก "กบแทนทั่จ
                    ของทุกผู้สัมผ่ผสท"
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    แท่ลินใข่สเเผกสท้งคต่อตัจ
                    ยากทาช 15 เงเสมทำที่ตถอไก
                    ที่ก่ผใข่ดห่ เคฐ่บใช่ เคเทสเดเตถจย
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    ที่ปริจอขจรุยาทรสาเพื่อนึกรบน
                    คบิ ซ่วผตแเพบจ็ดงขูตจกรบก ซเดัอวรบน
                    ธมาทบยปบกทจเบสทนมทข
                  </p>
                </div>
              </div>

              {/* Right Side - Team Photo */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80"
                    alt="Our Team"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
              เมื่อหลังทีศูนย์ไปคยเห็น
            </h2>

            {/* Gallery Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link href="/gallery">
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
                  ดูไอเนมเนิลทั้งหมด
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              "อยากปล่อยให้<span className="text-orange-500">ความชื่น</span>
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-8">
              ในการเดินทางของคุณรออยู่<span className="text-orange-500">แค่นิปนึง</span>"
            </h3>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              ปล่อยให้ทีมประสบการณ์การเดินทางพาที่ เหล่าจะดีบนทุกที่ยืนอยู่มากมากกับการท่องเที่ยว
              <br />
              และจ่างหาทริปด้วยเพื่อพิชิตที่ทำการคุมรวมผลกันทั้งประจำ ของคุณรออยู่หรื่ของที่ผู้เริ่น
            </p>
            <p className="text-2xl font-bold text-white mb-8">
              เริ่มต้นการเดินทางของคุณเดินดี
            </p>
            <Link href="/#contact">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg text-lg">
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
