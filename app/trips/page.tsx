'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import type { PublicTripDisplay, PublicScheduleDisplay } from '@/types/database.types';

export default function TripsPage() {
  const [selectedTripType, setSelectedTripType] = useState('ประเภททริปทั้งหมด');
  const [selectedDestination, setSelectedDestination] = useState('ทั่วหมด');
  const [allTrips, setAllTrips] = useState<PublicTripDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTrips();
  }, [selectedTripType, selectedDestination]);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDestination !== 'ทั่วหมด') {
        params.append('country', selectedDestination);
      }
      if (selectedTripType !== 'ประเภททริปทั้งหมด') {
        params.append('trip_type', selectedTripType);
      }

      const res = await fetch(`/api/trips/public?${params.toString()}`);
      const data = await res.json();
      const loadedTrips = data.trips || [];
      setAllTrips(loadedTrips);

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

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/img/all-trips.webp"
            alt="All Trips"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center">
            ทรีปทั้งหมด
          </h1>
        </div>
      </section>

      {/* Filters and Trips Section */}
      <section className="bg-white py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="relative">
              <select
                value={selectedTripType}
                onChange={(e) => setSelectedTripType(e.target.value)}
                className="bg-white border-2 border-gray-300 text-gray-700 rounded-lg px-6 py-3 pr-10 focus:outline-none focus:border-orange-600 appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="ประเภททริปทั้งหมด">ประเภททริปทั้งหมด</option>
                <option value="กรุ๊ปทัวร์">กรุ๊ปทัวร์</option>
                <option value="ทริปส่วนตัว">ทริปส่วนตัว</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="bg-white border-2 border-gray-300 text-gray-700 rounded-lg px-6 py-3 pr-10 focus:outline-none focus:border-orange-600 appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="ทั่วหมด">ทั่วหมด</option>
                <option value="ไอซ์แลนด์">ไอซ์แลนด์</option>
                <option value="นอร์เวย์">นอร์เวย์</option>
                <option value="ฟินแลนด์">ฟินแลนด์</option>
                <option value="รัสเซีย">รัสเซีย</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Trips Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">กำลังโหลด...</p>
            </div>
          ) : allTrips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">ไม่พบทริปที่ตรงกับการค้นหา</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allTrips.map((trip, index) => (
              <div
                key={index}
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
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-base">{currentSchedule.dates}</span>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-base">{currentSchedule.duration}</span>
                        </div>

                        {/* Country */}
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <span className="text-lg">{trip.flag}</span>
                          <span className="text-base">{trip.country}</span>
                        </div>

                        {/* Price and Slots */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-bold text-orange-600">
                            {trip.price}
                          </div>
                          <div className="text-base text-gray-600">
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
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
