'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { Trip, Country } from '@/types/database.types'

interface TripFormProps {
  trip?: Trip
  mode: 'create' | 'edit'
}

export default function TripForm({ trip, mode }: TripFormProps) {
  const router = useRouter()
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: trip?.title || '',
    description: trip?.description || '',
    country_id: trip?.country_id || '',
    price_per_person: trip?.price_per_person || 0,
    cover_image_url: trip?.cover_image_url || '',
    file_link: trip?.file_link || '',
    trip_type: trip?.trip_type || 'group',
    is_active: trip?.is_active ?? true,
  })

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      const res = await fetch('/api/countries')
      const data = await res.json()
      setCountries(data.countries || [])
    } catch (error) {
      console.error('Error loading countries:', error)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const url = mode === 'create' ? '/api/trips' : `/api/trips/${trip?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด')
        return
      }

      router.push('/admin/trips')
      router.refresh()
    } catch (err) {
      console.error('Error saving trip:', err)
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {THAI_LABELS.tripTitle} *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="ชื่อทริป"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {THAI_LABELS.description}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="รายละเอียดทริป"
        />
      </div>

      {/* Country & Trip Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {THAI_LABELS.country} *
          </label>
          <select
            required
            value={formData.country_id}
            onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {THAI_LABELS.tripType} *
          </label>
          <select
            required
            value={formData.trip_type}
            onChange={(e) => setFormData({ ...formData, trip_type: e.target.value as 'group' | 'private' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="group">{THAI_LABELS.groupTour}</option>
            <option value="private">{THAI_LABELS.privateTour}</option>
          </select>
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {THAI_LABELS.price} (บาท) *
        </label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.price_per_person}
          onChange={(e) => setFormData({ ...formData, price_per_person: parseFloat(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="165900"
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {THAI_LABELS.coverImage} (URL)
        </label>
        <input
          type="url"
          value={formData.cover_image_url}
          onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* File Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {THAI_LABELS.documentLink} (URL)
        </label>
        <input
          type="url"
          value={formData.file_link}
          onChange={(e) => setFormData({ ...formData, file_link: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="https://drive.google.com/..."
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          {THAI_LABELS.active}
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? THAI_LABELS.loading : THAI_LABELS.save}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          {THAI_LABELS.cancel}
        </button>
      </div>
    </form>
  )
}
