'use client'

import Link from 'next/link'
import { THAI_LABELS } from '@/lib/thai-labels'
import { formatPrice, formatDurationThai, calculateDuration } from '@/lib/migration-helpers'
import type { TripWithRelations } from '@/types/database.types'

interface TripTableProps {
  trips: TripWithRelations[]
  onDelete: (id: string) => void
  onToggleActive: (id: string, currentStatus: boolean) => void
}

export default function TripTable({ trips, onDelete, onToggleActive }: TripTableProps) {
  if (trips.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">{THAI_LABELS.noData}</p>
      </div>
    )
  }

  const getNextSchedule = (trip: TripWithRelations) => {
    if (!trip.trip_schedules || trip.trip_schedules.length === 0) return null

    const today = new Date().toISOString().split('T')[0]
    const upcoming = trip.trip_schedules
      .filter((s: any) => s.is_active && s.departure_date >= today)
      .sort((a: any, b: any) => a.departure_date.localeCompare(b.departure_date))

    return upcoming[0] || null
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.tripName}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.country}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.price}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.nextSchedule}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.status}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.manage}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trips.map((trip) => {
              const nextSchedule = getNextSchedule(trip)
              return (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {trip.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{trip.country?.flag_emoji}</span>
                      <span className="text-sm text-gray-900">
                        {trip.country?.name_th}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-orange-600">
                      {formatPrice(trip.price_per_person)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {nextSchedule ? (
                      <div className="text-sm text-gray-900">
                        <div>{new Date(nextSchedule.departure_date).toLocaleDateString('th-TH')}</div>
                        <div className="text-gray-500">
                          {formatDurationThai(
                            calculateDuration(nextSchedule.departure_date, nextSchedule.return_date).days,
                            calculateDuration(nextSchedule.departure_date, nextSchedule.return_date).nights
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleActive(trip.id, trip.is_active)}
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trip.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {trip.is_active ? THAI_LABELS.active : THAI_LABELS.inactive}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {THAI_LABELS.view}
                      </Link>
                      <Link
                        href={`/admin/trips/edit/${trip.id}`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        {THAI_LABELS.edit}
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(THAI_LABELS.confirmDelete)) {
                            onDelete(trip.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        {THAI_LABELS.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
