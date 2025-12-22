'use client'

import { useRouter } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import { useState } from 'react'
import { FiLogOut, FiShield } from 'react-icons/fi'

export default function AdminNavbar() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="sticky top-0 z-20 border-b border-white/70 bg-white/80 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Admin
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            ระบบจัดการทริป
          </h2>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 bg-white">
            <FiShield className="text-orange-500" />
            <span>สิทธิ์ผู้ดูแล</span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <FiLogOut />
            <span>{THAI_LABELS.logout}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
