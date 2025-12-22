'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { IconType } from 'react-icons'
import { FiGlobe, FiImage, FiLayout, FiMap } from 'react-icons/fi'

export default function Sidebar() {
  const pathname = usePathname()

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

  return (
    <div className="w-64 lg:w-72 bg-slate-950 text-white min-h-screen fixed left-0 top-0 border-r border-white/10 shadow-xl">
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

      <div className="mt-auto p-6 text-xs text-slate-400">
        <p>Gography Admin © {new Date().getFullYear()}</p>
        <p className="text-slate-500">จัดการด้วยความมั่นใจ</p>
      </div>
    </div>
  )
}
