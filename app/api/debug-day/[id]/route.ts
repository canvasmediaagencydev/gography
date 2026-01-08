import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trip_itinerary_days")
    .select("day_description")
    .eq("id", id)
    .single();

  return NextResponse.json({
    storedHtml: data?.day_description,
    error,
  });
}
