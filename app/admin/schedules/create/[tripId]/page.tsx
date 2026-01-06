'use client'

import { useState, useEffect, FormEvent, use } from 'react'
import { useRouter } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { Trip } from '@/types/database.types'

export default function CreateSchedulePage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params)
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    departure_date: '',
    return_date: '',
    registration_deadline: '',
    total_seats: 10,
    available_seats: '' as number | '',
    is_active: true,
  })

  useEffect(() => {
    loadTrip()
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Use total_seats as default if available_seats is not specified
      const finalAvailableSeats = formData.available_seats === '' ? formData.total_seats : formData.available_seats

      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          available_seats: finalAvailableSeats,
          trip_id: tripId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด')
        return
      }

      router.push(`/admin/trips/${tripId}`)
      router.refresh()
    } catch (err) {
      console.error('Error creating schedule:', err)
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{THAI_LABELS.addSchedule}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          เพิ่มรอบเดินทางสำหรับ: {trip?.title}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Dates Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {THAI_LABELS.departureDate} *
            </label>
            <input
              type="date"
              required
              value={formData.departure_date}
              onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {THAI_LABELS.returnDate} *
            </label>
            <input
              type="date"
              required
              value={formData.return_date}
              onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {THAI_LABELS.registrationDeadline}
            </label>
            <input
              type="date"
              value={formData.registration_deadline}
              onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
            />
          </div>
        </div>

        {/* Seats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {THAI_LABELS.totalSeats} *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.total_seats}
              onChange={(e) => {
                const total = parseInt(e.target.value)
                const currentAvailable = formData.available_seats
                setFormData({
                  ...formData,
                  total_seats: total,
                  available_seats: currentAvailable !== '' ? Math.min(Number(currentAvailable), total) : '',
                })
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {THAI_LABELS.availableSeats}
            </label>
            <input
              type="number"
              min="0"
              max={formData.total_seats}
              value={formData.available_seats}
              onChange={(e) => setFormData({ ...formData, available_seats: e.target.value === '' ? '' : parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder={`ค่าเริ่มต้น: ${formData.total_seats}`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ถ้าไม่ระบุ จะแสดงเป็น -</p>
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 text-orange-600 dark:text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {THAI_LABELS.active}
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? THAI_LABELS.loading : THAI_LABELS.save}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
          >
            {THAI_LABELS.cancel}
          </button>
        </div>
      </form>
    </div>
  )
}
