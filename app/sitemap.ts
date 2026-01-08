import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gography.net";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/trips`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/private-trips`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Fetch all active trips for dynamic URLs using direct Supabase query
  let tripPages: MetadataRoute.Sitemap = [];

  try {
    // Create Supabase client directly to avoid API fetch issues during build
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data: trips, error } = await supabase
        .from("trips")
        .select("id, slug, updated_at, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && trips) {
        tripPages = trips.map((trip) => ({
          url: `${baseUrl}/trips/${trip.slug || trip.id}`,
          lastModified: new Date(trip.updated_at || trip.created_at),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error("Error generating sitemap for trips:", error);
  }

  return [...staticPages, ...tripPages];
}
