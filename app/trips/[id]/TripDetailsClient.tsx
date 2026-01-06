'use client'

import { useEffect, useState, use } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

type FaqImage = {
  id: string
  storage_url: string
  caption: string | null
  alt_text: string | null
}

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=1600&q=80&auto=format&fit=crop'

interface TripData {
  trip: {
    id: string
    title: string
    description: string | null
    country: {
      name_th: string
      name_en: string
      flag_emoji: string
      code: string
    }
    price_per_person: number
    formatted_price: string
    cover_image_url: string | null
    file_link: string | null
    trip_type: 'group' | 'private'
  }
  schedules: Array<{
    id: string
    departure_date: string
    return_date: string
    registration_deadline: string
    dates: string
    duration: string
    available_seats: number
    total_seats: number
    slots: string
    is_active: boolean
  }>
  gallery: Array<{
    id: string
    storage_url: string
    title: string
    description: string | null
    alt_text: string | null
    order_index: number
  }>
  itinerary?: Array<{
    id: string
    day_number: number
    day_title: string
    day_description: string | null
    activities?: Array<{
      id: string
      activity_time: string | null
      activity_description: string
    }>
    images?: Array<{
      id: string
      storage_url: string
      caption: string | null
      alt_text: string | null
    }>
  }>
  faqs?: Array<{
    id: string
    question: string
    answer: string
    images?: Array<{
      id: string
      storage_url: string
      caption: string | null
      alt_text: string | null
    }>
  }>
}

