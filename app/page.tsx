import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Partners from './components/Partners';
import UpcomingTrips from './components/UpcomingTrips';
import TripsReviews from './components/TripsReviews';
import Gallery from './components/Gallery';
import VideoGallery from './components/VideoGallery';
import BlogArticles from './components/BlogArticles';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Features />
        <Partners />
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
