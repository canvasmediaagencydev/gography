import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import {
  formatPrice,
  formatThaiDateRange,
  formatDurationThai,
  calculateDuration,
  formatSlotsDisplay,
} from "@/lib/migration-helpers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/trips/[id]/public - Get single trip for public display
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const previewMode =
      request.nextUrl.searchParams.get("preview") === "1" ||
      request.nextUrl.searchParams.get("preview") === "true";

    // Check if id is a UUID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    // Fetch trip with country relation
    let tripQuery = supabase.from("trips").select(`
        *,
        country:countries(*)
      `);

    if (isUUID) {
      tripQuery = tripQuery.eq("id", id);
    } else {
      tripQuery = tripQuery.eq("slug", id);
    }

    if (!previewMode) {
      tripQuery = tripQuery.eq("is_active", true);
    }

    const { data: trip, error: tripError } = await tripQuery.single();

    if (tripError || !trip) {
      return NextResponse.json({ error: "ไม่พบทริปนี้" }, { status: 404 });
    }

    // Use the actual UUID from the fetched trip for all related queries
    const tripId = trip.id;

    // Fetch active schedules with future dates only
    const today = new Date().toISOString().split("T")[0];
    const { data: schedulesData, error: schedulesError } = await supabase
      .from("trip_schedules")
      .select("*")
      .eq("trip_id", tripId)
      .eq("is_active", true)
      .gte("departure_date", today)
      .order("departure_date", { ascending: true });

    if (schedulesError) {
      console.error("Error fetching schedules:", schedulesError);
    }

    const schedules = schedulesData || [];

    // Format schedules for public display
    const formattedSchedules = schedules.map((schedule) => {
      const duration = calculateDuration(
        schedule.departure_date,
        schedule.return_date
      );
      const dateRange = formatThaiDateRange(
        schedule.departure_date,
        schedule.return_date
      );

      return {
        id: schedule.id,
        departure_date: schedule.departure_date,
        return_date: schedule.return_date,
        registration_deadline: schedule.registration_deadline,
        dates: dateRange,
        duration: formatDurationThai(duration.days, duration.nights),
        available_seats: schedule.available_seats,
        total_seats: schedule.total_seats,
        slots: formatSlotsDisplay(
          schedule.available_seats,
          schedule.total_seats
        ),
        is_active: schedule.is_active,
      };
    });

    // Fetch gallery images for this trip
    const { data: galleryImages, error: galleryError } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("trip_id", tripId)
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });

    if (galleryError) {
      console.error("Error fetching gallery:", galleryError);
    }

    const gallery = galleryImages || [];

    // Fetch itinerary with activities and images
    const { data: itineraryDays, error: itineraryError } = await supabase
      .from("trip_itinerary_days")
      .select(
        `
        *,
        activities:trip_itinerary_activities(*),
        images:trip_itinerary_day_images(*)
      `
      )
      .eq("trip_id", tripId)
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .order("day_number", { ascending: true });

    if (itineraryError) {
      console.error("Error fetching itinerary:", itineraryError);
    }

    // Sort activities and images within each day
    const sortedItinerary = (itineraryDays || []).map((day: any) => ({
      ...day,
      activities: (day.activities || []).sort((a: any, b: any) => {
        if (a.order_index !== b.order_index) {
          return a.order_index - b.order_index;
        }
        if (a.activity_time && b.activity_time) {
          return a.activity_time.localeCompare(b.activity_time);
        }
        return 0;
      }),
      images: (day.images || []).sort(
        (a: any, b: any) => a.order_index - b.order_index
      ),
    }));

    // Fetch FAQs with images
    const { data: faqsData, error: faqsError } = await supabase
      .from("trip_faqs")
      .select(
        `
        *,
        images:trip_faq_images(*)
      `
      )
      .eq("trip_id", tripId)
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (faqsError) {
      console.error("Error fetching FAQs:", faqsError);
    }

    // Sort images within each FAQ
    const sortedFaqs = (faqsData || []).map((faq: any) => ({
      ...faq,
      images: (faq.images || []).sort(
        (a: any, b: any) => a.order_index - b.order_index
      ),
    }));

    // Format trip data for public display
    const publicTripData = {
      trip: {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        country: {
          name_th: trip.country?.name_th || "",
          name_en: trip.country?.name_en || "",
          flag_emoji: trip.country?.flag_emoji || "",
          code: trip.country?.code || "",
        },
        price_per_person: trip.price_per_person,
        formatted_price: formatPrice(trip.price_per_person),
        cover_image_url: trip.cover_image_url,
        file_link: trip.file_link,
        trip_type: trip.trip_type,
        slug: trip.slug,
      },
      schedules: formattedSchedules,
      gallery: gallery.map((img) => ({
        id: img.id,
        storage_url: img.storage_url,
        title: img.title,
        description: img.description,
        alt_text: img.alt_text,
        order_index: img.order_index,
      })),
      itinerary: sortedItinerary,
      faqs: sortedFaqs,
    };

    return NextResponse.json(publicTripData);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
