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
          <h1 className="text-3xl font-bold text-gray-900">
            {THAI_LABELS.manageCountries}
          </h1>
          <p className="text-gray-600 mt-1">รายการประเทศปลายทางทั้งหมด</p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          + เพิ่มประเทศ
        </button>
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจัดการ
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
                      <button
                        onClick={() => handleToggleActive(country)}
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${
                          country.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {country.is_active ? THAI_LABELS.active : THAI_LABELS.inactive}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(country)}
                          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteClick(country)}
                          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
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
