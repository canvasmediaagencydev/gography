'use client'

import { useEffect, useState } from 'react'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { Country } from '@/types/database.types'

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      const res = await fetch('/api/countries')
      const data = await res.json()
      setCountries(data.countries || [])
    } catch (error) {
      console.error('Error loading countries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {THAI_LABELS.manageCountries}
        </h1>
        <p className="text-gray-600 mt-1">รายการประเทศปลายทางทั้งหมด</p>
      </div>

      {/* Countries Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">{THAI_LABELS.loading}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ธง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อประเทศ (ไทย)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อประเทศ (EN)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัส
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {countries.map((country) => (
                  <tr key={country.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-2xl">
                      {country.flag_emoji}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {country.name_th}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {country.name_en}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {country.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          country.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {country.is_active ? THAI_LABELS.active : THAI_LABELS.inactive}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
