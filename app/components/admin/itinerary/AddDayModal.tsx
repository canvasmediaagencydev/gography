'use client'

import { useState } from 'react'

interface AddDayModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: { day_number: number; day_title: string; day_description: string }) => Promise<void>
  existingDayNumbers: number[]
}

export default function AddDayModal({ isOpen, onClose, onAdd, existingDayNumbers }: AddDayModalProps) {
  const [dayNumber, setDayNumber] = useState(0)
  const [dayTitle, setDayTitle] = useState('')
  const [dayDescription, setDayDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (existingDayNumbers.includes(dayNumber)) {
      setError(`วันที่ ${dayNumber} มีอยู่แล้ว`)
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd({ day_number: dayNumber, day_title: dayTitle, day_description: dayDescription })
      // Reset form
      setDayNumber(0)
      setDayTitle('')
      setDayDescription('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setDayNumber(0)
    setDayTitle('')
    setDayDescription('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">เพิ่มวันเดินทาง</h2>
          <button
            onClick={handleClose}
            className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
              min="0"
              value={dayNumber}
              onChange={(e) => setDayNumber(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ระบุเป็นตัวเลข เช่น 0, 1, 2, 3</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ชื่อวัน <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={dayTitle}
              onChange={(e) => setDayTitle(e.target.value)}
              placeholder="เช่น Bangkok → Oslo → Bodø → Leknes"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              required
              minLength={3}
              maxLength={255}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              รายละเอียด
            </label>
            <textarea
              value={dayDescription}
              onChange={(e) => setDayDescription(e.target.value)}
              placeholder="รายละเอียดเพิ่มเติมของวันนี้"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มวัน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
