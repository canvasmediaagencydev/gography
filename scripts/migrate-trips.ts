/**
 * Migration Script: Migrate Hardcoded Trips to Database
 *
 * This script migrates the hardcoded trip data from the old implementation
 * to the Supabase database.
 *
 * Prerequisites:
 * 1. Supabase project created and configured in .env.local
 * 2. Database schema migration (001_initial_schema.sql) already run
 * 3. Countries data already populated
 *
 * Usage:
 * npx tsx scripts/migrate-trips.ts
 */

import { createClient } from "@supabase/supabase-js";
import { parsePrice, parseSlots } from "../lib/migration-helpers";

// Hardcoded trips from original implementation
const HARDCODED_TRIPS = [
  {
    title: "[ Private ]Arctic Aurora: New Year in Norway & Finland & Denmark",
    dates: "29 ธ.ค. - 6 ม.ค.",
    duration: "9 วัน 7 คืน",
    country: "นอร์เวย์",
    price: "฿229,000",
    slots: "เต็ม",
    image:
      "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80",
    trip_type: "private" as const,
  },
  {
    title: "Aurora Valentine Journey – Lofoten & Finland 2026",
    dates: "13-20 ก.พ.",
    duration: "8 วัน 6 คืน",
    country: "นอร์เวย์",
    price: "฿165,900",
    slots: "รับ 6 ท่าน",
    image:
      "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&q=80",
    trip_type: "group" as const,
  },
  {
    title: "BAIKAL WINTER 2026",
    dates: "21-27 ก.พ.",
    duration: "7 วัน 6 คืน",
    country: "รัสเซีย",
    price: "฿72,900",
    slots: "เหลือ 4 ที่",
    image:
      "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80",
    trip_type: "group" as const,
  },
  {
    title: "ICELAND WINTER - Aurora 2026",
    dates: "25 ก.พ. - 6 มี.ค.",
    duration: "9 วัน 7 คืน",
    country: "ไอซ์แลนด์",
    price: "฿229,000",
    slots: "รับ 8 ท่าน",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    trip_type: "group" as const,
  },
  {
    title: "LOFOTEN WINTER - Aurora 2026",
    dates: "11-17 มี.ค.",
    duration: "7 วัน 5 คืน",
    country: "นอร์เวย์",
    price: "฿89,900",
    slots: "รับ 6 ท่าน",
    image:
      "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&q=80",
    trip_type: "group" as const,
  },
  {
    title: "WINTER IN FINLAND 2026",
    dates: "22-28 มี.ค.",
    duration: "7 วัน 5 คืน",
    country: "ฟินแลนด์",
    price: "฿99,900",
    slots: "รับ 10 ท่าน",
    image:
      "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&q=80",
    trip_type: "group" as const,
  },
];

