"use client";

import { useEffect, useState, use, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { THAI_LABELS } from "@/lib/thai-labels";
import {
  formatPrice,
  formatThaiDateRange,
  formatDurationThai,
  calculateDuration,
  formatSlotsDisplay,
} from "@/lib/migration-helpers";
import type { TripWithRelations, TripSchedule } from "@/types/database.types";
import EditScheduleModal from "@/app/components/admin/schedules/EditScheduleModal";

export default function ViewTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [trip, setTrip] = useState<TripWithRelations | null>(null);
  const [schedules, setSchedules] = useState<TripSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<TripSchedule | null>(
    null
  );

  const loadTrip = useCallback(async () => {
    try {
      const res = await fetch(`/api/trips/${id}`);
      const data = await res.json();
      setTrip(data.trip);
    } catch (error) {
      console.error("Error loading trip:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadSchedules = useCallback(async () => {
    try {
      const res = await fetch(`/api/schedules/trip/${id}`);
      const data = await res.json();
      setSchedules(data.schedules || []);
    } catch (error) {
      console.error("Error loading schedules:", error);
    }
  }, [id]);

  useEffect(() => {
    loadTrip();
    loadSchedules();
  }, [loadTrip, loadSchedules]);

  const handleOpenEditScheduleModal = (schedule: TripSchedule) => {
    setSelectedSchedule(schedule);
    setShowEditScheduleModal(true);
  };

  const handleUpdateSchedule = async (
    scheduleId: string,
    data: {
      departure_date: string;
      return_date: string;
      registration_deadline: string | null;
      total_seats: number;
      available_seats: number;
      is_active: boolean;
    }
  ) => {
    const res = await fetch(`/api/schedules/${scheduleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update schedule");
    }

    await loadSchedules();
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm(THAI_LABELS.confirmDelete)) return;

    try {
      const res = await fetch(`/api/schedules/${scheduleId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadSchedules();
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          {THAI_LABELS.loading}
        </p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">ไม่พบทริปนี้</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {trip.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {trip.country?.flag_emoji} {trip.country?.name_th} •{" "}
            {trip.trip_type === "private"
              ? THAI_LABELS.privateTour
              : THAI_LABELS.groupTour}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/admin/trips/${trip.id}/gallery`}
            className="flex-1 md:flex-none px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>📸</span>
            <span className="whitespace-nowrap">จัดการรูปภาพ</span>
          </Link>
          <Link
            href={`/admin/trips/${trip.id}/itinerary`}
            className="flex-1 md:flex-none px-3 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>📋</span>
            <span className="whitespace-nowrap">กำหนดการเดินทาง</span>
          </Link>
          <Link
            href={`/admin/trips/${trip.id}/faqs`}
            className="flex-1 md:flex-none px-3 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>❓</span>
            <span className="whitespace-nowrap">จัดการ FAQ</span>
          </Link>
          <Link
            href={`/trips/${trip.slug || trip.id}?preview=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none px-3 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>👁️</span>
            <span className="whitespace-nowrap">ดูหน้าเว็บ</span>
          </Link>
          <Link
            href={`/admin/trips/edit/${trip.id}`}
            className="flex-1 md:flex-none px-3 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-center text-sm"
          >
            {THAI_LABELS.edit}
          </Link>
          <button
            onClick={() => router.back()}
            className="cursor-pointer flex-1 md:flex-none px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors text-sm"
          >
            {THAI_LABELS.cancel}
          </button>
        </div>
      </div>

      {/* Trip Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          รายละเอียดทริป
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {THAI_LABELS.price}
            </p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatPrice(trip.price_per_person)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {THAI_LABELS.status}
            </p>
            <p
              className={`text-lg font-semibold ${
                trip.is_active
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {trip.is_active ? THAI_LABELS.active : THAI_LABELS.inactive}
            </p>
          </div>
          {trip.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {THAI_LABELS.description}
              </p>
              <p className="text-gray-900 dark:text-white wrap-break-word whitespace-pre-wrap">
                {trip.description}
              </p>
            </div>
          )}
          {trip.cover_image_url && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {THAI_LABELS.coverImage}
              </p>
              <Image
                src={trip.cover_image_url}
                alt={trip.title}
                width={448}
                height={192}
                className="w-full max-w-md h-48 object-cover rounded-lg"
                unoptimized
              />
            </div>
          )}
          {trip.file_link && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {THAI_LABELS.documentLink}
              </p>
              <a
                href={trip.file_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline"
              >
                {trip.file_link}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Schedules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {THAI_LABELS.manageSchedules}
          </h2>
          <Link
            href={`/admin/schedules/create/${trip.id}`}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            <span>{THAI_LABELS.addSchedule}</span>
          </Link>
        </div>

        {schedules.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            ยังไม่มีรอบเดินทาง
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    วันที่เดินทาง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    ระยะเวลา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    ที่นั่ง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    วันปิดรับ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {schedules.map((schedule) => {
                  const duration = calculateDuration(
                    schedule.departure_date,
                    schedule.return_date
                  );
                  const dateRange = formatThaiDateRange(
                    schedule.departure_date,
                    schedule.return_date
                  );
                  return (
                    <tr
                      key={schedule.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {dateRange}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {formatDurationThai(duration.days, duration.nights)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatSlotsDisplay(
                          schedule.available_seats,
                          schedule.total_seats
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {schedule.registration_deadline
                          ? new Date(
                              schedule.registration_deadline
                            ).toLocaleDateString("th-TH")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            schedule.is_active
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {schedule.is_active
                            ? THAI_LABELS.active
                            : THAI_LABELS.inactive}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() =>
                              handleOpenEditScheduleModal(schedule)
                            }
                            className="cursor-pointer text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 font-semibold"
                          >
                            {THAI_LABELS.edit}
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-semibold"
                          >
                            {THAI_LABELS.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Schedule Modal */}
      <EditScheduleModal
        isOpen={showEditScheduleModal}
        onClose={() => {
          setShowEditScheduleModal(false);
          setSelectedSchedule(null);
        }}
        onUpdate={handleUpdateSchedule}
        schedule={selectedSchedule}
      />
    </div>
  );
}
