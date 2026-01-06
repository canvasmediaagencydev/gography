'use client'

import { useEffect, useState } from 'react'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { Country } from '@/types/database.types'
import CountryFormModal from '@/app/components/admin/CountryFormModal'

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    setIsLoading(true)
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

  const handleAddClick = () => {
    setModalMode('create')
    setSelectedCountry(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (country: Country) => {
    setModalMode('edit')
    setSelectedCountry(country)
    setIsModalOpen(true)
  }

  const handleDeleteClick = async (country: Country) => {
    if (!confirm(`คุณต้องการลบประเทศ "${country.name_th}" ใช่หรือไม่?`)) {
      return
    }

    try {
      const res = await fetch(`/api/countries/${country.id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'เกิดข้อผิดพลาดในการลบประเทศ')
        return
      }

      // Reload countries
      loadCountries()
    } catch (error) {
      console.error('Error deleting country:', error)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    }
  }

  const handleToggleActive = async (country: Country) => {
    try {
      const res = await fetch(`/api/countries/${country.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !country.is_active }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'เกิดข้อผิดพลาดในการอัพเดตสถานะ')
        return
      }

      // Reload countries
      loadCountries()
    } catch (error) {
      console.error('Error toggling active status:', error)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    }
  }

  const handleModalSuccess = () => {
    loadCountries()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {THAI_LABELS.manageCountries}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">รายการประเทศปลายทางทั้งหมด</p>
        </div>
        <button
          onClick={handleAddClick}
          className="cursor-pointer px-6 py-3 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 dark:from-orange-500 dark:to-orange-400 dark:hover:from-orange-600 dark:hover:to-orange-500 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          + เพิ่มประเทศ
        </button>
      </div>

      {/* Countries Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">{THAI_LABELS.loading}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ธง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ชื่อประเทศ (ไทย)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ชื่อประเทศ (EN)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    รหัส
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {countries.map((country) => (
                  <tr key={country.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-2xl">
                      {country.flag_emoji}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {country.name_th}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {country.name_en}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {country.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(country)}
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${
                          country.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {country.is_active ? THAI_LABELS.active : THAI_LABELS.inactive}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(country)}
                          className="cursor-pointer px-3 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg transition-colors"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteClick(country)}
                          className="cursor-pointer px-3 py-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Country Form Modal */}
      <CountryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        country={selectedCountry}
        mode={modalMode}
      />
    </div>
  )
}
