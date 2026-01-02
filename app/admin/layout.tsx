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
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-white text-slate-900">
      <Sidebar />

      <div className="flex-1 ml-64 lg:ml-72">
        <main className="p-6 lg:p-10">
          <div className="mx-auto max-w-8xl space-y-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
