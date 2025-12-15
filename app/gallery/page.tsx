'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface GalleryImage {
  url: string;
  country: string;
  description: string;
  isHighlight?: boolean;
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gallery data organized by country
  const galleryData: GalleryImage[] = [
    // Highlights
    { url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80', country: 'ญี่ปุ่น', description: 'ภูเขาฟูจิยามเช้า', isHighlight: true },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', country: 'นอร์เวย์', description: 'ฟยอร์ดอันน่าทึ่ง', isHighlight: true },
    { url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80', country: 'ไอซ์แลนด์', description: 'ออโรร่ามหัศจรรย์', isHighlight: true },
    { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80', country: 'สวิตเซอร์แลนด์', description: 'เทือกเขาแอลป์', isHighlight: true },

    // Japan
    { url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80', country: 'ญี่ปุ่น', description: 'ภูเขาฟูจิยามเช้า' },
    { url: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=1200&q=80', country: 'ญี่ปุ่น', description: 'วัดเกียวโต' },
    { url: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=1200&q=80', country: 'ญี่ปุ่น', description: 'ดอกซากุระบาน' },
    { url: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1200&q=80', country: 'ญี่ปุ่น', description: 'ชิบูย่าโตเกียว' },
    { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80', country: 'ญี่ปุ่น', description: 'ถนนโตเกียว' },
    { url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&q=80', country: 'ญี่ปุ่น', description: 'หมู่บ้านญี่ปุ่น' },

    // Norway
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', country: 'นอร์เวย์', description: 'ฟยอร์ดอันน่าทึ่ง' },
    { url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=80', country: 'นอร์เวย์', description: 'หมู่บ้านริมทะเล' },
    { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', country: 'นอร์เวย์', description: 'ภูเขาและทะเลสาบ' },
    { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80', country: 'นอร์เวย์', description: 'ทิวทัศน์นอร์เวย์' },

    // Iceland
    { url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80', country: 'ไอซ์แลนด์', description: 'ออโรร่ามหัศจรรย์' },
    { url: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=1200&q=80', country: 'ไอซ์แลนด์', description: 'น้ำตกสวยงาม' },
    { url: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=80', country: 'ไอซ์แลนด์', description: 'ทิวทัศน์ธรรมชาติ' },
    { url: 'https://images.unsplash.com/photo-1505832018823-50331d70d237?w=1200&q=80', country: 'ไอซ์แลนด์', description: 'ภูเขาไฟไอซ์แลนด์' },

    // Switzerland
    { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80', country: 'สวิตเซอร์แลนด์', description: 'เทือกเขาแอลป์' },
    { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80', country: 'สวิตเซอร์แลนด์', description: 'ทะเลสาบเนวา' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', country: 'สวิตเซอร์แลนด์', description: 'หุบเขาหิมะ' },
    { url: 'https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=1200&q=80', country: 'สวิตเซอร์แลนด์', description: 'เมืองเล็กในสวิส' },

    // New Zealand
    { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80', country: 'นิวซีแลนด์', description: 'ภูเขาและทะเลสาบ' },
    { url: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1200&q=80', country: 'นิวซีแลนด์', description: 'หุบเขาสวยงาม' },
    { url: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1200&q=80', country: 'นิวซีแลนด์', description: 'ชายฝั่งทะเล' },
    { url: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=80', country: 'นิวซีแลนด์', description: 'ภูเขานิวซีแลนด์' },
  ];

  const highlights = galleryData.filter(img => img.isHighlight);
  const countries = Array.from(new Set(galleryData.map(img => img.country)));
  const filteredImages = selectedCountry === 'all'
    ? galleryData
    : galleryData.filter(img => img.country === selectedCountry);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % highlights.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section with Background Image */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fadeIn">
                รวมภาพประทับใจจากทริปรอบโลก
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-4">
                ที่ราเคยติดให้ลูกค้าคนพิเศษของเรา
              </p>
              <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto">
                บันทึกความทรงจำจากทั่วทุกมุมโลก ผ่านเลนส์แห่งความทรงจำโดย <span className="font-bold">ช่างภาพมืออาชีพ</span>
              </p>
            </div>
          </div>
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Featured Carousel Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ภาพไฮไลท์รวม</h2>
              <p className="text-gray-600 text-lg">ภาพเด่นที่คัดสรรมาจากทุกทริป</p>
            </div>

            {/* Main Carousel */}
            <div className="relative mb-8">
              <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={highlights[currentSlide].url}
                  alt={highlights[currentSlide].description}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="inline-block bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full mb-3">
                      {highlights[currentSlide].country}
                    </span>
                    <h3 className="text-white text-2xl md:text-3xl font-bold">{highlights[currentSlide].description}</h3>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
                aria-label="Previous"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
                aria-label="Next"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3 overflow-x-auto pt-2 pb-4 scrollbar-hide justify-center">
              {highlights.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                    currentSlide === index
                      ? 'ring-4 ring-orange-600 scale-105'
                      : 'ring-2 ring-gray-300 hover:ring-orange-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.description}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery by Country */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">แกลเลอรีแยกตามประเทศ</h2>
              <p className="text-gray-600 text-lg">สำรวจภาพถ่ายจากจุดหมายปลายทางต่างๆ ทั่วโลก</p>
            </div>

            {/* Country Filter */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedCountry('all')}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 text-sm md:text-base ${
                    selectedCountry === 'all'
                      ? 'bg-orange-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  ทั้งหมด
                </button>
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 text-sm md:text-base ${
                      selectedCountry === country
                        ? 'bg-orange-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <div>
              {selectedCountry === 'all' ? (
                // Show all countries in sections
                countries.map((country) => {
                  const countryImages = galleryData.filter(img => img.country === country);
                  return (
                    <div key={country} className="mb-20">
                      <div className="flex items-center gap-3 mb-8">
                        <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-3xl font-bold text-gray-900">{country}</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {countryImages.map((image, index) => (
                          <div
                            key={index}
                            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                            onClick={() => setSelectedImage(image)}
                          >
                            <div className="aspect-square overflow-hidden bg-gray-100">
                              <img
                                src={image.url}
                                alt={image.description}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white text-sm font-semibold">{image.description}</p>
                              </div>
                            </div>
                            {/* Hover Icon */}
                            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                // Show filtered country
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredImages.map((image, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={image.url}
                          alt={image.description}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm font-semibold">{image.description}</p>
                        </div>
                      </div>
                      {/* Hover Icon */}
                      <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="mt-20 bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl p-12 text-center text-white shadow-xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">พร้อมสร้างความทรงจำกับเราแล้วหรือยัง?</h3>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                ให้เราช่วยออกแบบการเดินทางในฝันของคุณ และบันทึกทุกช่วงเวลาพิเศษด้วยช่างภาพมืออาชีพ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#contact">
                  <button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
                    สอบถามหรือจองทริป
                  </button>
                </Link>
                <Link href="/">
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105">
                    กลับหน้าหลัก
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-orange-500 transition-colors z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="max-w-6xl w-full animate-fadeIn">
              <img
                src={selectedImage.url}
                alt={selectedImage.description}
                className="w-full h-auto rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="mt-6 text-center">
                <span className="inline-block bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-full mb-3">
                  {selectedImage.country}
                </span>
                <p className="text-white text-xl font-semibold">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        )}
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </>
  );
}