async function migrateTrips() {
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: Missing Supabase credentials in .env.local");
    console.log("\nPlease ensure you have:");
    console.log("- NEXT_PUBLIC_SUPABASE_URL");
    console.log("- SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  // Create Supabase client with service role key (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("🚀 Starting trip migration...\n");

  // Fetch countries to map names to IDs
  const { data: countries, error: countriesError } = await supabase
    .from("countries")
    .select("*");

  if (countriesError || !countries) {
    console.error("❌ Error fetching countries:", countriesError);
    process.exit(1);
  }

  const countryMap = new Map(countries.map((c) => [c.name_th, c.id]));

  let successCount = 0;
  let errorCount = 0;

  // Migrate each trip
  for (const trip of HARDCODED_TRIPS) {
    try {
      console.log(`📦 Migrating: ${trip.title}`);

      // Get country ID
      const countryId = countryMap.get(trip.country);
      if (!countryId) {
        console.log(
          `   ⚠️  Warning: Country "${trip.country}" not found, skipping...`
        );
        errorCount++;
        continue;
      }

      // Parse price
      const pricePerPerson = parsePrice(trip.price);

      // Create trip
      const { data: createdTrip, error: tripError } = await supabase
        .from("trips")
        .insert({
          title: trip.title,
          country_id: countryId,
          price_per_person: pricePerPerson,
          cover_image_url: trip.image,
          trip_type: trip.trip_type,
          is_active: true,
        })
        .select()
        .single();

      if (tripError || !createdTrip) {
        console.log(`   ❌ Error creating trip:`, tripError?.message);
        errorCount++;
        continue;
      }

      // Parse dates and create schedule
      const availableSeats = parseSlots(trip.slots);

      // Calculate seats based on trip type and slots
      let totalSeats = availableSeats;
      if (trip.slots === "เต็ม") {
        totalSeats = trip.trip_type === "private" ? 2 : 10;
      }

      // Parse dates - for this migration, we'll use 2026 dates
      // You may need to adjust this based on actual dates
      const year = 2026;
      let departureDate: string;
      let returnDate: string;

      // Simple date parsing for common formats
      if (trip.dates.includes("-") && !trip.dates.includes(" - ")) {
        // Format: "13-20 ก.พ."
        const match = trip.dates.match(/(\d+)-(\d+)\s+([ก-๙\.]+)/);
        if (match) {
          const [, day1, day2, monthAbbr] = match;
          const monthMap: Record<string, number> = {
            "ม.ค.": 1,
            "ก.พ.": 2,
            "มี.ค.": 3,
            "เม.ย.": 4,
            "พ.ค.": 5,
            "มิ.ย.": 6,
            "ก.ค.": 7,
            "ส.ค.": 8,
            "ก.ย.": 9,
            "ต.ค.": 10,
            "พ.ย.": 11,
            "ธ.ค.": 12,
          };
          const month = monthMap[monthAbbr];
          departureDate = `${year}-${String(month).padStart(
            2,
            "0"
          )}-${day1.padStart(2, "0")}`;
          returnDate = `${year}-${String(month).padStart(
            2,
            "0"
          )}-${day2.padStart(2, "0")}`;
        } else {
          console.log(
            `   ⚠️  Warning: Could not parse dates "${trip.dates}", using defaults`
          );
          departureDate = `${year}-02-13`;
          returnDate = `${year}-02-20`;
        }
      } else if (trip.dates.includes(" - ")) {
        // Format: "29 ธ.ค. - 6 ม.ค." (year transition)
        const match = trip.dates.match(
          /(\d+)\s+([ก-๙\.]+)\s*-\s*(\d+)\s+([ก-๙\.]+)/
        );
        if (match) {
          const [, day1, month1Abbr, day2, month2Abbr] = match;
          const monthMap: Record<string, number> = {
            "ม.ค.": 1,
            "ก.พ.": 2,
            "มี.ค.": 3,
            "เม.ย.": 4,
            "พ.ค.": 5,
            "มิ.ย.": 6,
            "ก.ค.": 7,
            "ส.ค.": 8,
            "ก.ย.": 9,
            "ต.ค.": 10,
            "พ.ย.": 11,
            "ธ.ค.": 12,
          };
          const month1 = monthMap[month1Abbr];
          const month2 = monthMap[month2Abbr];
          // Handle year transition
          const year1 = month1 === 12 ? year - 1 : year;
          const year2 = month2 < month1 ? year : year1;
          departureDate = `${year1}-${String(month1).padStart(
            2,
            "0"
          )}-${day1.padStart(2, "0")}`;
          returnDate = `${year2}-${String(month2).padStart(
            2,
            "0"
          )}-${day2.padStart(2, "0")}`;
        } else {
          departureDate = `${year}-02-13`;
          returnDate = `${year}-02-20`;
        }
      } else {
        departureDate = `${year}-02-13`;
        returnDate = `${year}-02-20`;
      }

      // Create schedule
      const { error: scheduleError } = await supabase
        .from("trip_schedules")
        .insert({
          trip_id: createdTrip.id,
          departure_date: departureDate,
          return_date: returnDate,
          registration_deadline: departureDate, // Set deadline same as departure for now
          total_seats: totalSeats,
          available_seats: availableSeats,
          is_active: true,
        });

      if (scheduleError) {
        console.log(
          `   ⚠️  Trip created but schedule failed:`,
          scheduleError.message
        );
      } else {
        console.log(`   ✅ Successfully migrated with schedule`);
        successCount++;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`   ❌ Error:`, error.message);
      } else {
        console.log(`   ❌ Error:`, error);
      }
      errorCount++;
    }
  }

  console.log("\n📊 Migration Summary:");
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${HARDCODED_TRIPS.length}`);
  console.log("\n✨ Migration complete!");
}

// Run migration
migrateTrips().catch(console.error);
