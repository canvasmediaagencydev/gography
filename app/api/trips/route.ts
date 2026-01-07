import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for creating a trip
const createTripSchema = z.object({
  title: z.string().min(3, "ชื่อทริปต้องมีอย่างน้อย 3 ตัวอักษร").max(255),
  description: z.string().optional(),
  country_id: z.string().uuid("ประเทศไม่ถูกต้อง"),
  price_per_person: z.number().positive("ราคาต้องมากกว่า 0"),
  cover_image_url: z
    .string()
    .url("URL รูปภาพไม่ถูกต้อง")
    .optional()
    .or(z.literal("")),
  file_link: z.string().url("URL ไฟล์ไม่ถูกต้อง").optional().or(z.literal("")),
  trip_type: z.enum(["group", "private"]).default("group"),
  is_active: z.boolean().default(true),
  slug: z.string().optional(),
});

// GET /api/trips - List all trips (admin view with pagination)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Filters
    const country_id = searchParams.get("country_id");
    const trip_type = searchParams.get("trip_type");
    const is_active = searchParams.get("is_active");
    const search = searchParams.get("search");

    // Build query
    let query = supabase
      .from("trips")
      .select(
        `
        *,
        country:countries(*),
        trip_schedules(*)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (country_id) {
      query = query.eq("country_id", country_id);
    }
    if (trip_type) {
      query = query.eq("trip_type", trip_type);
    }
    if (is_active !== null && is_active !== undefined && is_active !== "") {
      query = query.eq("is_active", is_active === "true");
    }
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    // Apply pagination
    const { data: trips, error, count } = await query.range(from, to);

    if (error) {
      console.error("Error fetching trips:", error);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการดึงข้อมูลทริป" },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json({
      trips,
      totalCount: count || 0,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}

// POST /api/trips - Create new trip
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validationResult = createTripSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "ข้อมูลไม่ถูกต้อง",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const tripData = validationResult.data;

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Create trip
    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        ...tripData,
        created_by: user?.id,
      })
      .select(
        `
        *,
        country:countries(*)
      `
      )
      .single();

    if (error) {
      console.error("Error creating trip:", error);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการสร้างทริป" },
        { status: 500 }
      );
    }

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
