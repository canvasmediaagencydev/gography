// Database types for Gography Admin System
// To regenerate from your Supabase project:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string
          code: string
          name_th: string
          name_en: string
          flag_emoji: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name_th: string
          name_en: string
          flag_emoji?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name_th?: string
          name_en?: string
          flag_emoji?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          title: string
          description: string | null
          country_id: string | null
          price_per_person: number
          cover_image_url: string | null
          file_link: string | null
          trip_type: 'group' | 'private'
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          country_id?: string | null
          price_per_person: number
          cover_image_url?: string | null
          file_link?: string | null
          trip_type?: 'group' | 'private'
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          country_id?: string | null
          price_per_person?: number
          cover_image_url?: string | null
          file_link?: string | null
          trip_type?: 'group' | 'private'
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trip_schedules: {
        Row: {
          id: string
          trip_id: string | null
          departure_date: string
          return_date: string
          registration_deadline: string
          total_seats: number
          available_seats: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id?: string | null
          departure_date: string
          return_date: string
          registration_deadline: string
          total_seats: number
          available_seats: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string | null
          departure_date?: string
          return_date?: string
          registration_deadline?: string
          total_seats?: number
          available_seats?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gallery_images: {
        Row: {
          id: string
          storage_path: string
          storage_url: string
          file_name: string
          file_size: number | null
          mime_type: string | null
          country_id: string | null
          trip_id: string | null
          title: string
          description: string | null
          alt_text: string | null
          is_highlight: boolean
          order_index: number
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          storage_path: string
          storage_url: string
          file_name: string
          file_size?: number | null
          mime_type?: string | null
          country_id?: string | null
          trip_id?: string | null
          title: string
          description?: string | null
          alt_text?: string | null
          is_highlight?: boolean
          order_index?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          storage_path?: string
          storage_url?: string
          file_name?: string
          file_size?: number | null
          mime_type?: string | null
          country_id?: string | null
          trip_id?: string | null
          title?: string
          description?: string | null
          alt_text?: string | null
          is_highlight?: boolean
          order_index?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type Country = Tables<'countries'>
export type Trip = Tables<'trips'>
export type TripSchedule = Tables<'trip_schedules'>
export type AdminUser = Tables<'admin_users'>
export type GalleryImage = Tables<'gallery_images'>

// Extended types with relations
export interface TripWithRelations extends Trip {
  country?: Country | null
  trip_schedules?: TripSchedule[]
  nextSchedule?: TripSchedule | null
}

export interface TripScheduleWithTrip extends TripSchedule {
  trip?: Trip | null
}

// API response types
export interface TripsListResponse {
  trips: TripWithRelations[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export interface PublicTripDisplay {
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

export interface PublicScheduleDisplay {
  id: string
  departure_date: string
  return_date: string
  dates: string
  duration: string
  available_seats: number
  total_seats: number
  slots: string
  is_active: boolean
}

// Gallery types with relations
export interface GalleryImageWithRelations extends GalleryImage {
  country?: Country | null
  trip?: Trip | null
}

// Gallery API response types
export interface GalleryImagesListResponse {
  images: GalleryImageWithRelations[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export interface GalleryImageUploadResult {
  image: GalleryImageWithRelations
  storagePath: string
  publicUrl: string
}
