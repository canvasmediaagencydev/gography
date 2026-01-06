import Sidebar from '@/app/components/admin/Sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-slate-900 dark:text-white">
      <Sidebar />

      <div className="flex-1 ml-64 lg:ml-72">
        <main className="p-6 lg:p-10">
          <div className="mx-auto max-w-8xl space-y-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
