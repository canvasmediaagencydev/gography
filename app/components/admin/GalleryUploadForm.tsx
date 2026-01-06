'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import { uploadWithProgress } from '@/lib/upload-helpers'
import ProgressBar from '@/app/components/admin/ProgressBar'
import type { Country, Trip } from '@/types/database.types'

interface UploadedFile {
  file: File
  preview: string
  title: string
  description: string
  alt_text: string
  country_id: string
  trip_id: string
  is_highlight: boolean
}

interface GalleryUploadFormProps {
  tripId?: string
}

export default function GalleryUploadForm({ tripId }: GalleryUploadFormProps) {
  const router = useRouter()
  const [countries, setCountries] = useState<Country[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [uploadMessage, setUploadMessage] = useState('')

  useEffect(() => {
    loadCountries()
    loadTrips()
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

  const loadTrips = async () => {
    try {
      const res = await fetch('/api/trips?pageSize=1000')
      const data = await res.json()
      setTrips(data.trips || [])
    } catch (error) {
      console.error('Error loading trips:', error)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError(`ไฟล์ ${file.name} ไม่ใช่รูปภาพที่รองรับ`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`ไฟล์ ${file.name} มีขนาดเกิน 5MB`)
        return false
      }
      return true
    })

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.split('.')[0],
      description: '',
      alt_text: '',
      country_id: '',
      trip_id: tripId || '',
      is_highlight: false,
    }))

    setFiles((prev) => [...prev, ...uploadedFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const updateFile = (index: number, field: keyof UploadedFile, value: any) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      newFiles[index] = { ...newFiles[index], [field]: value }
      return newFiles
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('กรุณาเลือกไฟล์อย่างน้อย 1 ไฟล์')
      return
    }

    setIsUploading(true)
    setError('')
    setUploadProgress(0)
    setCurrentFileIndex(0)

    try {
      const totalFiles = files.length

      // Upload each file
      for (let i = 0; i < totalFiles; i++) {
        const uploadFile = files[i]
        setCurrentFileIndex(i + 1)
        setUploadMessage(`กำลังอัปโหลด ${uploadFile.title} (${i + 1}/${totalFiles})`)

        // Step 1: Upload file to storage with progress tracking
        const formData = new FormData()
        formData.append('file', uploadFile.file)

        // Get country code for organized storage
        const country = countries.find((c) => c.id === uploadFile.country_id)
        if (country) {
          formData.append('country_code', country.code)
        }

        const uploadData = await uploadWithProgress(
          '/api/gallery/upload',
          formData,
          (progress) => {
            // Calculate overall progress
            const completedFiles = i
            const currentFileProgress = progress / 100
            const overallProgress = ((completedFiles + currentFileProgress) / totalFiles) * 100
            setUploadProgress(overallProgress)
          }
        )

        // Step 2: Create database record
        setUploadMessage(`กำลังบันทึกข้อมูล ${uploadFile.title} (${i + 1}/${totalFiles})`)

        const createRes = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storage_path: uploadData.storage_path,
            storage_url: uploadData.storage_url,
            file_name: uploadData.file_name,
            file_size: uploadData.file_size,
            mime_type: uploadData.mime_type,
            title: uploadFile.title,
            description: uploadFile.description || null,
            alt_text: uploadFile.alt_text || null,
            country_id: uploadFile.country_id || null,
            trip_id: uploadFile.trip_id || null,
            is_highlight: uploadFile.is_highlight,
            is_active: true,
          }),
        })

        if (!createRes.ok) {
          const errorData = await createRes.json()
          throw new Error(errorData.error || 'Failed to create record')
        }
      }

      // Success
      setUploadProgress(100)
      setUploadMessage('อัปโหลดสำเร็จ!')

      // Wait a bit to show completion
      await new Promise(resolve => setTimeout(resolve, 500))

      router.push('/admin/gallery')
      router.refresh()
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด')
      setUploadProgress(0)
      setUploadMessage('')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
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
            message={uploadMessage}
            showPercentage={true}
          />
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-orange-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500'
        }`}
      >
        <div className="space-y-4">
          <div className="text-6xl">📸</div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ลากไฟล์มาวางที่นี่
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              หรือคลิกเพื่อเลือกไฟล์ (JPG, PNG, WebP สูงสุด 5MB)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg cursor-pointer transition-colors"
          >
            {THAI_LABELS.selectFiles}
          </label>
        </div>
      </div>

      {/* File Previews & Metadata */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ไฟล์ที่เลือก ({files.length})
          </h3>

          {files.map((uploadFile, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex gap-4">
                {/* Preview */}
                <div className="shrink-0">
                  <img
                    src={uploadFile.preview}
                    alt={uploadFile.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Metadata Form */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {THAI_LABELS.imageTitle} *
                    </label>
                    <input
                      type="text"
                      value={uploadFile.title}
                      onChange={(e) =>
                        updateFile(index, 'title', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="ชื่อรูปภาพ"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {THAI_LABELS.country}
                    </label>
                    <select
                      value={uploadFile.country_id}
                      onChange={(e) =>
                        updateFile(index, 'country_id', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
                    >
                      <option value="">เลือกประเทศ</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.flag_emoji} {country.name_th}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Trip */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ทริป (ถ้ามี)
                    </label>
                    <select
                      value={uploadFile.trip_id}
                      onChange={(e) =>
                        updateFile(index, 'trip_id', e.target.value)
                      }
                      disabled={!!tripId}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    >
                      <option value="">ไม่เชื่อมกับทริป</option>
                      {trips.map((trip) => (
                        <option key={trip.id} value={trip.id}>
                          {trip.title}
                        </option>
                      ))}
                    </select>
                    {tripId && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        📌 กำลังอัพโหลดให้กับทริปนี้โดยอัตโนมัติ
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {THAI_LABELS.description}
                    </label>
                    <textarea
                      value={uploadFile.description}
                      onChange={(e) =>
                        updateFile(index, 'description', e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                      placeholder="คำอธิบายรูปภาพ"
                    />
                  </div>

                  {/* Alt Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {THAI_LABELS.altText}
                    </label>
                    <input
                      type="text"
                      value={uploadFile.alt_text}
                      onChange={(e) =>
                        updateFile(index, 'alt_text', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="ข้อความสำหรับผู้พิการทางสายตา"
                    />
                  </div>

                  {/* Highlight */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`highlight-${index}`}
                      checked={uploadFile.is_highlight}
                      onChange={(e) =>
                        updateFile(index, 'is_highlight', e.target.checked)
                      }
                      className="w-4 h-4 text-orange-600 dark:text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700"
                    />
                    <label
                      htmlFor={`highlight-${index}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      ⭐ {THAI_LABELS.setAsHighlight}
                    </label>
                  </div>
                </div>

                {/* Remove Button */}
                <div className="shrink-0">
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2"
                    title={THAI_LABELS.remove}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Buttons */}
      {files.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading
              ? `${THAI_LABELS.uploading}...`
              : `${THAI_LABELS.upload} (${files.length} ไฟล์)`}
          </button>
          <button
            onClick={() => router.back()}
            disabled={isUploading}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {THAI_LABELS.cancel}
          </button>
        </div>
      )}
    </div>
  )
}
