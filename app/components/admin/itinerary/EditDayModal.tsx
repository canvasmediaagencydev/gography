'use client'

import { useState, useEffect } from 'react'

interface Day {
  id: string
  day_number: number
  day_title: string
  day_description: string | null
}

interface EditDayModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (dayId: string, data: { day_number: number; day_title: string; day_description: string | null }) => Promise<void>
  day: Day | null
  existingDayNumbers: number[]
}

export default function EditDayModal({ isOpen, onClose, onUpdate, day, existingDayNumbers }: EditDayModalProps) {
  const [dayNumber, setDayNumber] = useState(1)
  const [dayTitle, setDayTitle] = useState('')
  const [dayDescription, setDayDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill form when day changes
  useEffect(() => {
    if (day) {
      setDayNumber(day.day_number)
      setDayTitle(day.day_title)
      setDayDescription(day.day_description || '')
      setError('')
    }
  }, [day])

  if (!isOpen || !day) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (dayTitle.length < 3) {
      setError('ชื่อวันต้องมีอย่างน้อย 3 ตัวอักษร')
      return
    }

    // Check if day number is already used by another day
    if (dayNumber !== day.day_number && existingDayNumbers.includes(dayNumber)) {
      setError(`วันที่ ${dayNumber} มีอยู่แล้ว กรุณาเลือกหมายเลขอื่น`)
      return
    }

    setIsSubmitting(true)
    try {
      await onUpdate(day.id, {
        day_number: dayNumber,
        day_title: dayTitle,
        day_description: dayDescription || null,
      })
      onClose()
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">แก้ไขวันเดินทาง</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              วันที่ <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              value={dayNumber}
              onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ชื่อวัน <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={dayTitle}
              onChange={(e) => setDayTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="เช่น กรุงเทพ - ชลบุรี"
              disabled={isSubmitting}
              maxLength={255}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{dayTitle.length}/255 ตัวอักษร</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              รายละเอียด
            </label>
            <textarea
              value={dayDescription}
              onChange={(e) => setDayDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
              placeholder="รายละเอียดของวันเดินทาง..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
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
