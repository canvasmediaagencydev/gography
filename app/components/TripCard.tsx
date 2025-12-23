'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { PublicTripDisplay, PublicScheduleDisplay } from '@/types/database.types';

interface TripCardProps {
  trip: PublicTripDisplay;
  selectedScheduleId?: string;
  onScheduleChange?: (scheduleId: string) => void;
}

export default function TripCard({ trip, selectedScheduleId, onScheduleChange }: TripCardProps) {
  const [localSelectedScheduleId, setLocalSelectedScheduleId] = useState(
    selectedScheduleId || trip.schedules[0]?.id
  );

  const currentScheduleId = selectedScheduleId || localSelectedScheduleId;

  const handleScheduleChange = (scheduleId: string) => {
    setLocalSelectedScheduleId(scheduleId);
    if (onScheduleChange) {
      onScheduleChange(scheduleId);
    }
  };

  const getSelectedSchedule = (): PublicScheduleDisplay | undefined => {
    return trip.schedules.find((s) => s.id === currentScheduleId) || trip.schedules[0];
  };

  const currentSchedule = getSelectedSchedule();
  if (!currentSchedule) return null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
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

        {/* Schedule Pills */}
        {trip.schedules.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="flex flex-wrap gap-2">
                {trip.schedules.map((schedule) => (
                  <button
                    key={schedule.id}
                    onClick={() => handleScheduleChange(schedule.id)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                      currentScheduleId === schedule.id
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-slate-800'
                    }`}
                  >
                    {schedule.dates}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
