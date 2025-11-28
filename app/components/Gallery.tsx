'use client';

import { useState } from 'react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=1200&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80',
    'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1200&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1200&q=80'
  ];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="bg-white py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            แกลเลอรีแห่งแรงบันดาลใจ
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            ที่จะพาคุณออกเดินทางครั้งต่อไป
          </h3>
          <p className="text-gray-700 text-base md:text-lg max-w-4xl mx-auto">
            บันทึกความทรงจำจากทั่วทุกมุมโลก จากผู้ที่เชื่อให้เราออกแบบการเดินทางสัมผัสประสบการณ์ท่องเที่ยวที่
            <br />
            ออกแบบเฉพาะคุณ ผ่านเลนส์แห่งความทรงจำโดย <span className="font-bold">ช่างภาพมืออาชีพ</span>
          </p>
        </div>

        {/* Main Image Display */}
        <div className="relative mb-8">
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={`Gallery ${selectedImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Thumbnail Grid */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-12 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                selectedImage === index
                  ? 'ring-4 ring-orange-600 scale-105'
                  : 'ring-2 ring-gray-200 hover:ring-gray-400'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-3 rounded-full transition-colors duration-300">
            สอบถามหรือจองทริป
          </button>
          <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-10 py-3 rounded-full transition-colors duration-300">
            ดูภาพทั้งหมด
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
