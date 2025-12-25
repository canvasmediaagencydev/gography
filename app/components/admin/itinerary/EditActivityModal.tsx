'use client'

import { useState, useEffect } from 'react'

interface Activity {
  id: string
  activity_time: string | null
  activity_description: string
}

interface EditActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (activityId: string, data: { activity_time: string | null; activity_description: string }) => Promise<void>
  activity: Activity | null
  dayTitle: string
}

export default function EditActivityModal({ isOpen, onClose, onUpdate, activity, dayTitle }: EditActivityModalProps) {
  const [activityTime, setActivityTime] = useState('')
  const [activityDescription, setActivityDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill form when activity changes
  useEffect(() => {
    if (activity) {
      setActivityTime(activity.activity_time || '')
      setActivityDescription(activity.activity_description)
      setError('')
    }
  }, [activity])

  if (!isOpen || !activity) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (activityDescription.length < 3) {
      setError('รายละเอียดกิจกรรมต้องมีอย่างน้อย 3 ตัวอักษร')
      return
    }

    setIsSubmitting(true)
    try {
      await onUpdate(activity.id, {
        activity_time: activityTime || null,
        activity_description: activityDescription,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">แก้ไขกิจกรรม</h2>
            <p className="text-sm text-gray-600 mt-1">{dayTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              เวลา (ไม่บังคับ)
            </label>
            <input
              type="text"
              value={activityTime}
              onChange={(e) => setActivityTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="เช่น 09:00, เช้า, บ่าย"
              disabled={isSubmitting}
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">ระบุเวลาหรือช่วงเวลาของกิจกรรม</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              รายละเอียดกิจกรรม <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="อธิบายกิจกรรมในช่วงเวลานี้..."
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">{activityDescription.length} ตัวอักษร</p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
