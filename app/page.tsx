import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import UpcomingTrips from './components/UpcomingTrips';
import TripsReviews from './components/TripsReviews';
import Gallery from './components/Gallery';
import VideoGallery from './components/VideoGallery';
import BlogArticles from './components/BlogArticles';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Gography',
    alternateName: 'Gography Thailand',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gography.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://gography.com'}/logo.png`,
    description: 'ทัวร์ถ่ายภาพและท่องเที่ยว Photography & Travel Tours in Thailand',
    telephone: '+66-97-919-9293',
    email: 'info@gography.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TH',
      addressLocality: 'Thailand',
    },
    sameAs: [
      'https://www.facebook.com/gography.official',
      'https://www.instagram.com/gography.official',
      'https://line.me/ti/p/@gography',
    ],
    areaServed: [
      {
        '@type': 'Country',
        name: 'Thailand',
      },
      {
        '@type': 'Country',
        name: 'Iceland',
      },
      {
        '@type': 'Country',
        name: 'Norway',
      },
      {
        '@type': 'Country',
        name: 'Russia',
      },
      {
        '@type': 'Country',
        name: 'Japan',
      },
      {
        '@type': 'Country',
        name: 'Switzerland',
      },
    ],
    priceRange: '฿฿-฿฿฿',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Travel Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Photography Tours',
            description: 'ทัวร์ถ่ายภาพพร้อมไกด์มืออาชีพ',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Private Tours',
            description: 'ทัวร์ส่วนตัวที่ออกแบบเฉพาะสำหรับคุณ',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Group Tours',
            description: 'ทัวร์กลุ่มไปยังจุดหมายปลายทางที่น่าสนใจ',
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Features />
        <UpcomingTrips />
        <TripsReviews />
        <Gallery />
        <VideoGallery />
        <BlogArticles />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
