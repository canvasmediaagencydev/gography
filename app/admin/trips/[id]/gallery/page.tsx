'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import GalleryUploadForm from '@/app/components/admin/GalleryUploadForm'
import type { TripWithRelations, GalleryImageWithRelations } from '@/types/database.types'

export default function TripGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [trip, setTrip] = useState<TripWithRelations | null>(null)
  const [images, setImages] = useState<GalleryImageWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)

  useEffect(() => {
    loadTrip()
    loadGalleryImages()
  }, [id])

  const loadTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${id}`)
      const data = await res.json()
      setTrip(data.trip)
    } catch (error) {
      console.error('Error loading trip:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadGalleryImages = async () => {
    try {
      const res = await fetch(`/api/gallery?trip_id=${id}&pageSize=1000`)
      const data = await res.json()
      setImages(data.images || [])
    } catch (error) {
      console.error('Error loading gallery images:', error)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('ต้องการลบรูปภาพนี้หรือไม่?')) return

    try {
      const res = await fetch(`/api/gallery/${imageId}`, { method: 'DELETE' })
      if (res.ok) {
        loadGalleryImages()
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleToggleActive = async (imageId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/gallery/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      })
      if (res.ok) {
        loadGalleryImages()
      }
    } catch (error) {
      console.error('Error toggling image status:', error)
    }
  }

  const handleToggleHighlight = async (imageId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/gallery/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_highlight: !currentStatus }),
      })
      if (res.ok) {
        loadGalleryImages()
      }
    } catch (error) {
      console.error('Error toggling highlight status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{THAI_LABELS.loading}</p>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่พบทริปนี้</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการรูปภาพทริป</h1>
          <p className="text-gray-600 mt-1">{trip.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>{showUploadForm ? '✕' : '➕'}</span>
            <span>{showUploadForm ? 'ปิดฟอร์ม' : 'อัพโหลดรูปภาพ'}</span>
          </button>
          <Link
            href={`/admin/trips/${id}`}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            ← กลับ
          </Link>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">อัพโหลดรูปภาพใหม่</h2>
          <GalleryUploadForm tripId={id} />
        </div>
      )}

      {/* Gallery Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="font-semibold text-blue-900">รูปภาพทั้งหมด:</span>{' '}
            <span className="text-blue-700">{images.length} รูป</span>
          </div>
          <div>
            <span className="font-semibold text-blue-900">Active:</span>{' '}
            <span className="text-blue-700">{images.filter((img) => img.is_active).length} รูป</span>
          </div>
          <div>
            <span className="font-semibold text-blue-900">Highlight:</span>{' '}
            <span className="text-blue-700">{images.filter((img) => img.is_highlight).length} รูป</span>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">รูปภาพในทริป</h2>

        {images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-lg">ยังไม่มีรูปภาพในทริปนี้</p>
            <p className="text-sm mt-2">คลิกปุ่ม "อัพโหลดรูปภาพ" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={image.storage_url}
                    alt={image.alt_text || image.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {image.is_highlight && (
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
                        ⭐ Highlight
                      </span>
                    )}
                    {!image.is_active && (
                      <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
                    {image.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{image.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/gallery/edit/${image.id}`}
                      className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded text-center transition-colors"
                    >
                      ✏️ แก้ไข
                    </Link>
                    <button
                      onClick={() => handleToggleActive(image.id, image.is_active ?? true)}
                      className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                        image.is_active
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {image.is_active ? '👁️ ซ่อน' : '👁️ แสดง'}
                    </button>
                    <button
                      onClick={() => handleToggleHighlight(image.id, image.is_highlight ?? false)}
                      className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                        image.is_highlight
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                      }`}
                    >
                      {image.is_highlight ? '⭐' : '☆'}
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Meta Info */}
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Order: {image.order_index} • {Math.round((image.file_size || 0) / 1024)} KB
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
