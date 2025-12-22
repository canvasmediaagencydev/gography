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
          <h1 className="text-3xl font-bold text-gray-900">
            {THAI_LABELS.uploadImages}
          </h1>
          <p className="text-gray-600 mt-1">อัปโหลดรูปภาพใหม่เข้าแกลเลอรี</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          {THAI_LABELS.back}
        </button>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <GalleryUploadForm />
      </div>
    </div>
  )
}
