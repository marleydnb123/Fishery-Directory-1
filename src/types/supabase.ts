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
      fisheries: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          rules: string
          image: string
          species: string[]
          district: string
          isFeatured: boolean
          hasAccommodation: boolean
          created_at: string
          website?: string
          contact_phone?: string
          contact_email?: string
          address?: string
          postcode?: string
          day_ticket_price?: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          rules: string
          image: string
          species: string[]
          district: string
          isFeatured?: boolean
          hasAccommodation?: boolean
          created_at?: string
          website?: string
          contact_phone?: string
          contact_email?: string
          address?: string
          postcode?: string
          day_ticket_price?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          rules?: string
          image?: string
          species?: string[]
          district?: string
          isFeatured?: boolean
          hasAccommodation?: boolean
          created_at?: string
          website?: string
          contact_phone?: string
          contact_email?: string
          address?: string
          postcode?: string
          day_ticket_price?: number
        }
      }
      lakes: {
        Row: {
          id: string
          fishery_id: string
          name: string
          description: string
          species: string[]
          size_acres?: number
          max_depth_ft?: number
          pegs?: number
          created_at: string
        }
        Insert: {
          id?: string
          fishery_id: string
          name: string
          description: string
          species: string[]
          size_acres?: number
          max_depth_ft?: number
          pegs?: number
          created_at?: string
        }
        Update: {
          id?: string
          fishery_id?: string
          name?: string
          description?: string
          species?: string[]
          size_acres?: number
          max_depth_ft?: number
          pegs?: number
          created_at?: string
        }
      }
      accommodation: {
        Row: {
          id: string
          fishery_id: string
          type: string
          price: number
          notes: string
          image?: string
          created_at: string
          featured: boolean
        }
        Insert: {
          id?: string
          fishery_id: string
          type: string
          price: number
          notes: string
          image?: string
          created_at?: string
          featured: boolean
        }
        Update: {
          id?: string
          fishery_id?: string
          type?: string
          price?: number
          notes?: string
          image?: string
          created_at?: string
          featured: boolean
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
        }
      }
      tackle_shops: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          image: string
          address: string
          postcode: string
          website?: string
          phone?: string
          email?: string
          opening_hours?: Json
          brands: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          image: string
          address: string
          postcode: string
          website?: string
          phone?: string
          email?: string
          opening_hours?: Json
          brands: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          image?: string
          address?: string
          postcode?: string
          website?: string
          phone?: string
          email?: string
          opening_hours?: Json
          brands?: string[]
          created_at?: string
        }
      }
    }
  }
}