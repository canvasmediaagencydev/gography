"use client";

import { use, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { uploadWithProgress } from "@/lib/upload-helpers";
import type {
  TripItineraryDayWithRelations,
  TripItineraryActivity,
  TripItineraryDayImage,
  Trip,
} from "@/types/database.types";
import AddDayModal from "@/app/components/admin/itinerary/AddDayModal";
import AddActivityModal from "@/app/components/admin/itinerary/AddActivityModal";
import EditDayModal from "@/app/components/admin/itinerary/EditDayModal";
import EditActivityModal from "@/app/components/admin/itinerary/EditActivityModal";
import ProgressBar from "@/app/components/admin/ProgressBar";

export default function TripItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tripId } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<TripItineraryDayWithRelations[]>([]);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [selectedDayForActivity, setSelectedDayForActivity] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [showEditDayModal, setShowEditDayModal] = useState(false);
  const [selectedDayForEdit, setSelectedDayForEdit] = useState<{
    id: string;
    day_number: number;
    day_title: string;
    day_description: string | null;
  } | null>(null);
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const [selectedActivityForEdit, setSelectedActivityForEdit] = useState<{
    id: string;
    activity_time: string | null;
    activity_description: string;
    dayTitle: string;
  } | null>(null);
  const [uploadingDayId, setUploadingDayId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const stripHtml = (html: string) => {
    if (!html) return "";
    // Replace block-level tags and images with space to prevent text merging
    const withSpaces = html
      .replace(/<img[^>]*>/g, " ")
      .replace(/<br\s*\/?>/g, " ")
      .replace(/<\/(p|div|h[1-6]|li|tr)>/g, " ");
    // Strip remaining tags
    const text = withSpaces.replace(/<[^>]*>?/gm, "");
    // Collapse whitespace
    return text.replace(/\s+/g, " ").trim();
  };

  const loadTrip = useCallback(async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      const data = await res.json();
      setTrip(data.trip);
    } catch (error) {
      console.error("Error loading trip:", error);
    }
  }, [tripId]);

  const loadItinerary = useCallback(async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/itinerary`);
      const data = await res.json();
      setDays(data.days || []);
    } catch (error) {
      console.error("Error loading itinerary:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadTrip();
    loadItinerary();
  }, [loadTrip, loadItinerary]);

  const handleAddDay = async (data: {
    day_number: number;
    day_title: string;
    day_description: string;
  }) => {
    const res = await fetch(`/api/trips/${tripId}/itinerary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to add day");

    await loadItinerary();
  };

  const handleOpenEditDayModal = (day: TripItineraryDayWithRelations) => {
    setSelectedDayForEdit({
      id: day.id,
      day_number: day.day_number,
      day_title: day.day_title,
      day_description: day.day_description,
    });
    setShowEditDayModal(true);
  };

  const handleUpdateDay = async (
    dayId: string,
    data: {
      day_number: number;
      day_title: string;
      day_description: string | null;
    }
  ) => {
    const res = await fetch(`/api/trips/${tripId}/itinerary/${dayId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update day");

    await loadItinerary();
  };

  const handleDeleteDay = async (dayId: string) => {
    if (
      !confirm(
        "คุณแน่ใจหรือไม่ที่จะลบวันนี้? กิจกรรมและรูปภาพทั้งหมดจะถูกลบด้วย"
      )
    )
      return;

    try {
      const res = await fetch(`/api/trips/${tripId}/itinerary/${dayId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadItinerary();
      }
    } catch (error) {
      console.error("Error deleting day:", error);
    }
  };

  const handleOpenAddActivityModal = (dayId: string, dayTitle: string) => {
    setSelectedDayForActivity({ id: dayId, title: dayTitle });
    setShowAddActivityModal(true);
  };

  const handleAddActivity = async (data: {
    activity_time: string | null;
    activity_description: string;
  }) => {
    if (!selectedDayForActivity) return;

    const res = await fetch(
      `/api/itinerary/${selectedDayForActivity.id}/activities`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) throw new Error("Failed to add activity");

    await loadItinerary();
  };

  const handleOpenEditActivityModal = (
    activity: TripItineraryActivity,
    dayTitle: string
  ) => {
    setSelectedActivityForEdit({
      id: activity.id,
      activity_time: activity.activity_time,
      activity_description: activity.activity_description,
      dayTitle,
    });
    setShowEditActivityModal(true);
  };

  const handleUpdateActivity = async (
    activityId: string,
    data: { activity_time: string | null; activity_description: string }
  ) => {
    const res = await fetch(`/api/itinerary/activities/${activityId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update activity");

    await loadItinerary();
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบกิจกรรมนี้?")) return;

    try {
      const res = await fetch(`/api/itinerary/activities/${activityId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadItinerary();
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const handleUploadImage = async (
    dayId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const caption = prompt("คำบรรยายรูป (ไม่ระบุก็ได้):");
    if (caption) formData.append("caption", caption);

    setUploadingDayId(dayId);
    setUploadProgress(0);

    try {
      await uploadWithProgress(
        `/api/itinerary/${dayId}/images/upload`,
        formData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      await loadItinerary();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    } finally {
      setUploadingDayId(null);
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?")) return;

    try {
      const res = await fetch(`/api/itinerary/images/${imageId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadItinerary();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const toggleDay = (dayId: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId);
    } else {
      newExpanded.add(dayId);
    }
    setExpandedDays(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">กำลังโหลด...</p>
      </div>
    );
  }

  const existingDayNumbers = days.map((d) => d.day_number);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            กำหนดการเดินทางรายวัน
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{trip?.title}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer px-4 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>เพิ่มวันเดินทาง</span>
          </button>
          <Link
            href={`/admin/trips/${tripId}`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold"
          >
            กลับ
          </Link>
        </div>
      </div>

      {/* Days List */}
      {days.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            ยังไม่มีกำหนดการเดินทาง
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer mt-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold"
          >
            เริ่มเพิ่มวันเดินทาง
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day.id}
              className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Day Header */}
              <div
                onClick={() => toggleDay(day.id)}
                className="flex items-start gap-4 p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-xl"
              >
                <div className="shrink-0 w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                  {day.day_number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                    {day.day_title}
                  </h3>

                  {/* Summary badges */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {day.activities && day.activities.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {day.activities.length} กิจกรรม
                      </span>
                    )}
                    {day.images && day.images.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {day.images.length} รูปภาพ
                      </span>
                    )}
                  </div>

                  {day.day_description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {stripHtml(day.day_description)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditDayModal(day);
                    }}
                    className="cursor-pointer px-3 py-1.5 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 font-semibold text-sm rounded-lg transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDay(day.id);
                    }}
                    className="cursor-pointer px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-semibold text-sm rounded-lg transition-colors"
                  >
                    ลบ
                  </button>
                  <svg
                    className={`w-6 h-6 text-gray-400 dark:text-gray-500 transition-transform ${
                      expandedDays.has(day.id) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Day Content (Expanded) */}
              {expandedDays.has(day.id) && (
                <div className="border-t-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  {/* Full Description */}
                  {day.day_description && (
                    <div className="px-5 pt-4 pb-2">
                      <div
                        className="tiptap flow-root text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: day.day_description,
                        }}
                      />
                    </div>
                  )}

                  <div className="p-5 space-y-6">
                    {/* Activities Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-blue-600 dark:text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path
                              fillRule="evenodd"
                              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          กิจกรรม
                        </h4>
                        <button
                          onClick={() =>
                            handleOpenAddActivityModal(day.id, day.day_title)
                          }
                          className="cursor-pointer flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          เพิ่มกิจกรรม
                        </button>
                      </div>
                      {day.activities && day.activities.length > 0 ? (
                        <div className="space-y-2">
                          {day.activities.map(
                            (activity: TripItineraryActivity) => (
                              <div
                                key={activity.id}
                                className="flex gap-3 items-start p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors group"
                              >
                                {activity.activity_time && (
                                  <span className="shrink-0 px-3 py-1 bg-orange-600 dark:bg-orange-500 text-white font-bold text-sm rounded-md min-w-[70px] text-center">
                                    {activity.activity_time}
                                  </span>
                                )}
                                <span className="flex-1 text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                                  {activity.activity_description}
                                </span>
                                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() =>
                                      handleOpenEditActivityModal(
                                        activity,
                                        day.day_title
                                      )
                                    }
                                    className="cursor-pointer px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-md"
                                  >
                                    แก้ไข
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteActivity(activity.id)
                                    }
                                    className="cursor-pointer px-3 py-1 text-xs bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold rounded-md"
                                  >
                                    ลบ
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                          <svg
                            className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ยังไม่มีกิจกรรม
                          </p>
                          <button
                            onClick={() =>
                              handleOpenAddActivityModal(day.id, day.day_title)
                            }
                            className="cursor-pointer mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                          >
                            + เพิ่มกิจกรรมแรก
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Images Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-green-600 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          รูปภาพ
                        </h4>
                        <label
                          className={`flex items-center gap-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-colors ${
                            uploadingDayId === day.id
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {uploadingDayId === day.id
                            ? "กำลังอัปโหลด..."
                            : "อัปโหลดรูปภาพ"}
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => handleUploadImage(day.id, e)}
                            className="hidden"
                            disabled={uploadingDayId === day.id}
                          />
                        </label>
                      </div>

                      {/* Upload Progress */}
                      {uploadingDayId === day.id && (
                        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <ProgressBar
                            progress={uploadProgress}
                            message="กำลังอัปโหลดรูปภาพ..."
                            showPercentage={true}
                          />
                        </div>
                      )}

                      {day.images && day.images.length > 0 ? (
                        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                          {day.images.map((img: TripItineraryDayImage) => (
                            <div key={img.id} className="relative group">
                              <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-green-400 dark:group-hover:border-green-500 transition-colors">
                                <Image
                                  src={img.storage_url}
                                  alt={
                                    img.alt_text || img.caption || "Day image"
                                  }
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  unoptimized
                                />
                              </div>
                              {img.caption && (
                                <p className="text-xs text-gray-700 dark:text-gray-300 mt-2 font-medium truncate px-1">
                                  {img.caption}
                                </p>
                              )}
                              <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="cursor-pointer absolute top-2 right-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                ลบ
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                          <svg
                            className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ยังไม่มีรูปภาพ
                          </p>
                          <label
                            className={`mt-2 inline-block text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold ${
                              uploadingDayId === day.id
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            {uploadingDayId === day.id
                              ? "กำลังอัปโหลด..."
                              : "+ อัปโหลดรูปภาพแรก"}
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={(e) => handleUploadImage(day.id, e)}
                              className="hidden"
                              disabled={uploadingDayId === day.id}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Day Modal */}
      <AddDayModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddDay}
        existingDayNumbers={existingDayNumbers}
      />

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={showAddActivityModal}
        onClose={() => {
          setShowAddActivityModal(false);
          setSelectedDayForActivity(null);
        }}
        onAdd={handleAddActivity}
        dayTitle={selectedDayForActivity?.title || ""}
      />

      {/* Edit Day Modal */}
      <EditDayModal
        isOpen={showEditDayModal}
        onClose={() => {
          setShowEditDayModal(false);
          setSelectedDayForEdit(null);
        }}
        onUpdate={handleUpdateDay}
        day={selectedDayForEdit}
        existingDayNumbers={existingDayNumbers}
      />

      {/* Edit Activity Modal */}
      <EditActivityModal
        isOpen={showEditActivityModal}
        onClose={() => {
          setShowEditActivityModal(false);
          setSelectedActivityForEdit(null);
        }}
        onUpdate={handleUpdateActivity}
        activity={selectedActivityForEdit}
        dayTitle={selectedActivityForEdit?.dayTitle || ""}
      />
    </div>
  );
}
