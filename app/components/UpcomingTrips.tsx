'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PublicTripDisplay } from '@/types/database.types';
import TripCard from './TripCard';

export default function UpcomingTrips() {
  const [trips, setTrips] = useState<PublicTripDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await fetch('/api/trips/public');
      const data = await res.json();
      // Limit to 6 trips for homepage
      const loadedTrips = (data.trips || []).slice(0, 6);
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
      console.error('Error loading trips:', error);
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
      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">กำลังโหลด...</p>
          </div>
        </div>
      </section>
    );
  }

  if (trips.length === 0) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">ยังไม่มีทริปที่กำลังจะมาถึง</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          UPCOMING TRIPS
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-300 text-base md:text-lg mb-12 max-w-4xl mx-auto">
          ลูกค้าทุกท่านจะไม่พลาด<span className="text-orange-600 dark:text-orange-400 font-semibold">ความทรงจำที่ดีและภาพสวยสุดประทับใจ</span>จากการเดินทางกับเราอย่างแน่นอน!
          <br />
          เราจะพาคุณไปสัมผัสสถานที่พิเศษในช่วงเวลาที่เหมาะสมที่สุดเสมอ
        </p>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              selectedScheduleId={selectedSchedules[trip.id]}
              onScheduleChange={(scheduleId) => handleScheduleChange(trip.id, scheduleId)}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/trips"
            className="inline-block bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-semibold px-12 py-4 rounded-full transition-colors duration-300"
          >
            ดูทริปทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  );
}
