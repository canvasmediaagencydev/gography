'use client'

import Link from 'next/link'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { THAI_LABELS } from '@/lib/thai-labels'
import type { GalleryImageWithRelations } from '@/types/database.types'

interface GalleryTableProps {
  images: GalleryImageWithRelations[]
  onDelete: (id: string) => void
  onToggleActive: (id: string, currentStatus: boolean) => void
  onToggleHighlight: (id: string, currentStatus: boolean) => void
  onReorder: () => void
}

export default function GalleryTable({
  images,
  onDelete,
  onToggleActive,
  onToggleHighlight,
  onReorder,
}: GalleryTableProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">{THAI_LABELS.noData}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.preview}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.imageTitle}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.country}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.highlight}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.status}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {THAI_LABELS.manage}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {images.map((image) => (
              <tr key={image.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.storage_url}
                      alt={image.alt_text || image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {image.title}
                  </div>
                  {image.description && (
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {image.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {image.country ? (
                    <div className="flex items-center gap-2">
                      <span>{image.country.flag_emoji}</span>
                      <span className="text-sm text-gray-900">
                        {image.country.name_th}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleHighlight(image.id, image.is_highlight)}
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      image.is_highlight
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {image.is_highlight
                      ? '⭐ ' + THAI_LABELS.highlighted
                      : THAI_LABELS.notHighlighted}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleActive(image.id, image.is_active)}
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      image.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {image.is_active ? THAI_LABELS.active : THAI_LABELS.inactive}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/gallery/edit/${image.id}`}
                      className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
                      title={THAI_LABELS.edit}
                    >
                      <FiEdit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(THAI_LABELS.confirmDelete)) {
                          onDelete(image.id)
                        }
                      }}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      title={THAI_LABELS.delete}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
