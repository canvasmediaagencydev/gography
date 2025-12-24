'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { THAI_LABELS } from '@/lib/thai-labels'
import TripTable from '@/app/components/admin/TripTable'
import type { TripWithRelations, Country } from '@/types/database.types'

export default function TripsPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<TripWithRelations[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    country_id: '',
    is_active: '',
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load countries
      const countriesRes = await fetch('/api/countries')
      const countriesData = await countriesRes.json()
      setCountries(countriesData.countries || [])

      // Build query params
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.country_id) params.append('country_id', filters.country_id)
      if (filters.is_active !== '') params.append('is_active', filters.is_active)
      params.append('pageSize', '100')

      // Load trips
      const tripsRes = await fetch(`/api/trips?${params.toString()}`)
      const tripsData = await tripsRes.json()
      setTrips(tripsData.trips || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      })
      if (res.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {THAI_LABELS.manageTrips}
          </h1>
          <p className="text-gray-600 mt-1">จัดการทริปทั้งหมดในระบบ</p>
        </div>
        <Link
          href="/admin/trips/create"
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          <span>{THAI_LABELS.createNew}</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {THAI_LABELS.search}
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="ค้นหาทริป..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {THAI_LABELS.country}
            </label>
            <select
              value={filters.country_id}
              onChange={(e) => setFilters({ ...filters, country_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">{THAI_LABELS.allDestinations}</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.flag_emoji} {country.name_th}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {THAI_LABELS.status}
            </label>
            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">{THAI_LABELS.allStatuses}</option>
              <option value="true">{THAI_LABELS.active}</option>
              <option value="false">{THAI_LABELS.inactive}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">{THAI_LABELS.loading}</p>
        </div>
      ) : (
        <TripTable
          trips={trips}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  )
}
