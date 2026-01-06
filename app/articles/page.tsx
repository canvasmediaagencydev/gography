'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HighlightTrips from '../components/HighlightTrips';

// Note: This is a client component, so metadata should be moved to a layout.tsx or use next/head
// For now, we'll create a separate metadata export in the parent route

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
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1920&q=80)' }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/70 dark:from-black/80 dark:via-black/70 dark:to-black/80"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
                &quot;เพราะทุกการเดินทาง คือประสบการณ์ที่น่าจดจำ&quot;
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
                    className={`cursor-pointer px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gray-900 dark:bg-orange-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
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
                  className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Article Image */}
                  <Link href={`/articles/${article.id}`}>
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{article.category}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Article Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <time>{article.date}</time>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <Link href={`/articles/${article.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <Link href={`/articles/${article.id}`}>
                      <button className="cursor-pointer bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 text-sm">
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
                  className="cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:border-orange-600 dark:hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gray-900 dark:bg-orange-600 text-white'
                        : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-orange-600 dark:hover:border-orange-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:border-orange-600 dark:hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Highlight Trips Section */}
        <HighlightTrips />

        {/* CTA Section */}
        <section className="py-20 px-6 bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              &quot;อยากปล่อยให้ความชื่นในการเดินทางของคุณรอบเท็บไป&quot;
            </h2>
            <p className="text-xl text-gray-300 dark:text-gray-400 mb-8">
              ปล่อยให้ทีมประสบการณ์การเดินทางพาที่ เหล่าจะดีบนทุกที่ยืนอยู่มากมากกับการท่องเที่ยว
              และจ่างหาทริปด้วยเพื่อพิชิตที่ทำการคุมรวมผลกันทั้งประจำ ของคุณรออยู่หรื่ของที่ผู้เริ่น
            </p>
            <p className="text-2xl font-bold text-white mb-8">
              เริ่มต้นการเดินทางของคุณเดินดี
            </p>
            <Link href="/contact">
              <button className="cursor-pointer bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
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
