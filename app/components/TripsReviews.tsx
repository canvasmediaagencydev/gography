'use client';

import { useState } from 'react';

export default function TripsReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80',
      name: 'นลิตรซีย อองสุรรนา',
      review: 'ภาคจริงที่ 10000% จำเป็น tour ที่คุณทาพสุมาทุกสิ่ง ไปมา แล้วคง จะไม่กับGo Graphy ตัดไปรีมแล้ม เป็น group ปีนทาราพทาพจาก , ค่าเราไปแค่ไปไต้ภาพที่สวยมากคุณหมดี ้มไมแข หรือไป tourอื่น แทงกว่า เจาที่ใจจุงมากsmart guide แต่ มีเราได้ทพจากprofessional photographers ...'
    },
    {
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
      name: 'คุณสัมพ วิริยะรายย',
      review: 'ทริป Lofoten จัดมันมา ค่ะ. Gography ชายล่าากบุ ก้ิงแลอ เหนิอ และปนุนออกๆ อักขากานต สนุก เปนไปแมไ แดจ้วยจัทริจ สะดับนิปชจ. กลับบ้านแล้อ นอกเลอ ..ต้องไปการนซาอัก แปนอน ค่า'
    },
    {
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80',
      name: 'คุมธิดา นิงสานนท์',
      review: 'ต้มหลงรักการถ่ายภาพ และยิ่งประกับใจมือโต้อลจองมาจาก G Graphy ที่ได้ท่านกับช่างกบุช เพื่อให้ได้ภาพที่สวยมาก เเลแบบนี มาต้มต้องมีไปไต้ สี่ต้องภาพไปรั้มอาตราส้อยอยุกมี้อ กรนีมีชั้พโก้า อันใไทเเลอัมตอจม ขอบคุณสำหรับประสบการณ์ที่ไม่มีลยมาก่อน ค่ะ'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-orange-600 mb-4">
          TRIPS' REVIEWS
        </h2>
        <p className="text-center text-gray-700 text-base md:text-lg mb-16">
          รีวิว 5 ⭐ เต็ม! จากลูกค้าเท่านมากกว่า<span className="text-orange-600 font-bold">100</span>รีวิวใน Facebook ของ
          <br />
          เรา การันตีความน่าอาชีพ และความประทับใจของลูกค้าทุกท่าน
        </p>

        {/* Reviews Carousel Container */}
        <div className="relative max-w-6xl mx-auto mb-12">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-black hover:bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shadow-xl"
            aria-label="Previous review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Reviews Grid - Always show 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {[0, 1, 2].map((offset) => {
              const index = (currentIndex + offset) % reviews.length;
              const review = reviews[index];
              return (
                <div
                  key={offset}
                  className="bg-white rounded-lg overflow-hidden shadow-lg"
                >
                  {/* Review Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Review Content */}
                  <div className="p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">
                      {review.name}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.review}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-black hover:bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shadow-xl"
            aria-label="Next review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-3 rounded-full transition-colors duration-300">
            สอบถามและจองทริป
          </button>
          <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-10 py-3 rounded-full transition-colors duration-300">
            ดูรีวิวทั้งหมด
          </button>
        </div>
      </div>
    </section>
  );
}
