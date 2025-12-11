'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

export default function VideoGallery() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play on load
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videos = useMemo(() => [
    {
      videoUrl: 'https://www.youtube.com/embed/rrVnGCMf82c',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      title: 'JAPAN TRAVEL GUIDE',
      subtitle: 'Explore Japan',
      location: 'Japan',
      description: 'Discover the wonders of Japan through this comprehensive travel guide. From ancient temples to modern cities, experience the perfect blend of tradition and innovation that makes Japan unique.'
    },
    {
      videoUrl: 'https://www.youtube.com/embed/l-S7TBFCIiE',
      thumbnail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
      title: 'SCENIC JOURNEY',
      subtitle: 'Natural Beauty',
      location: 'Japan',
      description: 'Immerse yourself in the breathtaking natural landscapes of Japan. From snow-capped mountains to serene countryside, witness the stunning beauty that defines this incredible destination.'
    },
    {
      videoUrl: 'https://www.youtube.com/embed/qDaLSX16VTM',
      thumbnail: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
      title: 'CULTURAL EXPERIENCE',
      subtitle: 'Tradition & Heritage',
      location: 'Japan',
      description: 'Experience the rich cultural heritage and timeless traditions of Japan. From traditional ceremonies to historic landmarks, explore the cultural treasures that have shaped this fascinating nation.'
    }
  ], []);

  const currentVideo = videos[activeVideoIndex];

  // Handle video card click
  const handleVideoClick = (index: number) => {
    setActiveVideoIndex(index);
    setIsPlaying(true);
  };

  // Auto-advance to next video after 1 minute
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      const nextIndex = (activeVideoIndex + 1) % videos.length;
      setActiveVideoIndex(nextIndex);
    }, 60000); // 1 minute = 60,000 milliseconds

    return () => clearTimeout(timer);
  }, [activeVideoIndex, isPlaying, videos.length]);


  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video/Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {isPlaying ? (
          <iframe
            ref={iframeRef}
            src={`${currentVideo.videoUrl}?autoplay=1&mute=1&controls=0&rel=0&enablejsapi=1&loop=0`}
            className="w-full h-full scale-150 pointer-events-none"
            allow="autoplay; encrypted-media"
            style={{ border: 'none' }}
            key={activeVideoIndex}
          />
        ) : (
          <img
            src={currentVideo.thumbnail}
            alt={currentVideo.title}
            className="w-full h-full object-cover transition-all duration-700"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
        {/* Location Badge */}
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-600/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-semibold text-sm uppercase">Discover Location</span>
          </div>
        </div>

        {/* Video Info */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-orange-400 text-sm md:text-base font-semibold mb-2 uppercase tracking-wider">
            {currentVideo.subtitle}
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {currentVideo.title}
          </h2>
          <p className="text-white/90 text-base md:text-lg leading-relaxed">
            {currentVideo.description}
          </p>

          {/* Video Controls */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {isPlaying ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Video
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {videos.map((video, index) => (
            <div
              key={index}
              onClick={() => handleVideoClick(index)}
              className={`group relative rounded-xl overflow-hidden shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
                activeVideoIndex === index ? 'ring-4 ring-orange-500' : ''
              }`}
            >
              {/* Video Thumbnail */}
              <div className="relative h-72 md:h-80 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>

                {/* Play Button or Now Playing Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {activeVideoIndex === index && isPlaying ? (
                    <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="bg-orange-600 hover:bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-orange-400 text-sm font-semibold uppercase tracking-wide">
                      {video.location}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg md:text-xl leading-tight">
                    {video.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </section>
  );
}
