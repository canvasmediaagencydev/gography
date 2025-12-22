'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import GalleryEditForm from '@/app/components/admin/GalleryEditForm'
import type { GalleryImageWithRelations } from '@/types/database.types'

export default function GalleryEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [image, setImage] = useState<GalleryImageWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadImage()
  }, [id])

  const loadImage = async () => {
    try {
      const res = await fetch(`/api/gallery/${id}`)
      const data = await res.json()
      setImage(data.image)
    } catch (error) {
      console.error('Error loading image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{THAI_LABELS.loading}</p>
      </div>
    )
  }

  if (!image) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่พบรูปภาพ</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {THAI_LABELS.editImage}
          </h1>
          <p className="text-gray-600 mt-1">แก้ไขข้อมูลรูปภาพ</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          {THAI_LABELS.back}
        </button>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <GalleryEditForm image={image} />
      </div>
    </div>
  )
}
