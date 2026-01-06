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
        <p className="text-gray-500 dark:text-gray-400">{THAI_LABELS.loading}</p>
      </div>
    )
  }

  if (!image) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">ไม่พบรูปภาพ</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {THAI_LABELS.editImage}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">แก้ไขข้อมูลรูปภาพ</p>
        </div>
        <button
          onClick={() => router.back()}
          className="cursor-pointer px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
        >
          {THAI_LABELS.back}
        </button>
      </div>

      {/* Edit Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <GalleryEditForm image={image} />
      </div>
    </div>
  )
}
