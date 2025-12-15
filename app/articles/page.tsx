'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
}

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Sample articles data
  const articles: Article[] = [
    {
      id: '1',
      title: 'The Castle of Impossible Dreams: Ludwig\'s Eternal Legacy',
      excerpt: 'ของขวัญที่สร้างมาด้วยความฝันผสมความสวยงามสำหรับผู้ที่รักในศิลปะและสถาปัตยกรรม...',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
      date: '14 ก.ค. 2568',
      category: 'ยุโรป',
      readTime: '5 นาที'
    },
    {
      id: '2',
      title: 'Siberian Crystal: When Baikal Turns into an Eternal Winter',
      excerpt: 'ด้วยพลังแห่งธรรมชาติที่สามารถทำให้น้ำ ทะเลสาบที่ใหญ่ที่สุดในโลกกลายเป็นคริสตัลน้ำแข็งสีน้ำเงินใสสะอาดตา...',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
      date: '14 ก.ค. 2568',
      category: 'russia',
      readTime: '7 นาที'
    },
    {
      id: '3',
      title: 'Lofoten: Tales from the Edge of the World',
      excerpt: 'สัมผัสความงามของหมู่เกาะโลโฟเทน ดอยที่พื้นที่ทางเหนือสุดของโลก ที่มีทัศนีย์ภาพที่น่าตระการตา...',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
      date: '14 ก.ค. 2568',
      category: 'Norway',
      readTime: '6 นาที'
    },
    {
      id: '4',
      title: 'Iceland Where Fire Meets Ice',
      excerpt: 'สัมผัสประสบการณ์ที่ไม่เหมือนใคร เมื่อน้ำแข็งและไฟบรรจบกัน ในดินแดนแห่งออโรร่าและความมหัศจรรย์...',
      image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80',
      date: '20 มิ.ย. 2568',
      category: 'Iceland',
      readTime: '8 นาที'
    },
    {
      id: '5',
      title: 'Aurora Adventures: Chasing Northern Lights',
      excerpt: 'ค้นพบความมหัศจรรย์ของแสงเหนือ ปรากฏการณ์ธรรมชาติที่สวยงามที่สุดแห่งหนึ่งของโลก...',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
      date: '15 มิ.ย. 2568',
      category: 'Norway',
      readTime: '5 นาที'
    },
    {
      id: '6',
      title: 'Black Forest Magic: Germany\'s Enchanted Woods',
      excerpt: 'เข้าสู่ป่าดำที่ลึกลับแห่งเยอรมนี สถานที่แห่งเทพนิยายและความงามอันน่าทึ่ง...',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
      date: '10 มิ.ย. 2568',
      category: 'germany',
      readTime: '6 นาที'
    },
    {
      id: '7',
      title: 'Reykjavik Rhythms: Iceland\'s Capital Charms',
      excerpt: 'สำรวจเมืองหลวงที่มีสีสันและวัฒนธรรมที่ร่ำรวยของไอซ์แลนด์...',
      image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80',
      date: '5 มิ.ย. 2568',
      category: 'Iceland',
      readTime: '4 นาที'
    },
    {
      id: '8',
      title: 'Moscow Marvels: Red Square & Beyond',
      excerpt: 'ค้นพบความงดงามของสถาปัตยกรรมรัสเซียและประวัติศาสตร์อันยาวนานของมอสโก...',
      image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80',
      date: '1 มิ.ย. 2568',
      category: 'russia',
      readTime: '7 นาที'
    }
  ];

  const categories = ['ทั้งหมด', 'Iceland', 'russia', 'Norway', 'germany', 'ยุโรป'];

  // Filter articles based on selected category
  const filteredArticles = selectedCategory === 'ทั้งหมด'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1920&q=80)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
                "เพราะทุกการเดินทาง คือประสบการณ์ที่น่าจดจำ"
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-2">
                อ่านเรื่องราวจากทริปจริง เคล็ดลับ และไอเดีย
              </p>
              <p className="text-base md:text-lg text-white/80">
                ที่จะช่วยจากผู้เชี่ยวชาญเฉพาะทางของเรา
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            {/* Category Filter */}
            <div className="mb-12">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentArticles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Article Image */}
                  <Link href={`/articles/${article.id}`}>
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-gray-700">{article.category}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Article Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <time>{article.date}</time>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <Link href={`/articles/${article.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <Link href={`/articles/${article.id}`}>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 text-sm">
                        อ่านต่อ →
                      </button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-gray-200 hover:border-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gray-900 text-white'
                        : 'border-2 border-gray-200 text-gray-700 hover:border-orange-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-gray-200 hover:border-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Highlight Trips Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ทริปไฮไลท์</h2>
              <p className="text-gray-600 text-lg">ทริปยอดนิยมที่คัดสรรมาเพื่อคุณ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trip Card 1 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative h-64">
                  <img
                    src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80"
                    alt="Aurora Valentine Journey"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    VALENTINE
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold mb-2">
                        NORTHERN LIGHTS WITH LOVE
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-3">
                    Aurora Valentine Journey - Lofoten & Finland 2026
                  </h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>13-20 ก.พ. | 31 ม.ค. - 4 ก.พ. | 26-30 ม.ค.</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span>8-9/6 ที่นั่ง</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-gray-900">นอร์เวย์</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">฿165,900</p>
                      <p className="text-sm text-gray-500">ราคาเริ่มต้น 6 ท่าน</p>
                    </div>
                  </div>
                  <Link href="/trips">
                    <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full transition-colors duration-300">
                      ดูทริป →
                    </button>
                  </Link>
                </div>
              </div>

              {/* Trip Card 2 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative h-64">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                    alt="BALI-IJEN-BROMO"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold mb-2">
                        EXPLORE JAVA ISLAND
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-3">
                    BALI-IJEN-BROMO 2026
                  </h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>6-10 ม.ค. | 31 ม.ค. - 4 ก.พ. | 26-30 ม.ค.</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span>5-9/6 ที่นั่ง</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-gray-900">Indonesia</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">฿46,900</p>
                      <p className="text-sm text-gray-500">ราคาเริ่มต้น 6 ท่าน</p>
                    </div>
                  </div>
                  <Link href="/trips">
                    <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full transition-colors duration-300">
                      ดูทริป →
                    </button>
                  </Link>
                </div>
              </div>

              {/* Trip Card 3 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative h-64">
                  <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
                    alt="Summer Faroe Islands"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold mb-2">
                        MAGICAL ISLANDS
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-3">
                    Summer Faroe Islands 2026
                  </h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>24 มิ.ย. - 1 ก.ค. | 16-23 ก.ค.</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span>8-9/6 ที่นั่ง</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-gray-900">หมู่เกาะแฟโร</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">฿135,900</p>
                      <p className="text-sm text-gray-500">ราคาเริ่มต้น 12 ท่าน</p>
                    </div>
                  </div>
                  <Link href="/trips">
                    <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full transition-colors duration-300">
                      ดูทริป →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* View All Trips Button */}
            <div className="text-center mt-12">
              <Link href="/trips">
                <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105">
                  สอบถามหรือจองทริป
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              "อยากปล่อยให้ความชื่นในการเดินทางของคุณรอบเท็บไป"
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              ปล่อยให้ทีมประสบการณ์การเดินทางพาที่ เหล่าจะดีบนทุกที่ยืนอยู่มากมากกับการท่องเที่ยว
              และจ่างหาทริปด้วยเพื่อพิชิตที่ทำการคุมรวมผลกันทั้งประจำ ของคุณรออยู่หรื่ของที่ผู้เริ่น
            </p>
            <p className="text-2xl font-bold text-white mb-8">
              เริ่มต้นการเดินทางของคุณเดินดี
            </p>
            <Link href="/#contact">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
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
