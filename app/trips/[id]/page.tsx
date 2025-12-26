import { Metadata } from 'next'
import TripDetailsClient from './TripDetailsClient'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gography.com'

  try {
    const res = await fetch(`${siteUrl}/api/trips/${id}/public`, {
      next: { revalidate: 3600 }
    })

    if (!res.ok) {
      return {
        title: 'ไม่พบทริป',
        description: 'ไม่พบทริปที่คุณค้นหา'
      }
    }

    const data = await res.json()
    const trip = data.trip
    const shareImage = trip.cover_image_url || data.gallery[0]?.storage_url

    return {
      title: trip.title,
      description: trip.description?.substring(0, 160) || `เที่ยว${trip.country.name_th} กับ Gography - ${trip.title}`,
      keywords: [
        trip.title,
        trip.country.name_th,
        trip.country.name_en,
        'ทัวร์ถ่ายภาพ',
        'ทัวร์ท่องเที่ยว',
        `ทัวร์${trip.country.name_th}`,
        'photography tour',
        'travel tour'
      ],
      openGraph: {
        title: trip.title,
        description: trip.description?.substring(0, 160) || `เที่ยว${trip.country.name_th} กับ Gography`,
        images: shareImage ? [
          {
            url: shareImage,
            width: 1200,
            height: 630,
            alt: trip.title,
          }
        ] : [],
        type: 'website',
        url: `${siteUrl}/trips/${id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: trip.title,
        description: trip.description?.substring(0, 160) || `เที่ยว${trip.country.name_th} กับ Gography`,
        images: shareImage ? [shareImage] : [],
      },
      alternates: {
        canonical: `${siteUrl}/trips/${id}`,
      },
    }
  } catch (error) {
    return {
      title: 'ทริป - Gography',
      description: 'ทัวร์ถ่ายภาพและท่องเที่ยว'
    }
  }
}

export default function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return <TripDetailsClient params={params} />;
}
