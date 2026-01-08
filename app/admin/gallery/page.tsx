"use client";

import { useEffect, useState, useCallback } from "react";

import Link from "next/link";
import { THAI_LABELS } from "@/lib/thai-labels";
import GalleryTable from "@/app/components/admin/GalleryTable";
import type {
  GalleryImageWithRelations,
  Country,
  Trip,
} from "@/types/database.types";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImageWithRelations[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    country_id: "",
    trip_id: "",
    is_highlight: "",
    is_active: "",
  });

  // Load countries and trips only once on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const countriesRes = await fetch("/api/countries");
        const countriesData = await countriesRes.json();
        setCountries(countriesData.countries || []);

        const tripsRes = await fetch("/api/trips?pageSize=1000");
        const tripsData = await tripsRes.json();
        setTrips(tripsData.trips || []);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    loadInitialData();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.country_id) params.append("country_id", filters.country_id);
      if (filters.trip_id) params.append("trip_id", filters.trip_id);
      if (filters.is_highlight !== "")
        params.append("is_highlight", filters.is_highlight);
      if (filters.is_active !== "")
        params.append("is_active", filters.is_active);
      params.append("pageSize", "100");

      const imagesRes = await fetch(`/api/gallery?${params.toString()}`);
      const imagesData = await imagesRes.json();
      setImages(imagesData.images || []);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Load images when filters change
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadImages();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (res.ok) {
        loadImages();
      }
    } catch (error) {
      console.error("Error toggling active status:", error);
    }
  };

  const handleToggleHighlight = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_highlight: !currentStatus }),
      });
      if (res.ok) {
        loadImages();
      }
    } catch (error) {
      console.error("Error toggling highlight status:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {THAI_LABELS.manageGallery}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            จัดการรูปภาพแกลเลอรีทั้งหมด
          </p>
        </div>
        <Link
          href="/admin/gallery/upload"
          className="w-full md:w-auto justify-center px-4 py-2 md:px-6 md:py-3 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base"
        >
          <span>📸</span>
          <span>{THAI_LABELS.uploadImages}</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {THAI_LABELS.search}
            </label>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ค้นหารูปภาพ..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {THAI_LABELS.country}
            </label>
            <select
              value={filters.country_id}
              onChange={(e) =>
                setFilters({ ...filters, country_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
            >
              <option value="">{THAI_LABELS.allDestinations}</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.flag_emoji} {country.name_th}
                </option>
              ))}
            </select>
          </div>

          {/* Trip Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ทริป
            </label>
            <select
              value={filters.trip_id}
              onChange={(e) =>
                setFilters({ ...filters, trip_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
            >
              <option value="">ทั้งหมด</option>
              <option value="null">ไม่เชื่อมกับทริป</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title}
                </option>
              ))}
            </select>
          </div>

          {/* Highlight Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {THAI_LABELS.highlightStatus}
            </label>
            <select
              value={filters.is_highlight}
              onChange={(e) =>
                setFilters({ ...filters, is_highlight: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
            >
              <option value="">{THAI_LABELS.allStatuses}</option>
              <option value="true">{THAI_LABELS.highlighted}</option>
              <option value="false">{THAI_LABELS.notHighlighted}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {THAI_LABELS.status}
            </label>
            <select
              value={filters.is_active}
              onChange={(e) =>
                setFilters({ ...filters, is_active: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400"
            >
              <option value="">{THAI_LABELS.allStatuses}</option>
              <option value="true">{THAI_LABELS.active}</option>
              <option value="false">{THAI_LABELS.inactive}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            {THAI_LABELS.loading}
          </p>
        </div>
      ) : (
        <GalleryTable
          images={images}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onToggleHighlight={handleToggleHighlight}
          onReorder={loadImages}
        />
      )}
    </div>
  );
}
