'use client'

import { useState, useEffect } from 'react'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { TripSchedule } from '@/types/database.types'

interface EditScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (scheduleId: string, data: {
    departure_date: string
    return_date: string
    registration_deadline: string | null
    total_seats: number
    available_seats: number
    is_active: boolean
  }) => Promise<void>
  schedule: TripSchedule | null
}

export default function EditScheduleModal({ isOpen, onClose, onUpdate, schedule }: EditScheduleModalProps) {
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [registrationDeadline, setRegistrationDeadline] = useState('')
  const [totalSeats, setTotalSeats] = useState(10)
  const [availableSeats, setAvailableSeats] = useState<number | ''>('')
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill form when schedule changes
  useEffect(() => {
    if (schedule) {
      setDepartureDate(schedule.departure_date)
      setReturnDate(schedule.return_date)
      setRegistrationDeadline(schedule.registration_deadline ?? '')
      setTotalSeats(schedule.total_seats)
      // Show available_seats if it's different from total_seats, otherwise leave empty
      setAvailableSeats(schedule.available_seats !== schedule.total_seats ? schedule.available_seats : '')
      setIsActive(Boolean(schedule.is_active))
      setError('')
    }
  }, [schedule])

  if (!isOpen || !schedule) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate dates
    const depDate = new Date(departureDate)
    const retDate = new Date(returnDate)

    if (retDate < depDate) {
      setError('วันที่กลับต้องไม่น้อยกว่าวันที่เดินทาง')
      return
    }

    if (registrationDeadline) {
      const regDate = new Date(registrationDeadline)
      if (regDate > depDate) {
        setError('วันปิดรับสมัครต้องไม่เกินวันที่เดินทาง')
        return
      }
    }

    // Use total_seats as default if available_seats is not specified
    const finalAvailableSeats = availableSeats === '' ? totalSeats : Number(availableSeats)

    if (finalAvailableSeats > totalSeats) {
      setError('ที่นั่งว่างต้องไม่เกินจำนวนที่นั่งทั้งหมด')
      return
    }

    setIsSubmitting(true)
    try {
      await onUpdate(schedule.id, {
        departure_date: departureDate,
        return_date: returnDate,
        registration_deadline: registrationDeadline || null,
        total_seats: totalSeats,
        available_seats: finalAvailableSeats,
        is_active: isActive,
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">แก้ไขรอบเดินทาง</h2>
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
          {/* Dates Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {THAI_LABELS.departureDate} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {THAI_LABELS.returnDate} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {THAI_LABELS.registrationDeadline}
              </label>
              <input
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Seats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {THAI_LABELS.totalSeats} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={totalSeats}
                onChange={(e) => {
                  const total = parseInt(e.target.value) || 1
                  setTotalSeats(total)
                  if (availableSeats === '') {
                    setAvailableSeats('')
                  } else {
                    setAvailableSeats(Math.min(availableSeats, total))
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {THAI_LABELS.availableSeats}
              </label>
              <input
                type="number"
                min="0"
                max={totalSeats}
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder={`ค่าเริ่มต้น: ${totalSeats}`}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active_edit"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-orange-600 dark:text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700"
              disabled={isSubmitting}
            />
            <label htmlFor="is_active_edit" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {THAI_LABELS.active}
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? THAI_LABELS.loading : 'บันทึกการแก้ไข'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
            >
              {THAI_LABELS.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
