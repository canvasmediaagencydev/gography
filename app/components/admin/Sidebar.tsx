'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { IconType } from 'react-icons'
import { FiGlobe, FiImage, FiLayout, FiLogOut, FiMap } from 'react-icons/fi'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  const menuItems: Array<{
    href: string
    label: string
    Icon: IconType
  }> = [
    {
      href: '/admin/dashboard',
      label: THAI_LABELS.dashboard,
      Icon: FiLayout,
    },
    {
      href: '/admin/trips',
      label: THAI_LABELS.manageTrips,
      Icon: FiMap,
    },
    {
      href: '/admin/gallery',
      label: THAI_LABELS.manageGallery,
      Icon: FiImage,
    },
    {
      href: '/admin/countries',
      label: THAI_LABELS.manageCountries,
      Icon: FiGlobe,
    },
  ]

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setLogoutError(null)
    setIsLoggingOut(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Logout failed')
      }

      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setLogoutError('ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="fixed left-0 top-0 flex min-h-screen w-64 flex-col bg-slate-950 text-white border-r border-white/10 shadow-xl lg:w-72">
      <div className="p-6 border-b border-white/10">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Admin
        </p>
        <h1 className="text-2xl font-semibold text-white mt-2">Gography</h1>
        <p className="text-sm text-slate-400 mt-1">
          ระบบจัดการทริปทั้งหมดในที่เดียว
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-all ${
                active
                  ? 'bg-gradient-to-r from-orange-500/80 via-orange-500/70 to-amber-400/60 text-white shadow-lg shadow-orange-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg ${
                  active ? 'border-white/30 bg-white/20' : ''
                }`}
              >
                <item.Icon />
              </span>
              <div className="flex flex-col">
                <span>{item.label}</span>
                {active && (
                  <span className="text-xs text-white/80">กำลังดูอยู่</span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 p-6">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg">
              <FiLogOut />
            </span>
            <div className="flex flex-col">
              <span>{THAI_LABELS.logout}</span>
              <span className="text-xs text-white/70">
                {isLoggingOut ? 'กำลังออกจากระบบ...' : 'เปลี่ยนบัญชีผู้ใช้'}
              </span>
            </div>
          </span>
        </button>
        {logoutError && (
          <p className="mt-3 text-xs text-red-300">{logoutError}</p>
        )}

      </div>
    </div>
  )
}
