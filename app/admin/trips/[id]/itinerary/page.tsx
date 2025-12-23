'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import type { TripItineraryDayWithRelations, TripItineraryActivity, TripItineraryDayImage } from '@/types/database.types'
import AddDayModal from '@/app/components/admin/itinerary/AddDayModal'
import AddActivityModal from '@/app/components/admin/itinerary/AddActivityModal'

export default function TripItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params)
  const [trip, setTrip] = useState<any>(null)
  const [days, setDays] = useState<TripItineraryDayWithRelations[]>([])
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddActivityModal, setShowAddActivityModal] = useState(false)
  const [selectedDayForActivity, setSelectedDayForActivity] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    loadTrip()
    loadItinerary()
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

  const loadItinerary = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/itinerary`)
      const data = await res.json()
      setDays(data.days || [])
    } catch (error) {
      console.error('Error loading itinerary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDay = async (data: { day_number: number; day_title: string; day_description: string }) => {
    const res = await fetch(`/api/trips/${tripId}/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Failed to add day')

    await loadItinerary()
  }

  const handleDeleteDay = async (dayId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบวันนี้? กิจกรรมและรูปภาพทั้งหมดจะถูกลบด้วย')) return

    try {
      const res = await fetch(`/api/trips/${tripId}/itinerary/${dayId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadItinerary()
      }
    } catch (error) {
      console.error('Error deleting day:', error)
    }
  }

  const handleOpenAddActivityModal = (dayId: string, dayTitle: string) => {
    setSelectedDayForActivity({ id: dayId, title: dayTitle })
    setShowAddActivityModal(true)
  }

  const handleAddActivity = async (data: { activity_time: string | null; activity_description: string }) => {
    if (!selectedDayForActivity) return

    const res = await fetch(`/api/itinerary/${selectedDayForActivity.id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Failed to add activity')

    await loadItinerary()
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบกิจกรรมนี้?')) return

    try {
      const res = await fetch(`/api/itinerary/activities/${activityId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadItinerary()
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  const handleUploadImage = async (dayId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const caption = prompt('คำบรรยายรูป (ไม่ระบุก็ได้):')
    if (caption) formData.append('caption', caption)

    try {
      const res = await fetch(`/api/itinerary/${dayId}/images/upload`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        await loadItinerary()
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?')) return

    try {
      const res = await fetch(`/api/itinerary/images/${imageId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadItinerary()
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const toggleDay = (dayId: string) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId)
    } else {
      newExpanded.add(dayId)
    }
    setExpandedDays(newExpanded)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    )
  }

  const existingDayNumbers = days.map(d => d.day_number)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">กำหนดการเดินทางรายวัน</h1>
          <p className="text-gray-600 mt-1">{trip?.title}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>เพิ่มวันเดินทาง</span>
          </button>
          <Link
            href={`/admin/trips/${tripId}`}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
          >
            กลับ
          </Link>
        </div>
      </div>

      {/* Days List */}
      {days.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">ยังไม่มีกำหนดการเดินทาง</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-orange-600 hover:text-orange-700 font-semibold"
          >
            เริ่มเพิ่มวันเดินทาง
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day.id} className="bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              {/* Day Header */}
              <div
                onClick={() => toggleDay(day.id)}
                className="flex items-start gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                  {day.day_number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{day.day_title}</h3>

                  {/* Summary badges */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {day.activities && day.activities.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        {day.activities.length} กิจกรรม
                      </span>
                    )}
                    {day.images && day.images.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        {day.images.length} รูปภาพ
                      </span>
                    )}
                  </div>

                  {day.day_description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{day.day_description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteDay(day.id)
                    }}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 font-semibold text-sm rounded-lg transition-colors"
                  >
                    ลบ
                  </button>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${expandedDays.has(day.id) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Day Content (Expanded) */}
              {expandedDays.has(day.id) && (
                <div className="border-t-2 border-gray-100 bg-gray-50">
                  {/* Full Description */}
                  {day.day_description && (
                    <div className="px-5 pt-4 pb-2">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200">
                        {day.day_description}
                      </p>
                    </div>
                  )}

                  <div className="p-5 space-y-6">
                    {/* Activities Section */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          กิจกรรม
                        </h4>
                        <button
                          onClick={() => handleOpenAddActivityModal(day.id, day.day_title)}
                          className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          เพิ่มกิจกรรม
                        </button>
                      </div>
                      {day.activities && day.activities.length > 0 ? (
                        <div className="space-y-2">
                          {day.activities.map((activity: TripItineraryActivity) => (
                            <div key={activity.id} className="flex gap-3 items-start p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors group">
                              {activity.activity_time && (
                                <span className="flex-shrink-0 px-3 py-1 bg-orange-600 text-white font-bold text-sm rounded-md min-w-[70px] text-center">
                                  {activity.activity_time}
                                </span>
                              )}
                              <span className="flex-1 text-gray-800 font-medium leading-relaxed">{activity.activity_description}</span>
                              <button
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="flex-shrink-0 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ลบ
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm text-gray-500">ยังไม่มีกิจกรรม</p>
                          <button
                            onClick={() => handleOpenAddActivityModal(day.id, day.day_title)}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            + เพิ่มกิจกรรมแรก
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Images Section */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          รูปภาพ
                        </h4>
                        <label className="flex items-center gap-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          อัปโหลดรูปภาพ
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => handleUploadImage(day.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {day.images && day.images.length > 0 ? (
                        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                          {day.images.map((img: TripItineraryDayImage) => (
                            <div key={img.id} className="relative group">
                              <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-green-400 transition-colors">
                                <img
                                  src={img.storage_url}
                                  alt={img.alt_text || img.caption || 'Day image'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              {img.caption && (
                                <p className="text-xs text-gray-700 mt-2 font-medium truncate px-1">{img.caption}</p>
                              )}
                              <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                ลบ
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-500">ยังไม่มีรูปภาพ</p>
                          <label className="mt-2 inline-block text-sm text-green-600 hover:text-green-700 font-semibold cursor-pointer">
                            + อัปโหลดรูปภาพแรก
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={(e) => handleUploadImage(day.id, e)}
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

      {/* Add Day Modal */}
      <AddDayModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddDay}
        existingDayNumbers={existingDayNumbers}
      />

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={showAddActivityModal}
        onClose={() => {
          setShowAddActivityModal(false)
          setSelectedDayForActivity(null)
        }}
        onAdd={handleAddActivity}
        dayTitle={selectedDayForActivity?.title || ''}
      />
    </div>
  )
}