export default function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const previewMode = searchParams.get('preview') === '1' || searchParams.get('preview') === 'true'
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [heroImageUrl, setHeroImageUrl] = useState<string>(DEFAULT_HERO_IMAGE)
  const [isItineraryImageOpen, setIsItineraryImageOpen] = useState(false)
  const [currentItineraryImages, setCurrentItineraryImages] = useState<Array<{id: string, storage_url: string, caption: string | null, alt_text: string | null}>>([])
  const [currentItineraryImageIndex, setCurrentItineraryImageIndex] = useState(0)
  const [isFaqImageOpen, setIsFaqImageOpen] = useState(false)
  const [currentFaqImages, setCurrentFaqImages] = useState<FaqImage[]>([])
  const [currentFaqImageIndex, setCurrentFaqImageIndex] = useState(0)

  useEffect(() => {
    loadTripData()
  }, [id, previewMode])

  useEffect(() => {
    if (tripData && tripData.schedules.length > 0) {
      // Try to get schedule from URL query parameter
      const scheduleParam = searchParams.get('schedule')
      if (scheduleParam && tripData.schedules.some(s => s.id === scheduleParam)) {
        setSelectedScheduleId(scheduleParam)
      } else {
        // Default to first schedule
        setSelectedScheduleId(tripData.schedules[0].id)
      }
    }
  }, [tripData, searchParams])

  useEffect(() => {
    if (!tripData) return
    const fallbackImage = tripData.gallery[0]?.storage_url || DEFAULT_HERO_IMAGE
    const imageUrl = tripData.trip.cover_image_url || fallbackImage
    setHeroImageUrl(imageUrl)
  }, [tripData])

  const loadTripData = async () => {
    try {
      const previewParam = previewMode ? '?preview=1' : ''
      const res = await fetch(`/api/trips/${id}/public${previewParam}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError('ไม่พบทริปนี้')
        } else {
          setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
        return
      }
      const data = await res.json()
      setTripData(data)
    } catch (err) {
      console.error('Error loading trip:', err)
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedSchedule = tripData?.schedules.find(s => s.id === selectedScheduleId)

  const handleBooking = () => {
    if (!tripData || !selectedSchedule) return

    const message = `สวัสดีครับ สนใจจองทริป "${tripData.trip.title}" รอบวันที่ ${selectedSchedule.dates}`
    window.open(`https://line.me/ti/p/@Gography?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: tripData?.trip.title,
          text: tripData?.trip.description || '',
          url: url,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert('คัดลอก URL แล้ว!')
    }
  }

  const openGallery = (index: number) => {
    setCurrentImageIndex(index)
    setIsGalleryOpen(true)
  }

  const closeGallery = () => {
    setIsGalleryOpen(false)
  }

  const nextImage = () => {
    if (!tripData) return
    setCurrentImageIndex((prev) => (prev + 1) % tripData.gallery.length)
  }

  const prevImage = () => {
    if (!tripData) return
    setCurrentImageIndex((prev) => (prev - 1 + tripData.gallery.length) % tripData.gallery.length)
  }

  const openItineraryImage = (images: typeof currentItineraryImages, index: number) => {
    setCurrentItineraryImages(images)
    setCurrentItineraryImageIndex(index)
    setIsItineraryImageOpen(true)
  }

  const closeItineraryImage = () => {
    setIsItineraryImageOpen(false)
  }

  const nextItineraryImage = () => {
    setCurrentItineraryImageIndex((prev) => (prev + 1) % currentItineraryImages.length)
  }

  const prevItineraryImage = () => {
    setCurrentItineraryImageIndex((prev) => (prev - 1 + currentItineraryImages.length) % currentItineraryImages.length)
  }

  const openFaqImage = (images: FaqImage[], index: number) => {
    setCurrentFaqImages(images)
    setCurrentFaqImageIndex(index)
    setIsFaqImageOpen(true)
  }

  const closeFaqImage = () => {
    setIsFaqImageOpen(false)
  }

  const nextFaqImage = () => {
    setCurrentFaqImageIndex((prev) => (prev + 1) % currentFaqImages.length)
  }

  const prevFaqImage = () => {
    setCurrentFaqImageIndex((prev) => (prev - 1 + currentFaqImages.length) % currentFaqImages.length)
  }

  // Handle keyboard navigation in gallery
  useEffect(() => {
    if (!isGalleryOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGallery()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isGalleryOpen, tripData])

  // Handle keyboard navigation in itinerary image modal
  useEffect(() => {
    if (!isItineraryImageOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeItineraryImage()
      if (e.key === 'ArrowLeft') prevItineraryImage()
      if (e.key === 'ArrowRight') nextItineraryImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isItineraryImageOpen, currentItineraryImages])

  // Handle keyboard navigation in FAQ image modal
  useEffect(() => {
    if (!isFaqImageOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFaqImage()
      if (e.key === 'ArrowLeft') prevFaqImage()
      if (e.key === 'ArrowRight') nextFaqImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFaqImageOpen, currentFaqImages])

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600 dark:border-orange-500"></div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !tripData) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{error}</h1>
            <Link
              href="/trips"
              className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
            >
              ดูทริปทั้งหมด
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const { trip, schedules, gallery } = tripData
  const fallbackHeroImage = gallery[0]?.storage_url || DEFAULT_HERO_IMAGE
  const shareImage = trip.cover_image_url || gallery[0]?.storage_url || DEFAULT_HERO_IMAGE

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": trip.title,
    "description": trip.description,
    "image": shareImage,
    "touristType": trip.trip_type === 'private' ? 'Private Tour' : 'Group Tour',
    "itinerary": {
      "@type": "ItemList",
      "itemListElement": tripData.itinerary?.map((day, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": day.day_title,
        "description": day.day_description,
      })) || []
    },
    "offers": selectedSchedule ? {
      "@type": "Offer",
      "price": trip.price_per_person,
      "priceCurrency": "THB",
      "availability": selectedSchedule.available_seats > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      "validFrom": selectedSchedule.departure_date,
      "url": typeof window !== 'undefined' ? window.location.href : `https://gography.com/trips/${id}`,
    } : undefined,
    "provider": {
      "@type": "Organization",
      "name": "Gography",
      "url": "https://gography.com"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        {heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt={trip.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 1 }}
            onError={(e) => {
              if (heroImageUrl !== fallbackHeroImage) {
                setHeroImageUrl(fallbackHeroImage)
                return
              }
              if (heroImageUrl !== DEFAULT_HERO_IMAGE) {
                setHeroImageUrl(DEFAULT_HERO_IMAGE)
                return
              }
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-indigo-700"></div>
        )}
        <div className="absolute inset-0 bg-black/30" style={{ zIndex: 2 }}></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6" style={{ zIndex: 3 }}>
          {/* Breadcrumb */}
          <div className="text-sm mb-4 opacity-90">
            <Link href="/" className="hover:underline">หน้าแรก</Link>
            {' > '}
            <Link href="/trips" className="hover:underline">ทริปทั้งหมด</Link>
            {' > '}
            <span>{trip.title}</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold text-center mb-4">{trip.title}</h1>

          <div className="flex items-center gap-4 text-lg">
            <span className="text-2xl">{trip.country.flag_emoji}</span>
            <span>{trip.country.name_th}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 bg-white dark:bg-gray-900 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-8 space-y-6">

            {/* Trip Overview */}
            {trip.description && (
              <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">รายละเอียดทริป</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{trip.description}</p>
              </div>
            )}

            {/* Itinerary Section */}
            {trip.file_link && (
              <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">กำหนดการเดินทาง</h2>
                <a
                  href={trip.file_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ดาวน์โหลดโปรแกรมทริป (PDF)
                </a>
              </div>
            )}

            {/* Gallery Section */}
            {gallery.length > 0 && (
              <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">แกลเลอรี่ภาพ</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.slice(0, 5).map((img, idx) => (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => openGallery(idx)}
                    >
                      <img
                        src={img.storage_url}
                        alt={img.alt_text || img.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                  {gallery.length > 5 && (
                    <div
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-900 dark:bg-gray-800"
                      onClick={() => openGallery(5)}
                    >
                      <img
                        src={gallery[5].storage_url}
                        alt={gallery[5].alt_text || gallery[5].title}
                        className="w-full h-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          +{gallery.length - 5} ภาพ
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Daily Itinerary Section */}
            {tripData?.itinerary && tripData.itinerary.length > 0 && (
              <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">กำหนดการเดินทางรายวัน</h2>
                <div className="space-y-6">
                  {tripData.itinerary.map((day) => (
                    <div key={day.id} className="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                      {/* Day Header */}
                      <div className="p-5 bg-linear-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-b-2 border-orange-200 dark:border-orange-700">
                        <div className="flex items-center gap-4">
                          <span className="shrink-0 w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                            {day.day_number}
                          </span>
                          <h3 className="flex-1 text-gray-900 dark:text-white font-bold text-lg">{day.day_title}</h3>
                        </div>
                      </div>

                      {/* Day Content */}
                      <div className="p-6 space-y-5 bg-gray-50 dark:bg-gray-900">
                        {/* Day Description */}
                        {day.day_description && (
                          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">{day.day_description}</p>
                          </div>
                        )}

                        {/* Activities */}
                        {day.activities && day.activities.length > 0 && (
                          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 p-5 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-base flex items-center gap-2">
                              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                              </svg>
                              กิจกรรม
                            </h3>
                            <div className="space-y-3">
                              {day.activities.map((activity) => (
                                <div key={activity.id} className="flex gap-3 items-start pl-1">
                                  <span className="shrink-0 text-blue-600 dark:text-blue-400 font-bold text-lg mt-0.5">•</span>
                                  <div className="flex gap-3 items-start flex-1">
                                    {activity.activity_time && (
                                      <span className="shrink-0 px-3 py-1 bg-orange-600 dark:bg-orange-500 text-white font-bold text-sm rounded-md shadow-sm">
                                        {activity.activity_time}
                                      </span>
                                    )}
                                    <span className="text-gray-900 dark:text-gray-300 flex-1 leading-relaxed font-medium text-base">{activity.activity_description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Day Images */}
                        {day.images && day.images.length > 0 && (
                          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 p-5 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-base flex items-center gap-2">
                              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              รูปภาพ
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {day.images.map((img, imgIdx) => (
                                <div
                                  key={img.id}
                                  className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 transition-colors cursor-pointer group"
                                  onClick={() => openItineraryImage(day.images || [], imgIdx)}
                                >
                                  <img
                                    src={img.storage_url}
                                    alt={img.alt_text || img.caption || `Day ${day.day_number}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  {img.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent text-white text-sm p-3 font-medium">
                                      {img.caption}
                                    </div>
                                  )}
                                  {/* Click indicator */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {tripData?.faqs && tripData.faqs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">คำถามที่พบบ่อย (FAQ)</h2>
                <div className="space-y-4">
                  {tripData.faqs.map((faq, index) => (
                    <FAQAccordionItem
                      key={faq.id}
                      faq={faq}
                      index={index}
                      onOpenImage={openFaqImage}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column - Booking Card (Sticky) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 rounded-2xl shadow-xl p-6 border-2 border-gray-100">
                {/* Price */}
                <div className="mb-6 pb-6 border-b-2 border-gray-100 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">ราคาเริ่มต้น</p>
                  <p className="text-5xl font-bold text-orange-600 dark:text-orange-500">{trip.formatted_price}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium mt-1">ต่อท่าน</p>
                </div>

                {/* Schedule Selector */}
                {schedules.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
                        เลือกรอบเดินทาง
                      </label>
                      <div className="space-y-3">
                        {schedules.map((schedule) => (
                          <button
                            key={schedule.id}
                            onClick={() => setSelectedScheduleId(schedule.id)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all shadow-sm hover:shadow-md ${
                              selectedScheduleId === schedule.id
                                ? 'border-orange-600 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/30 shadow-md'
                                : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 bg-white dark:bg-gray-700'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-white text-base mb-1">{schedule.dates}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{schedule.duration}</p>
                              </div>
                              <div className="text-right ml-2">
                                <p className="text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-3 py-1 rounded-full whitespace-nowrap">{schedule.slots}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected Schedule Details */}
                    {selectedSchedule && (
                      <div className="mt-4 mb-6 p-4 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700 space-y-3">
                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">รายละเอียดรอบที่เลือก</p>
                        <div className="flex items-center gap-3 text-sm">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-semibold text-gray-900 dark:text-white">{selectedSchedule.dates}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-gray-900 dark:text-white">{selectedSchedule.duration}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-semibold text-gray-900 dark:text-white">{selectedSchedule.slots}</span>
                        </div>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={handleBooking}
                        className="w-full bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white py-4 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        สอบถาม/จองทริป
                      </button>
                      <button
                        onClick={handleShare}
                        className="w-full border-2 border-gray-400 dark:border-gray-600 hover:border-orange-600 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-900 dark:text-white py-3 rounded-xl font-bold text-base transition-all"
                      >
                        แชร์ทริปนี้
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">ขณะนี้ยังไม่มีรอบเดินทางที่เปิดรับ</p>
                    <button
                      onClick={() => window.open('https://line.me/ti/p/@Gography', '_blank')}
                      className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-3 rounded-full font-semibold transition-colors"
                    >
                      ติดต่อสอบถาม
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && gallery.length > 0 && (
        <div className="fixed inset-0 z-9999 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ×
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ‹
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ›
          </button>

          <div className="max-w-6xl max-h-[90vh] mx-auto px-16">
            <img
              src={gallery[currentImageIndex].storage_url}
              alt={gallery[currentImageIndex].alt_text || gallery[currentImageIndex].title}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="text-center text-white mt-4">
              <p className="text-lg font-semibold">{gallery[currentImageIndex].title}</p>
              {gallery[currentImageIndex].description && (
                <p className="text-sm text-gray-300 mt-1">{gallery[currentImageIndex].description}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                {currentImageIndex + 1} / {gallery.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Itinerary Image Modal */}
      {isItineraryImageOpen && currentItineraryImages.length > 0 && (
        <div className="fixed inset-0 z-9999 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeItineraryImage}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ×
          </button>

          {currentItineraryImages.length > 1 && (
            <>
              <button
                onClick={prevItineraryImage}
                className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
              >
                ‹
              </button>

              <button
                onClick={nextItineraryImage}
                className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
              >
                ›
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] mx-auto px-16">
            <img
              src={currentItineraryImages[currentItineraryImageIndex].storage_url}
              alt={currentItineraryImages[currentItineraryImageIndex].alt_text || currentItineraryImages[currentItineraryImageIndex].caption || 'Itinerary image'}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="text-center text-white mt-4">
              {currentItineraryImages[currentItineraryImageIndex].caption && (
                <p className="text-lg font-semibold">{currentItineraryImages[currentItineraryImageIndex].caption}</p>
              )}
              {currentItineraryImages.length > 1 && (
                <p className="text-sm text-gray-400 mt-2">
                  {currentItineraryImageIndex + 1} / {currentItineraryImages.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Image Modal */}
      {isFaqImageOpen && currentFaqImages.length > 0 && (
        <div className="fixed inset-0 z-9999 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeFaqImage}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ×
          </button>

          {currentFaqImages.length > 1 && (
            <>
              <button
                onClick={prevFaqImage}
                className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
              >
                ‹
              </button>

              <button
                onClick={nextFaqImage}
                className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
              >
                ›
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] mx-auto px-16">
            <img
              src={currentFaqImages[currentFaqImageIndex].storage_url}
              alt={currentFaqImages[currentFaqImageIndex].alt_text || currentFaqImages[currentFaqImageIndex].caption || 'FAQ image'}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="text-center text-white mt-4">
              {currentFaqImages[currentFaqImageIndex].caption && (
                <p className="text-lg font-semibold">{currentFaqImages[currentFaqImageIndex].caption}</p>
              )}
              {currentFaqImages.length > 1 && (
                <p className="text-sm text-gray-400 mt-2">
                  {currentFaqImageIndex + 1} / {currentFaqImages.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

// FAQ Accordion Item Component
function FAQAccordionItem({ faq, index, onOpenImage }: {
  faq: {
    id: string
    question: string
    answer: string
    images?: FaqImage[]
  }
  index: number
  onOpenImage: (images: FaqImage[], index: number) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Question Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
      >
        <div className="shrink-0 w-10 h-10 bg-linear-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white rounded-full flex items-center justify-center font-bold text-base shadow-md">
          {index + 1}
        </div>
        <h3 className="flex-1 font-bold text-lg text-gray-900 dark:text-white">{faq.question}</h3>
        <svg
          className={`w-6 h-6 text-gray-400 dark:text-gray-500 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Answer Content */}
      {isExpanded && (
        <div className="border-t-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5 space-y-4">
          {/* Answer Text */}
          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
              {faq.answer}
            </p>
          </div>

          {/* Answer Images */}
          {faq.images && faq.images.length > 0 && (
            <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-600 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                รูปภาพประกอบ
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {faq.images.map((img, imgIdx) => (
                  <div
                    key={img.id}
                    className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer group"
                    onClick={() => onOpenImage(faq.images || [], imgIdx)}
                  >
                    <img
                      src={img.storage_url}
                      alt={img.alt_text || img.caption || 'FAQ image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent text-white text-sm p-3 font-medium">
                        {img.caption}
                      </div>
                    )}
                    {/* Click indicator */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
