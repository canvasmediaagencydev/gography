'use client'

import { useState } from 'react'
import ProgressBar from '@/app/components/admin/ProgressBar'

interface AddFaqModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (
    data: { question: string; answer: string; order_index: number; images?: { file: File; caption: string }[] },
    onProgress?: (progress: number, message: string) => void
  ) => Promise<void>
  tripId: string
}

export default function AddFaqModal({ isOpen, onClose, onAdd, tripId }: AddFaqModalProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [orderIndex, setOrderIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageCaptions, setImageCaptions] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState('')

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Validate files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(f => !allowedTypes.includes(f.type))
    if (invalidFiles.length > 0) {
      setError('รองรับเฉพาะไฟล์ JPG, PNG, WebP เท่านั้น')
      return
    }

    const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError('ขนาดไฟล์ต้องไม่เกิน 5MB ต่อไฟล์')
      return
    }

    setImageFiles(prev => [...prev, ...files])
    setImageCaptions(prev => [...prev, ...files.map(() => '')])

    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    setError('')
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setImageCaptions(prev => prev.filter((_, i) => i !== index))
  }

  const updateCaption = (index: number, caption: string) => {
    setImageCaptions(prev => {
      const updated = [...prev]
      updated[index] = caption
      return updated
    })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (question.length < 10) {
      setError('คำถามต้องมีอย่างน้อย 10 ตัวอักษร')
      return
    }

    if (answer.length < 10) {
      setError('คำตอบต้องมีอย่างน้อย 10 ตัวอักษร')
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)
    setUploadMessage('')

    try {
      // Prepare images data
      const images = imageFiles.map((file, idx) => ({
        file,
        caption: imageCaptions[idx] || ''
      }))

      // Create FAQ with images
      const faqData = {
        question,
        answer,
        order_index: orderIndex,
        images: images.length > 0 ? images : undefined
      }

      await onAdd(faqData, (progress, message) => {
        setUploadProgress(progress)
        setUploadMessage(message)
      })

      // Reset form
      setQuestion('')
      setAnswer('')
      setOrderIndex(0)
      setImageFiles([])
      setImagePreviews([])
      setImageCaptions([])
      setUploadProgress(0)
      setUploadMessage('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด')
      setUploadProgress(0)
      setUploadMessage('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setQuestion('')
    setAnswer('')
    setOrderIndex(0)
    setImageFiles([])
    setImagePreviews([])
    setImageCaptions([])
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">เพิ่ม FAQ</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Upload Progress */}
        {isSubmitting && uploadProgress > 0 && (
          <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <ProgressBar
              progress={uploadProgress}
              message={uploadMessage}
              showPercentage={true}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              คำถาม <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="เช่น วีซ่าต้องใช้เวลานานแค่ไหน?"
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{question.length}/500 ตัวอักษร</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              คำตอบ <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
              placeholder="คำตอบของคำถามนี้..."
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{answer.length} ตัวอักษร</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              รูปภาพประกอบ (ไม่บังคับ)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">รองรับไฟล์ JPG, PNG, WebP (สูงสุด 5MB ต่อไฟล์)</p>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                ตัวอย่างรูปภาพ ({imagePreviews.length})
              </label>
              <div className="grid grid-cols-2 gap-3">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full shadow-lg"
                      disabled={isSubmitting}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <input
                        type="text"
                        placeholder="คำบรรยายรูป (ไม่บังคับ)"
                        value={imageCaptions[idx]}
                        onChange={(e) => updateCaption(idx, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ลำดับการแสดงผล
            </label>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่ม FAQ'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
