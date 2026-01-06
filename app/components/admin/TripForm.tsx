'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import { uploadWithProgress } from '@/lib/upload-helpers'
import ProgressBar from '@/app/components/admin/ProgressBar'
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
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>(trip?.cover_image_url || '')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('รองรับเฉพาะไฟล์ JPG, PNG, WebP เท่านั้น')
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB')
        return
      }

      setCoverImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const uploadCoverImage = async (): Promise<string> => {
    if (!coverImageFile) {
      return formData.cover_image_url
    }

    setIsUploading(true)
    setUploadProgress(0)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', coverImageFile)

      const data = await uploadWithProgress(
        '/api/trips/upload-cover',
        uploadFormData,
        (progress) => {
          setUploadProgress(progress)
        }
      )

      return data.cover_image_url
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
      setUploadProgress(0)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Upload cover image first if a new file is selected
      let coverImageUrl = formData.cover_image_url
      if (coverImageFile) {
        coverImageUrl = await uploadCoverImage()
      }

      const url = mode === 'create' ? '/api/trips' : `/api/trips/${trip?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cover_image_url: coverImageUrl,
        }),
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
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="p-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <ProgressBar
            progress={uploadProgress}
            message="กำลังอัปโหลดรูปปก..."
            showPercentage={true}
          />
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.tripTitle} *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="ชื่อทริป"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.description}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
          placeholder="รายละเอียดทริป"
        />
      </div>

      {/* Country & Trip Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {THAI_LABELS.country} *
          </label>
          <select
            required
            value={formData.country_id}
            onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
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
            {THAI_LABELS.tripType} *
          </label>
          <select
            required
            value={formData.trip_type}
            onChange={(e) => setFormData({ ...formData, trip_type: e.target.value as 'group' | 'private' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
          >
            <option value="group">{THAI_LABELS.groupTour}</option>
            <option value="private">{THAI_LABELS.privateTour}</option>
          </select>
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.price} (บาท) *
        </label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.price_per_person}
          onChange={(e) => setFormData({ ...formData, price_per_person: parseFloat(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="165900"
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.coverImage}
        </label>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 dark:file:bg-orange-900/30 file:text-orange-700 dark:file:text-orange-400 hover:file:bg-orange-100 dark:hover:file:bg-orange-900/50"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          รองรับไฟล์ JPG, PNG, WebP (สูงสุด 5MB)
        </p>
        {coverImagePreview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ตัวอย่างรูปภาพ:</p>
            <div className="relative w-full max-w-md">
              <img
                src={coverImagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImageFile(null)
                  setCoverImagePreview('')
                  if (mode === 'edit') {
                    setCoverImagePreview(trip?.cover_image_url || '')
                  }
                }}
                className="cursor-pointer absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* File Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {THAI_LABELS.documentLink} (URL)
        </label>
        <input
          type="url"
          value={formData.file_link}
          onChange={(e) => setFormData({ ...formData, file_link: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
          className="w-4 h-4 text-orange-600 dark:text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {THAI_LABELS.active}
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="cursor-pointer px-6 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading
            ? 'กำลังอัปโหลดรูปภาพ...'
            : isLoading
            ? THAI_LABELS.loading
            : THAI_LABELS.save}
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
