'use client'

import { useState } from 'react'

interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: { activity_time: string | null; activity_description: string }) => Promise<void>
  dayTitle: string
}

export default function AddActivityModal({ isOpen, onClose, onAdd, dayTitle }: AddActivityModalProps) {
  const [activityTime, setActivityTime] = useState('')
  const [activityDescription, setActivityDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!activityDescription.trim()) {
      setError('กรุณากรอกรายละเอียดกิจกรรม')
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd({
        activity_time: activityTime.trim() || null,
        activity_description: activityDescription.trim(),
      })
      // Reset form
      setActivityTime('')
      setActivityDescription('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setActivityTime('')
    setActivityDescription('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">เพิ่มกิจกรรม</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{dayTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              เวลา
              <span className="text-gray-400 dark:text-gray-500 font-normal ml-2">(ไม่ระบุก็ได้)</span>
            </label>
            <input
              type="time"
              value={activityTime}
              onChange={(e) => setActivityTime(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              disabled={isSubmitting}
              placeholder="เช่น 09:00"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              💡 เวลาที่แสดงในกำหนดการ เช่น 09:00, 14:30
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              รายละเอียดกิจกรรม <span className="text-red-500">*</span>
            </label>
            <textarea
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              placeholder="เช่น เดินทางจากกรุงเทพฯ สู่สนามบินสุวรรณภูมิ"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              💡 อธิบายกิจกรรมในช่วงเวลานั้น ๆ ให้ชัดเจน
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มกิจกรรม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
