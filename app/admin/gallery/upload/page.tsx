'use client'

import { useRouter } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import GalleryUploadForm from '@/app/components/admin/GalleryUploadForm'

export default function GalleryUploadPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {THAI_LABELS.uploadImages}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">อัปโหลดรูปภาพใหม่เข้าแกลเลอรี</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
        >
          {THAI_LABELS.back}
        </button>
      </div>

      {/* Upload Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <GalleryUploadForm />
      </div>
    </div>
  )
}
