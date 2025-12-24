'use client'

import { useState, useEffect } from 'react'
import type { Country } from '@/types/database.types'

interface CountryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  country?: Country | null
  mode: 'create' | 'edit'
}

export default function CountryFormModal({
  isOpen,
  onClose,
  onSuccess,
  country,
  mode
}: CountryFormModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name_th: '',
    name_en: '',
    flag_emoji: '',
    is_active: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (country && mode === 'edit') {
      setFormData({
        code: country.code,
        name_th: country.name_th,
        name_en: country.name_en,
        flag_emoji: country.flag_emoji || '',
        is_active: country.is_active,
      })
    } else {
      setFormData({
        code: '',
        name_th: '',
        name_en: '',
        flag_emoji: '',
        is_active: true,
      })
    }
    setError('')
  }, [country, mode, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const url = mode === 'create' ? '/api/countries' : `/api/countries/${country?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด')
        return
      }

      // Success - reset form and close
      onSuccess()
      handleClose()
    } catch (err) {
      console.error('Error saving country:', err)
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      code: '',
      name_th: '',
      name_en: '',
      flag_emoji: '',
      is_active: true,
    })
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'เพิ่มประเทศ' : 'แก้ไขประเทศ'}
          </h2>
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
          {/* Country Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              รหัสประเทศ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="เช่น TH, US, JP"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
              minLength={2}
              maxLength={10}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">ใช้อักษรตัวพิมพ์ใหญ่ เช่น TH, NO, IS</p>
          </div>

          {/* Thai Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ชื่อภาษาไทย <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name_th}
              onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
              placeholder="เช่น นอร์เวย์, ไอซ์แลนด์"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
              minLength={2}
              maxLength={255}
              disabled={isSubmitting}
            />
          </div>

          {/* English Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ชื่อภาษาอังกฤษ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              placeholder="เช่น Norway, Iceland"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
              minLength={2}
              maxLength={255}
              disabled={isSubmitting}
            />
          </div>

          {/* Flag Emoji */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ธงชาติ (Emoji)
            </label>
            <input
              type="text"
              value={formData.flag_emoji}
              onChange={(e) => setFormData({ ...formData, flag_emoji: e.target.value })}
              placeholder="เช่น 🇹🇭 🇳🇴 🇮🇸"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              maxLength={10}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">คัดลอก emoji ธงชาติมาวางได้เลย</p>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              disabled={isSubmitting}
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              เปิดใช้งาน
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
