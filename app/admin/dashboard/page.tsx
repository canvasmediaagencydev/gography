'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { IconType } from 'react-icons'
import {
  FiCalendar,
  FiCheckCircle,
  FiCompass,
  FiFlag,
  FiImage,
  FiList,
  FiPlusCircle,
  FiUsers,
} from 'react-icons/fi'

interface DashboardStats {
  totalTrips: number
  activeTrips: number
  upcomingSchedules: number
  totalSeats: number
  totalImages: number
}

interface TripSummary {
  id: string
  is_active: boolean
}

interface ScheduleSummary {
  id: string
  is_active: boolean
  departure_date: string
  total_seats?: number | null
}

interface TripsResponse {
  trips?: TripSummary[]
  totalCount?: number
}

interface SchedulesResponse {
  schedules?: ScheduleSummary[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    activeTrips: 0,
    upcomingSchedules: 0,
    totalSeats: 0,
    totalImages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Fetch trips
      const tripsRes = await fetch('/api/trips?pageSize=1000')
      const tripsData: TripsResponse = await tripsRes.json()

      const totalTrips = tripsData.totalCount || 0
      const activeTrips = tripsData.trips?.filter((trip) => trip.is_active).length || 0

      // Fetch schedules
      const schedulesRes = await fetch('/api/schedules')
      const schedulesData: SchedulesResponse = await schedulesRes.json()

      const today = new Date().toISOString().split('T')[0]
      const upcomingSchedules =
        schedulesData.schedules?.filter(
          (schedule) => schedule.is_active && schedule.departure_date >= today
        ).length || 0

      const totalSeats =
        schedulesData.schedules?.reduce(
          (sum, schedule) => sum + (schedule.total_seats || 0),
          0
        ) || 0

      // Fetch gallery images
      const galleryRes = await fetch('/api/gallery?pageSize=1000')
      const galleryData = await galleryRes.json()
      const totalImages = galleryData.totalCount || 0

      setStats({
        totalTrips,
        activeTrips,
        upcomingSchedules,
        totalSeats,
        totalImages,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards: Array<{
    label: string
    value: number
    Icon: IconType
    accent: string
    iconColor: string
  }> = [
    {
      label: THAI_LABELS.totalTrips,
      value: stats.totalTrips,
      Icon: FiCompass,
      accent: 'from-sky-500/15 via-sky-500/5 to-transparent',
      iconColor: 'text-sky-600',
    },
    {
      label: 'ทริปที่เปิดใช้งาน',
      value: stats.activeTrips,
      Icon: FiCheckCircle,
      accent: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      iconColor: 'text-emerald-600',
    },
    {
      label: THAI_LABELS.upcomingSchedules,
      value: stats.upcomingSchedules,
      Icon: FiCalendar,
      accent: 'from-orange-500/15 via-orange-500/5 to-transparent',
      iconColor: 'text-orange-500',
    },
    {
      label: THAI_LABELS.totalSeatsCount,
      value: stats.totalSeats,
      Icon: FiUsers,
      accent: 'from-violet-500/15 via-violet-500/5 to-transparent',
      iconColor: 'text-violet-600',
    },
    {
      label: THAI_LABELS.totalImages,
      value: stats.totalImages,
      Icon: FiImage,
      accent: 'from-pink-500/15 via-pink-500/5 to-transparent',
      iconColor: 'text-pink-600',
    },
  ]

  const quickActions: Array<{
    href: string
    title: string
    description: string
    Icon: IconType
    accent: string
  }> = [
    {
      href: '/admin/trips/create',
      title: 'สร้างทริปใหม่',
      description: 'เพิ่มทริปใหม่เข้าระบบพร้อมรายละเอียดครบถ้วน',
      Icon: FiPlusCircle,
      accent: 'from-orange-500/20 via-orange-500/10 to-transparent text-orange-600 border-orange-200/80',
    },
    {
      href: '/admin/trips',
      title: THAI_LABELS.manageTrips,
      description: 'ดูสถานะ จัดการ และเผยแพร่ทริปทั้งหมด',
      Icon: FiList,
      accent: 'from-sky-500/20 via-sky-500/10 to-transparent text-sky-600 border-sky-200/80',
    },
    {
      href: '/admin/countries',
      title: 'จัดการประเทศ',
      description: 'อัปเดตประเทศปลายทางและข้อมูลการเดินทาง',
      Icon: FiFlag,
      accent: 'from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-600 border-emerald-200/80',
    },
    {
      href: '/admin/gallery/upload',
      title: 'อัปโหลดรูปภาพ',
      description: 'เพิ่มรูปภาพใหม่เข้าแกลเลอรี',
      Icon: FiImage,
      accent: 'from-pink-500/20 via-pink-500/10 to-transparent text-pink-600 border-pink-200/80',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60">
        <p className="text-slate-500 dark:text-gray-400">{THAI_LABELS.loading}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/60 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-8 shadow-2xl shadow-slate-200/70 dark:shadow-gray-900/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400 dark:text-gray-500">
              {THAI_LABELS.dashboard}
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900 dark:text-white">
              ภาพรวมระบบจัดการทริป
            </h1>
            <p className="mt-3 text-slate-500 dark:text-gray-400">
              ตรวจสอบสถานะทริป กำหนดการ และจำนวนที่นั่งได้จากที่นี่แบบเรียลไทม์
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-3xl border border-white/60 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 p-6 shadow-xl shadow-slate-200/60 dark:shadow-gray-900/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-gray-400">{card.label}</p>
                <p className="mt-2 text-4xl font-semibold text-slate-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div
                className={`rounded-2xl border border-white/70 dark:border-gray-600 bg-linear-to-br ${card.accent} p-3`}
              >
                <card.Icon className={`text-2xl ${card.iconColor} dark:${card.iconColor.replace('600', '400').replace('500', '400')}`} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/60 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 p-6 shadow-xl shadow-slate-200/60 dark:shadow-gray-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">คำสั่งลัดเพื่อเริ่มต้นจัดการข้อมูลได้รวดเร็ว</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`rounded-2xl border dark:border-gray-600 bg-linear-to-br px-5 py-6 transition hover:-translate-y-1 hover:shadow-lg ${action.accent}`}
            >
              <action.Icon className="text-2xl" />
              <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {action.title}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
