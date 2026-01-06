'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import type {
  GalleryImageWithRelations,
  Country,
  Trip,
} from '@/types/database.types'

interface GalleryEditFormProps {
  image: GalleryImageWithRelations
}

export default function GalleryEditForm({ image }: GalleryEditFormProps) {
  const router = useRouter()
  const [countries, setCountries] = useState<Country[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: image.title,
    description: image.description || '',
    alt_text: image.alt_text || '',
    country_id: image.country_id || '',
    trip_id: image.trip_id || '',
    is_highlight: image.is_highlight,
    order_index: image.order_index,
    is_active: image.is_active,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load countries
      const countriesRes = await fetch('/api/countries')
      const countriesData = await countriesRes.json()
      setCountries(countriesData.countries || [])

      // Load trips (for optional linking)
      const tripsRes = await fetch('/api/trips?pageSize=1000')
      const tripsData = await tripsRes.json()
      setTrips(tripsData.trips || [])
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch(`/api/gallery/${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          country_id: formData.country_id || null,
          trip_id: formData.trip_id || null,
          description: formData.description || null,
          alt_text: formData.alt_text || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด')
        return
      }

      router.push('/admin/gallery')
      router.refresh()
    } catch (err) {
      console.error('Error updating image:', err)
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Image Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.preview}
        </label>
        <div className="relative w-64 h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={image.storage_url}
            alt={image.alt_text || image.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.imageTitle} *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="ชื่อรูปภาพ"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.description}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
          placeholder="คำอธิบายรูปภาพ"
        />
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.altText}
        </label>
        <input
          type="text"
          value={formData.alt_text}
          onChange={(e) =>
            setFormData({ ...formData, alt_text: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="ข้อความสำหรับผู้พิการทางสายตา"
        />
      </div>

      {/* Country & Trip Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {THAI_LABELS.country}
          </label>
          <select
            value={formData.country_id}
            onChange={(e) =>
              setFormData({ ...formData, country_id: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
          >
            <option value="">เลือกประเทศ</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.flag_emoji} {country.name_th}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {THAI_LABELS.linkedTrip} (ถ้ามี)
          </label>
          <select
            value={formData.trip_id}
            onChange={(e) =>
              setFormData({ ...formData, trip_id: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
          >
            <option value="">ไม่เชื่อมโยงกับทริป</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Order Index */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.orderIndex}
        </label>
        <input
          type="number"
          value={formData.order_index ?? 0}
          onChange={(e) =>
            setFormData({ ...formData, order_index: parseInt(e.target.value) })
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="0"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          ค่าที่น้อยกว่าจะแสดงก่อน (0 = แสดงก่อนสุด)
        </p>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_highlight"
            checked={formData.is_highlight ?? false}
            onChange={(e) =>
              setFormData({ ...formData, is_highlight: e.target.checked })
            }
            className="w-4 h-4 text-orange-600 dark:text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700"
          />
          <label
            htmlFor="is_highlight"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            ⭐ {THAI_LABELS.setAsHighlight}
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active ?? true}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="w-4 h-4 text-orange-600 dark:text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700"
          />
          <label
            htmlFor="is_active"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {THAI_LABELS.active}
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer px-6 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? THAI_LABELS.loading : THAI_LABELS.save}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
        >
          {THAI_LABELS.cancel}
        </button>
      </div>
    </form>
  )
}
