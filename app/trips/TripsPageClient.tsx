'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { PublicTripDisplay } from '@/types/database.types';
import TripCard from '../components/TripCard';

interface FilterOption {
  value: string;
  label: string;
  flag?: string;
}

interface FilterOptions {
  countries: FilterOption[];
  months: FilterOption[];
}

export default function TripsPageClient() {
  const searchParams = useSearchParams();
  const [selectedTripType, setSelectedTripType] = useState('ประเภททริปทั้งหมด');
  const [selectedDestination, setSelectedDestination] = useState('ทั่วหมด');
  const [selectedMonth, setSelectedMonth] = useState('ทุกเดือน');
  const [allTrips, setAllTrips] = useState<PublicTripDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, string>>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ countries: [], months: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  // Load initial filters from URL parameters
  useEffect(() => {
    const country = searchParams.get('country');
    const month = searchParams.get('month');

    if (country) {
      setSelectedDestination(country);
    }
    if (month) {
      setSelectedMonth(month);
    }
  }, [searchParams]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
    loadTrips(1);
  }, [selectedTripType, selectedDestination, selectedMonth]);

  const loadFilterOptions = async () => {
    try {
      const res = await fetch('/api/trips/filters');
      const data = await res.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadTrips = async (page: number = currentPage) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      if (selectedDestination !== 'ทั่วหมด') {
        params.append('country', selectedDestination);
      }
      if (selectedTripType !== 'ประเภททริปทั้งหมด') {
        params.append('trip_type', selectedTripType);
      }
      if (selectedMonth !== 'ทุกเดือน') {
        params.append('month', selectedMonth);
      }

      const res = await fetch(`/api/trips/public?${params.toString()}`);
      const data = await res.json();
      const loadedTrips = data.trips || [];
      setAllTrips(loadedTrips);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(page);

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
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="bg-white border-2 border-gray-300 text-gray-700 rounded-lg px-6 py-3 pr-10 focus:outline-none focus:border-orange-600 appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="ทั่วหมด">🌍 ทุกประเทศ</option>
                {filterOptions.countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.flag} {country.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border-2 border-gray-300 text-gray-700 rounded-lg px-6 py-3 pr-10 focus:outline-none focus:border-orange-600 appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="ทุกเดือน">ทุกเดือน</option>
                {filterOptions.months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
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
              {allTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  selectedScheduleId={selectedSchedules[trip.id]}
                  onScheduleChange={(scheduleId) => handleScheduleChange(trip.id, scheduleId)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {/* Previous Button */}
              <button
                onClick={() => loadTrips(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-slate-800 hover:text-slate-800'
                }`}
              >
                ← ก่อนหน้า
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => loadTrips(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-slate-800 hover:text-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => loadTrips(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-slate-800 hover:text-slate-800'
                }`}
              >
                ถัดไป →
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
