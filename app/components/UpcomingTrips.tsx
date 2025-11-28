import Image from 'next/image';
import Link from 'next/link';

export default function UpcomingTrips() {
  const trips = [
    {
      image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80',
      title: 'BAIKAL WINTER 2026',
      badge: 'BAIKAL WINTER 2026',
      dates: '7-13 ก.พ.   21-27 ก.พ.   11-17 มี.ค.',
      duration: '7 วัน 6 คืน',
      country: 'รัสเซีย',
      flag: '🇷🇺',
      price: '฿72,900',
      slots: 'รับ 14 ท่าน'
    },
    {
      image: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&q=80',
      title: 'Aurora Valentine Journey – Lofoten & Finland 2026',
      dates: '13-20 ก.พ.',
      duration: '8 วัน 6 คืน',
      country: 'นอร์เวย์',
      flag: '🇳🇴',
      price: '฿165,900',
      slots: 'รับ 6 ท่าน'
    },
    {
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
      title: 'LOFOTEN WINTER - Aurora 2026',
      dates: '18-24 ก.พ.',
      duration: '7 วัน 5 คืน',
      country: 'นอร์เวย์',
      flag: '🇳🇴',
      price: '฿89,900',
      slots: 'รับ 6 ท่าน'
    },
    {
      image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80',
      title: 'ICELAND WINTER - Aurora 2026',
      dates: '25 ก.พ. - 6 มี.ค.   11-20 มี.ค.',
      duration: '10 วัน 8 คืน',
      country: 'ไอซ์แลนด์',
      flag: '🇮🇸',
      price: '฿139,900',
      slots: 'รับ 8 ท่าน'
    },
    {
      image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&q=80',
      title: 'WINTER IN FINLAND 2026',
      dates: '22-28 มี.ค.',
      duration: '7 วัน 5 คืน',
      country: 'ฟินแลนด์',
      flag: '🇫🇮',
      price: '฿99,900',
      slots: 'รับ 10 ท่าน'
    },
    {
      image: 'https://images.unsplash.com/photo-1570993492903-ba4c3088f100?w=800&q=80',
      title: 'PATAGONIA',
      dates: '11-23 เม.ย.',
      duration: '13 วัน 11 คืน',
      country: 'อาร์เจนตินา',
      flag: '🇦🇷',
      price: '฿289,900',
      slots: 'รับ 12 ท่าน'
    }
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          UPCOMING TRIPS
        </h2>
        <p className="text-center text-gray-700 text-base md:text-lg mb-12 max-w-4xl mx-auto">
          ลูกค้าทุกท่านจะไม่พลาด<span className="text-orange-600 font-semibold">ความทรงจำที่ดีและรับที่สุดขอมจากภาพของเรา</span>ในทุกการเดินทางอย่างแน่นอน!
          <br />
          เราจะพากุกท่านไปอยู่ในใจเคยึ่งที่พิเศษไม่ช่วงเวลาพิเศษเสมอ
        </p>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Trip Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                {trip.badge && (
                  <div className="absolute bottom-4 left-4 bg-gray-700/80 backdrop-blur-sm text-white px-4 py-2 rounded text-sm font-semibold">
                    {trip.badge}
                  </div>
                )}
              </div>

              {/* Trip Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 min-h-[56px]">
                  {trip.title}
                </h3>

                {/* Dates */}
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{trip.dates}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{trip.duration}</span>
                </div>

                {/* Country */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <span className="text-lg">{trip.flag}</span>
                  <span className="text-sm">{trip.country}</span>
                </div>

                {/* Price and Slots */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {trip.price}
                  </div>
                  <div className="text-sm text-gray-600">
                    {trip.slots}
                  </div>
                </div>

                {/* Book Button */}
                <Link
                  href={`/trips/${index + 1}`}
                  className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full text-center transition-colors duration-300"
                >
                  ดูทรีป →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/trips"
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold px-12 py-4 rounded-full transition-colors duration-300"
          >
            ดูทริปทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  );
}
