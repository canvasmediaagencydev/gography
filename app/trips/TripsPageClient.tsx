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
      <section className="relative h-[50vh] md:h-[60vh] min-h-[350px] md:min-h-[500px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/img/all-trips.webp"
            alt="All Trips"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-6">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center">
            ทริปทั้งหมด
          </h1>
        </div>
      </section>

      {/* Filters and Trips Section */}
      <section className="bg-white dark:bg-gray-900 py-8 md:py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12">
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-4 md:px-6 py-3 pr-10 focus:outline-none focus:border-orange-600 dark:focus:border-orange-500 appearance-none cursor-pointer sm:min-w-[200px]"
              >
                <option value="ทั่วหมด">🌍 ทุกประเทศ</option>
                {filterOptions.countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.flag} {country.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-4 md:px-6 py-3 pr-10 focus:outline-none focus:border-orange-600 dark:focus:border-orange-500 appearance-none cursor-pointer sm:min-w-[200px]"
              >
                <option value="ทุกเดือน">ทุกเดือน</option>
                {filterOptions.months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Trips Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400">กำลังโหลด...</p>
            </div>
          ) : allTrips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">ไม่พบทริปที่ตรงกับการค้นหา</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
            <div className="flex justify-center items-center gap-1 md:gap-2 mt-8 md:mt-12 flex-wrap">
              {/* Previous Button */}
              <button
                onClick={() => loadTrips(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'cursor-pointer bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-slate-800 dark:hover:border-orange-500 hover:text-slate-800 dark:hover:text-orange-400'
                }`}
              >
                <span className="hidden sm:inline">← ก่อนหน้า</span>
                <span className="sm:hidden">←</span>
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1 md:gap-2 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // On mobile, show only current page, first, last, and adjacent pages
                  const showOnMobile =
                    page === 1 ||
                    page === totalPages ||
                    page === currentPage ||
                    page === currentPage - 1 ||
                    page === currentPage + 1;

                  // Show ellipsis on mobile
                  if (!showOnMobile && totalPages > 5) {
                    // Show ellipsis only once between ranges
                    if (page === 2 && currentPage > 3) {
                      return <span key={page} className="md:hidden px-2 text-gray-400 dark:text-gray-500">...</span>;
                    }
                    if (page === totalPages - 1 && currentPage < totalPages - 2) {
                      return <span key={page} className="md:hidden px-2 text-gray-400 dark:text-gray-500">...</span>;
                    }
                    return <button key={page} className="cursor-pointer hidden md:inline-flex w-8 md:w-10 h-8 md:h-10 rounded-lg font-medium text-sm md:text-base items-center justify-center transition-colors bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-slate-800 dark:hover:border-orange-500 hover:text-slate-800 dark:hover:text-orange-400" onClick={() => loadTrips(page)}>{page}</button>;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => loadTrips(page)}
                      className={`cursor-pointer w-8 md:w-10 h-8 md:h-10 rounded-lg font-medium text-sm md:text-base transition-colors ${
                        currentPage === page
                          ? 'bg-slate-800 dark:bg-orange-600 text-white'
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-slate-800 dark:hover:border-orange-500 hover:text-slate-800 dark:hover:text-orange-400'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => loadTrips(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'cursor-pointer bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-slate-800 dark:hover:border-orange-500 hover:text-slate-800 dark:hover:text-orange-400'
                }`}
              >
                <span className="hidden sm:inline">ถัดไป →</span>
                <span className="sm:hidden">→</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
