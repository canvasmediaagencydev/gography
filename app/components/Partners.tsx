'use client';

import Image from 'next/image';

export default function Partners() {

  const partners = [
    '/partner/partner1.png',
    '/partner/partner2.png',
    '/partner/partner3.png',
    '/partner/partner4.png',
    '/partner/partner5.png',
    '/partner/partner6.png',
    '/partner/partner7.png',
  ];

  // Duplicate partners array for infinite scroll effect
  const allPartners = [...partners, ...partners, ...partners];

  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Section Title */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
          OUR PARTNERS
        </h2>

        {/* Partners Carousel */}
        <div className="relative">
          <div
            className="flex gap-8 animate-scroll"
            style={{
              width: 'fit-content',
            }}
          >
            {allPartners.map((partner, index) => (
              <div
                key={index}
                className="shrink-0 w-32 h-32 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner}
                    alt={`Partner ${(index % partners.length) + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
