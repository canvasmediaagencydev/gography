'use client'

import { useState } from 'react'

interface AddFaqModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: { question: string; answer: string; order_index: number }) => Promise<void>
}

export default function AddFaqModal({ isOpen, onClose, onAdd }: AddFaqModalProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [orderIndex, setOrderIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (question.length < 10) {
      setError('คำถามต้องมีอย่างน้อย 10 ตัวอักษร')
      return
    }

    if (answer.length < 10) {
      setError('คำตอบต้องมีอย่างน้อย 10 ตัวอักษร')
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd({ question, answer, order_index: orderIndex })
      // Reset form
      setQuestion('')
      setAnswer('')
      setOrderIndex(0)
      onClose()
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setQuestion('')
    setAnswer('')
    setOrderIndex(0)
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">เพิ่ม FAQ</h2>
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              คำถาม <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="เช่น วีซ่าต้องใช้เวลานานแค่ไหน?"
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{question.length}/500 ตัวอักษร</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              คำตอบ <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="คำตอบของคำถามนี้..."
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">{answer.length} ตัวอักษร</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ลำดับการแสดงผล
            </label>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่ม FAQ'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
