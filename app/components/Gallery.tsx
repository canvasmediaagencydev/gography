'use client';

import Link from 'next/link';

export default function Gallery() {
  // Preview images for home page
  const previewImages = [
    { url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80', country: 'ญี่ปุ่น', description: 'ภูเขาฟูจิยามเช้า' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', country: 'นอร์เวย์', description: 'ฟยอร์ดอันน่าทึ่ง' },
    { url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80', country: 'ไอซ์แลนด์', description: 'ออโรร่ามหัศจรรย์' },
    { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80', country: 'สวิตเซอร์แลนด์', description: 'เทือกเขาแอลป์' },
    { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80', country: 'นิวซีแลนด์', description: 'ภูเขาและทะเลสาบ' },
    { url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=80', country: 'นอร์เวย์', description: 'หมู่บ้านริมทะเล' },
  ];

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

        {/* Preview Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {previewImages.map((image, index) => (
            <Link
              key={index}
              href="/gallery"
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.url}
                  alt={image.description}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="inline-block bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded-full mb-1">
                    {image.country}
                  </span>
                  <p className="text-white text-sm font-semibold">{image.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-3 rounded-full transition-colors duration-300">
            สอบถามหรือจองทริป
          </button>
          <Link href="/gallery">
            <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-10 py-3 rounded-full transition-colors duration-300">
              ดูภาพทั้งหมด
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
