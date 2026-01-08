"use client";

import Link from "next/link";
import Image from "next/image";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { THAI_LABELS } from "@/lib/thai-labels";
import type { GalleryImageWithRelations } from "@/types/database.types";

interface GalleryTableProps {
  images: GalleryImageWithRelations[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onToggleHighlight: (id: string, currentStatus: boolean) => void;
  onReorder: () => void;
}

export default function GalleryTable({
  images,
  onDelete,
  onToggleActive,
  onToggleHighlight,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onReorder,
}: GalleryTableProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">{THAI_LABELS.noData}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.preview}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.imageTitle}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.country}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.highlight}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.status}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.manage}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {images.map((image) => (
              <tr
                key={image.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-6 py-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={image.storage_url}
                      alt={image.alt_text || image.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {image.title}
                  </div>
                  {image.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {image.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {image.country ? (
                    <div className="flex items-center gap-2">
                      <span>{image.country.flag_emoji}</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {image.country.name_th}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      -
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      onToggleHighlight(image.id, image.is_highlight ?? false)
                    }
                    className={`cursor-pointer px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      image.is_highlight
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {image.is_highlight
                      ? "⭐ " + THAI_LABELS.highlighted
                      : THAI_LABELS.notHighlighted}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      onToggleActive(image.id, image.is_active ?? true)
                    }
                    className={`cursor-pointer px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      image.is_active
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {image.is_active
                      ? THAI_LABELS.active
                      : THAI_LABELS.inactive}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/gallery/edit/${image.id}`}
                      className="p-2 text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                      title={THAI_LABELS.edit}
                    >
                      <FiEdit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(THAI_LABELS.confirmDelete)) {
                          onDelete(image.id);
                        }
                      }}
                      className="cursor-pointer p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
  );
}
