"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PublicTripDisplay } from "@/types/database.types";
import TripCard from "./TripCard";

export default function HighlightTrips() {
  const [trips, setTrips] = useState<PublicTripDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await fetch("/api/trips/public?pageSize=3");
      const data = await res.json();
      // Get first 3 trips for highlight section
      const loadedTrips = (data.trips || []).slice(0, 3);
      setTrips(loadedTrips);

      // Set default selected schedule (first one) for each trip
      const initialSelected: Record<string, string> = {};
      loadedTrips.forEach((trip: PublicTripDisplay) => {
        if (trip.schedules && trip.schedules.length > 0) {
          initialSelected[trip.id] = trip.schedules[0].id;
        }
      });
      setSelectedSchedules(initialSelected);
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleChange = (tripId: string, scheduleId: string) => {
    setSelectedSchedules((prev) => ({
      ...prev,
      [tripId]: scheduleId,
    }));
  };

  if (isLoading) {
    return (
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">กำลังโหลด...</p>
          </div>
        </div>
      </section>
    );
  }

  if (trips.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ทริปไฮไลท์
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            ทริปยอดนิยมที่คัดสรรมาเพื่อคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              selectedScheduleId={selectedSchedules[trip.id]}
              onScheduleChange={(scheduleId) =>
                handleScheduleChange(trip.id, scheduleId)
              }
            />
          ))}
        </div>

        {/* View All Trips Button */}
        <div className="text-center mt-12">
          <Link href="/contact">
            <button className="cursor-pointer bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
              สอบถามหรือจองทริป
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
