import Link from 'next/link';

export default function BlogArticles() {
  const articles = [
    {
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
      title: 'The Castle of Impossible Dreams: Ludwig\'s Eternal Legacy',
      date: '14 ก.ค. 2568',
      country: 'germany',
      countryLabel: 'Germany',
      excerpt: 'เนอชวานชไตน์: ปราสาทเทพนิยายแห่งบาวาเรีย',
      slug: 'castle-of-impossible-dreams'
    },
    {
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
      title: 'Siberian Crystal: When Baikal Turns to Glass',
      date: '14 ก.ค. 2568',
      country: 'russia',
      countryLabel: 'Russia',
      excerpt: 'ค้นพบมหัศจรรย์ของทะเลสาบไบคาลในฤดูหนาว เมื่อน้ำใสกลายเป็นกระจกยักษ์ที่กอดยาวกว่า 600...',
      slug: 'siberian-crystal-baikal'
    },
    {
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
      title: 'Lofoten: Tales from the Edge of the World',
      date: '14 ก.ค. 2568',
      country: 'norway',
      countryLabel: 'Norway',
      excerpt: 'เรื่องเล่าจากหมู่เกาะมหัศจรรย์ณ ขอบโลกอาร์กติก ที่ธรรมชาติได้แกะสลักด้วยมือสูงชั้น พยัตราลิกลับ...',
      slug: 'lofoten-tales-edge-of-world'
    }
  ];

  const getCountryColor = (country: string) => {
    const colors: { [key: string]: string } = {
      germany: 'bg-orange-100 text-orange-600',
      russia: 'bg-blue-100 text-blue-600',
      norway: 'bg-gray-200 text-gray-700'
    };
    return colors[country] || 'bg-gray-100 text-gray-600';
  };

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-4">
            บทความที่น่าสนใจ
          </h2>
          <p className="text-gray-700 text-base md:text-lg max-w-4xl mx-auto">
            เปิดโลกการเดินทาง ผ่านตัวอักษรที่มีชีวิต
            <br />
            และเรื่องราวที่จะให้คุณค้นพบมากกว่าแค่ที่จะพาคุณท่องโลกก่อนออกเดินทางจริง
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Article Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>

                {/* Date and Country */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{article.date}</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCountryColor(article.country)}`}>
                    {article.countryLabel}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Read More Button */}
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-block bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold px-6 py-2 rounded-full transition-colors duration-300 text-sm"
                >
                  อ่านต่อ
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold px-12 py-4 rounded-full transition-colors duration-300"
          >
            ดูทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  );
}
