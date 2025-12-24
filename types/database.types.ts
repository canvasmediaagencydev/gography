// Database types for Gography Admin System
// Auto-generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string | null
          flag_emoji: string | null
          id: string
          is_active: boolean | null
          name_en: string
          name_th: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          flag_emoji?: string | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_th: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          flag_emoji?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_th?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          country_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          file_name: string
          file_size: number | null
          id: string
          is_active: boolean | null
          is_highlight: boolean | null
          mime_type: string | null
          order_index: number | null
          storage_path: string
          storage_url: string
          title: string
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          country_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          is_highlight?: boolean | null
          mime_type?: string | null
          order_index?: number | null
          storage_path: string
          storage_url: string
          title: string
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          country_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          is_highlight?: boolean | null
          mime_type?: string | null
          order_index?: number | null
          storage_path?: string
          storage_url?: string
          title?: string
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_faq_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          created_by: string | null
          faq_id: string
          file_name: string
          file_size: number | null
          id: string
          is_active: boolean | null
          mime_type: string | null
          order_index: number | null
          storage_path: string
          storage_url: string
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          created_by?: string | null
          faq_id: string
          file_name: string
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          order_index?: number | null
          storage_path: string
          storage_url: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          created_by?: string | null
          faq_id?: string
          file_name?: string
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          order_index?: number | null
          storage_path?: string
          storage_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_faqs: {
        Row: {
          answer: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          question: string
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question: string
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question?: string
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_itinerary_activities: {
        Row: {
          activity_description: string
          activity_time: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          itinerary_day_id: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          activity_description: string
          activity_time?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          itinerary_day_id: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          activity_description?: string
          activity_time?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          itinerary_day_id?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_itinerary_day_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          created_by: string | null
          file_name: string
          file_size: number | null
          id: string
          is_active: boolean | null
          itinerary_day_id: string
          mime_type: string | null
          order_index: number | null
          storage_path: string
          storage_url: string
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          created_by?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          itinerary_day_id: string
          mime_type?: string | null
          order_index?: number | null
          storage_path: string
          storage_url: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          created_by?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          itinerary_day_id?: string
          mime_type?: string | null
          order_index?: number | null
          storage_path?: string
          storage_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_itinerary_days: {
        Row: {
          created_at: string | null
          created_by: string | null
          day_description: string | null
          day_number: number
          day_title: string
          id: string
          is_active: boolean | null
          order_index: number | null
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          day_description?: string | null
          day_number: number
          day_title: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          day_description?: string | null
          day_number?: number
          day_title?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_schedules: {
        Row: {
          available_seats: number
          created_at: string | null
          departure_date: string
          id: string
          is_active: boolean | null
          registration_deadline: string
          return_date: string
          total_seats: number
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          available_seats: number
          created_at?: string | null
          departure_date: string
          id?: string
          is_active?: boolean | null
          registration_deadline: string
          return_date: string
          total_seats: number
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          available_seats?: number
          created_at?: string | null
          departure_date?: string
          id?: string
          is_active?: boolean | null
          registration_deadline?: string
          return_date?: string
          total_seats?: number
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          country_id: string | null
          cover_image_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          file_link: string | null
          id: string
          is_active: boolean | null
          price_per_person: number
          title: string
          trip_type: string | null
          updated_at: string | null
        }
        Insert: {
          country_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_link?: string | null
          id?: string
          is_active?: boolean | null
          price_per_person: number
          title: string
          trip_type?: string | null
          updated_at?: string | null
        }
        Update: {
          country_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_link?: string | null
          id?: string
          is_active?: boolean | null
          price_per_person?: number
          title?: string
          trip_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for FAQ
export type TripFAQ = Database['public']['Tables']['trip_faqs']['Row']
export type TripFAQImage = Database['public']['Tables']['trip_faq_images']['Row']
export type TripFAQWithImages = TripFAQ & {
  images?: TripFAQImage[]
}

// Existing helper types
export type Trip = Database['public']['Tables']['trips']['Row']
export type Country = Database['public']['Tables']['countries']['Row']
export type TripSchedule = Database['public']['Tables']['trip_schedules']['Row']
export type GalleryImage = Database['public']['Tables']['gallery_images']['Row']

export type TripWithRelations = Trip & {
  country?: Country
  trip_schedules?: TripSchedule[]
}

export type GalleryImageWithRelations = GalleryImage & {
  country?: Country
  trip?: Trip
}

// Helper types for Itinerary
export type TripItineraryDay = Database['public']['Tables']['trip_itinerary_days']['Row']
export type TripItineraryActivity = Database['public']['Tables']['trip_itinerary_activities']['Row']
export type TripItineraryDayImage = Database['public']['Tables']['trip_itinerary_day_images']['Row']

export type TripItineraryDayWithRelations = TripItineraryDay & {
  activities?: TripItineraryActivity[]
  images?: TripItineraryDayImage[]
}

// Helper types for Public Trip Display
export type PublicScheduleDisplay = {
  id: string
  departure_date: string
  return_date: string
  dates: string
  duration: string
  available_seats: number
  total_seats: number
  slots: string
  is_active: boolean | null
}

export type PublicTripDisplay = {
  id: string
  title: string
  image: string
  dates: string
  duration: string
  country: string
  flag: string
  price: string
  slots: string
  trip_type: 'group' | 'private'
  schedules: PublicScheduleDisplay[]
}
