'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PublicTripDisplay, PublicScheduleDisplay } from '@/types/database.types';

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

  const getSelectedSchedule = (trip: PublicTripDisplay): PublicScheduleDisplay | undefined => {
    const selectedId = selectedSchedules[trip.id];
    return trip.schedules.find((s) => s.id === selectedId) || trip.schedules[0];
  };

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">กำลังโหลด...</p>
          </div>
        </div>
      </section>
    );
  }

  if (trips.length === 0) {
    return (
      <section className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-500">ยังไม่มีทริปที่กำลังจะมาถึง</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          UPCOMING TRIPS
        </h2>
        <p className="text-center text-gray-700 text-base md:text-lg mb-12 max-w-4xl mx-auto">
          ลูกค้าทุกท่านจะไม่พลาด<span className="text-orange-600 font-semibold">ความทรงจำที่ดีและรับที่สุดขอมจากภาพของเรา</span>ในทุกการเดินทางอย่างแน่นอน!
          <br />
          เราจะพากุกท่านไปอยู่ในใจเคยึ่งที่พิเศษไม่ช่วงเวลาพิเศษเสมอ
        </p>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Trip Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Trip Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 min-h-[56px]">
                  {trip.title}
                </h3>

                {/* Schedule Selector - Show if multiple schedules */}
                {trip.schedules.length > 1 && (
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">เลือกรอบเดินทาง</label>
                    <select
                      value={selectedSchedules[trip.id] || trip.schedules[0].id}
                      onChange={(e) =>
                        setSelectedSchedules((prev) => ({
                          ...prev,
                          [trip.id]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    >
                      {trip.schedules.map((schedule) => (
                        <option key={schedule.id} value={schedule.id}>
                          {schedule.dates} • {schedule.slots}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(() => {
                  const currentSchedule = getSelectedSchedule(trip);
                  if (!currentSchedule) return null;

                  return (
                    <>
                      {/* Dates */}
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{currentSchedule.dates}</span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{currentSchedule.duration}</span>
                      </div>

                      {/* Country */}
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <span className="text-lg">{trip.flag}</span>
                        <span className="text-sm">{trip.country}</span>
                      </div>

                      {/* Price and Slots */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-orange-600">
                          {trip.price}
                        </div>
                        <div className="text-sm text-gray-600">
                          {currentSchedule.slots}
                        </div>
                      </div>

                      {/* Book Button */}
                      <Link
                        href={`/trips/${trip.id}?schedule=${currentSchedule.id}`}
                        className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full text-center transition-colors duration-300"
                      >
                        ดูทริป →
                      </Link>
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/trips"
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold px-12 py-4 rounded-full transition-colors duration-300"
          >
            ดูทริปทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  );
}
