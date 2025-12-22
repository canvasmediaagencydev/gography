'use client'

import { useEffect, useState, use } from 'react'
import TripForm from '@/app/components/admin/TripForm'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { Trip } from '@/types/database.types'

export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTrip()
  }, [id])

  const loadTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${id}`)
      const data = await res.json()
      setTrip(data.trip)
    } catch (error) {
      console.error('Error loading trip:', error)
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

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่พบทริปนี้</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {THAI_LABELS.edit}{THAI_LABELS.tripTitle}
        </h1>
        <p className="text-gray-600 mt-1">แก้ไขข้อมูลทริป: {trip.title}</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <TripForm trip={trip} mode="edit" />
      </div>
    </div>
  )
}
