import TripForm from '@/app/components/admin/TripForm'
import { THAI_LABELS } from '@/lib/thai-labels'

export default function CreateTripPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">สร้างทริปใหม่</h1>
        <p className="text-gray-600 mt-1">
          เพิ่มทริปใหม่เข้าสู่ระบบ
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <TripForm mode="create" />
      </div>
    </div>
  )
}
