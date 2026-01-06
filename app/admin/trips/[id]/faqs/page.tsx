'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import type { TripFAQWithImages, TripFAQImage } from '@/types/database.types'
import AddFaqModal from '@/app/components/admin/faqs/AddFaqModal'
import EditFaqModal from '@/app/components/admin/faqs/EditFaqModal'

export default function TripFaqsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params)
  const [trip, setTrip] = useState<any>(null)
  const [faqs, setFaqs] = useState<TripFAQWithImages[]>([])
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<{ id: string; question: string; answer: string; order_index: number } | null>(null)

  useEffect(() => {
    loadTrip()
    loadFaqs()
  }, [tripId])

  const loadTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`)
      const data = await res.json()
      setTrip(data.trip)
    } catch (error) {
      console.error('Error loading trip:', error)
    }
  }

  const loadFaqs = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/faqs`)
      const data = await res.json()
      setFaqs(data.faqs || [])
    } catch (error) {
      console.error('Error loading FAQs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFaq = async (
    data: { question: string; answer: string; order_index: number; images?: { file: File; caption: string }[] },
    onProgress?: (progress: number, message: string) => void
  ) => {
    // Create FAQ first
    onProgress?.(10, 'กำลังสร้าง FAQ...')
    const res = await fetch(`/api/trips/${tripId}/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: data.question, answer: data.answer, order_index: data.order_index }),
    })

    if (!res.ok) throw new Error('Failed to add FAQ')

    const result = await res.json()
    const faqId = result.faq?.id

    // Upload images if any
    if (faqId && data.images && data.images.length > 0) {
      const totalImages = data.images.length

      for (let i = 0; i < totalImages; i++) {
        const { file, caption } = data.images[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', caption || '')
        formData.append('order_index', i.toString())

        // Calculate progress (10% for FAQ creation, 90% for image uploads)
        const baseProgress = 10
        const uploadProgress = ((i + 1) / totalImages) * 90
        const totalProgress = baseProgress + uploadProgress

        onProgress?.(totalProgress, `กำลังอัปโหลดรูปภาพ ${i + 1}/${totalImages}...`)

        const uploadRes = await fetch(`/api/faqs/${faqId}/images/upload`, {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          console.error('Failed to upload image:', i + 1)
        }
      }
    }

    onProgress?.(100, 'เสร็จสิ้น!')
    await loadFaqs()
  }

  const handleUpdateFaq = async (faqId: string, data: { question: string; answer: string; order_index: number }) => {
    const res = await fetch(`/api/trips/${tripId}/faqs/${faqId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Failed to update FAQ')

    await loadFaqs()
  }

  const handleDeleteFaq = async (faqId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบ FAQ นี้? รูปภาพทั้งหมดจะถูกลบด้วย')) return

    try {
      const res = await fetch(`/api/trips/${tripId}/faqs/${faqId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadFaqs()
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
    }
  }

  const handleOpenEditModal = (faq: TripFAQWithImages) => {
    setSelectedFaq({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index ?? 0,
    })
    setShowEditModal(true)
  }

  const handleUploadImage = async (faqId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const caption = prompt('คำบรรยายรูป (ไม่ระบุก็ได้):')
    if (caption) formData.append('caption', caption)

    const alt_text = prompt('Alt text สำหรับ accessibility (ไม่ระบุก็ได้):')
    if (alt_text) formData.append('alt_text', alt_text)

    try {
      const res = await fetch(`/api/faqs/${faqId}/images/upload`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        await loadFaqs()
      } else {
        const data = await res.json()
        alert(data.error || 'เกิดข้อผิดพลาดในการอัปโหลด')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('เกิดข้อผิดพลาดในการอัปโหลด')
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?')) return

    try {
      const res = await fetch(`/api/faqs/images/${imageId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadFaqs()
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const toggleFaq = (faqId: string) => {
    const newExpanded = new Set(expandedFaqs)
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId)
    } else {
      newExpanded.add(faqId)
    }
    setExpandedFaqs(newExpanded)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">จัดการ FAQ (คำถามที่พบบ่อย)</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{trip?.title}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>เพิ่ม FAQ</span>
          </button>
          <Link
            href={`/admin/trips/${tripId}`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold"
          >
            กลับ
          </Link>
        </div>
      </div>

      {/* FAQs List */}
      {faqs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">ยังไม่มี FAQ</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          >
            เริ่มเพิ่ม FAQ แรก
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              {/* FAQ Header */}
              <div
                onClick={() => toggleFaq(faq.id)}
                className="flex items-start gap-4 p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-xl"
              >
                <div className="shrink-0 w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{faq.question}</h3>

                  {/* Summary badges */}
                  <div className="flex flex-wrap gap-2">
                    {faq.images && faq.images.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        {faq.images.length} รูปภาพ
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenEditModal(faq)
                    }}
                    className="cursor-pointer px-3 py-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-semibold text-sm rounded-lg transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFaq(faq.id)
                    }}
                    className="cursor-pointer px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-semibold text-sm rounded-lg transition-colors"
                  >
                    ลบ
                  </button>
                  <svg
                    className={`w-6 h-6 text-gray-400 dark:text-gray-500 transition-transform ${expandedFaqs.has(faq.id) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* FAQ Content (Expanded) */}
              {expandedFaqs.has(faq.id) && (
                <div className="border-t-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  {/* Answer */}
                  <div className="px-5 pt-4 pb-2">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">คำตอบ:</h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Images Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          รูปภาพประกอบคำตอบ
                        </h4>
                        <label className="flex items-center gap-1 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          อัปโหลดรูปภาพ
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => handleUploadImage(faq.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {faq.images && faq.images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {faq.images.map((img: TripFAQImage) => (
                            <div key={img.id} className="relative group">
                              <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-colors">
                                <img
                                  src={img.storage_url}
                                  alt={img.alt_text || img.caption || 'FAQ image'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              {img.caption && (
                                <p className="text-xs text-gray-700 dark:text-gray-300 mt-2 font-medium truncate px-1">{img.caption}</p>
                              )}
                              <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="cursor-pointer absolute top-2 right-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                ลบ
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ยังไม่มีรูปภาพ</p>
                          <label className="mt-2 inline-block text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold cursor-pointer">
                            + อัปโหลดรูปภาพแรก
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={(e) => handleUploadImage(faq.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add FAQ Modal */}
      <AddFaqModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddFaq}
        tripId={tripId}
      />

      {/* Edit FAQ Modal */}
      <EditFaqModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedFaq(null)
        }}
        onUpdate={handleUpdateFaq}
        faq={selectedFaq}
      />
    </div>
  )
}
