"use client";

import Link from "next/link";
import { THAI_LABELS } from "@/lib/thai-labels";
import {
  formatPrice,
  formatDurationThai,
  calculateDuration,
} from "@/lib/migration-helpers";
import type { TripWithRelations, TripSchedule } from "@/types/database.types";

interface TripTableProps {
  trips: TripWithRelations[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
}

export default function TripTable({
  trips,
  onDelete,
  onToggleActive,
}: TripTableProps) {
  if (trips.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">{THAI_LABELS.noData}</p>
      </div>
    );
  }

  const getNextSchedule = (trip: TripWithRelations) => {
    if (!trip.trip_schedules || trip.trip_schedules.length === 0) return null;

    const today = new Date().toISOString().split("T")[0];
    const upcoming = trip.trip_schedules
      .filter((s: TripSchedule) => s.is_active && s.departure_date >= today)
      .sort((a: TripSchedule, b: TripSchedule) =>
        a.departure_date.localeCompare(b.departure_date)
      );

    return upcoming[0] || null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.tripName}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.country}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.price}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {THAI_LABELS.nextSchedule}
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
            {trips.map((trip) => {
              const nextSchedule = getNextSchedule(trip);
              return (
                <tr
                  key={trip.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {trip.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{trip.country?.flag_emoji}</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {trip.country?.name_th}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                      {formatPrice(trip.price_per_person)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {nextSchedule ? (
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div>
                          {new Date(
                            nextSchedule.departure_date
                          ).toLocaleDateString("th-TH")}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {formatDurationThai(
                            calculateDuration(
                              nextSchedule.departure_date,
                              nextSchedule.return_date
                            ).days,
                            calculateDuration(
                              nextSchedule.departure_date,
                              nextSchedule.return_date
                            ).nights
                          )}
                        </div>
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
                        onToggleActive(trip.id, trip.is_active ?? true)
                      }
                      className={`cursor-pointer px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trip.is_active
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {trip.is_active
                        ? THAI_LABELS.active
                        : THAI_LABELS.inactive}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        {THAI_LABELS.view}
                      </Link>
                      <Link
                        href={`/admin/trips/edit/${trip.id}`}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300"
                      >
                        {THAI_LABELS.edit}
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(THAI_LABELS.confirmDelete)) {
                            onDelete(trip.id);
                          }
                        }}
                        className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
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
    </div>
  );
}
