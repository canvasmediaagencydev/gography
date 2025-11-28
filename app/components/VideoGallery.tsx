'use client';

import { useState, useRef } from 'react';

export default function VideoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const videos = [
    {
      thumbnail: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=400&q=80',
      title: 'Northern Lights Tour'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
      title: 'Mountain Adventure'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
      title: 'Night Sky Photography'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
      title: 'Winter Wonderland'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      title: 'Autumn Colors'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
      title: 'Safari Adventure'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-white py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-orange-600" style={{ fontFamily: 'Rosella, sans-serif' }}>GOGRAPHY</span>
            <span className="text-orange-600"> ในมุมมองที่เคลื่อนไหว</span>
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6">
            ประสบการณ์ที่ถ่ายทอดผ่านวิดีโอ
          </h3>
          <p className="text-gray-700 text-base md:text-lg max-w-4xl mx-auto">
            วิดีโอทริปสุดพิเศษ ภาพเคลื่อนไหวที่เราใส่ใจทุกรายละเอียด
            <br />
            สัมผัสบรรยากาศจริง เสียงจริง และความรู้สึกจริง ก่อนการเดินทางของคุณ
          </p>
        </div>

        {/* Video Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-gray-700 hover:bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shadow-xl"
            aria-label="Previous videos"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Videos Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {videos.map((video, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 md:w-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative h-96">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
                    <div className="bg-orange-600 hover:bg-orange-700 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-gray-700 hover:bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shadow-xl"
            aria-label="Next videos"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
