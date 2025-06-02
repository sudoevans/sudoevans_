export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      resources: {
        Row: {
          id: string
          name: string
          type: string
          category: string
          description: string
          download_url: string
          author: string
          size: string | null
          date: string
          status: "pending" | "approved" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          category: string
          description: string
          download_url: string
          author: string
          size?: string | null
          date?: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          category?: string
          description?: string
          download_url?: string
          author?: string
          size?: string | null
          date?: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
      download_tracking: {
        Row: {
          id: string
          resource_id: string
          ip_address: string | null
          user_agent: string | null
          downloaded_at: string
        }
        Insert: {
          id?: string
          resource_id: string
          ip_address?: string | null
          user_agent?: string | null
          downloaded_at?: string
        }
        Update: {
          id?: string
          resource_id?: string
          ip_address?: string | null
          user_agent?: string | null
          downloaded_at?: string
        }
      }
      resource_likes: {
        Row: {
          id: string
          resource_id: string
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          resource_id: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          resource_id?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      subscribers: {
        Row: {
          id: string
          email: string
          is_active: boolean
          subscribed_at: string
          last_email_sent: string | null
          unsubscribe_token: string
        }
        Insert: {
          id?: string
          email: string
          is_active?: boolean
          subscribed_at?: string
          last_email_sent?: string | null
          unsubscribe_token?: string
        }
        Update: {
          id?: string
          email?: string
          is_active?: boolean
          subscribed_at?: string
          last_email_sent?: string | null
          unsubscribe_token?: string
        }
      }
      guestbook_entries: {
        Row: {
          id: string
          name: string
          message: string
          location: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          message: string
          location?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          message?: string
          location?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          username: string
          password_hash: string
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          created_at?: string
          last_login?: string | null
        }
      }
      admin_sessions: {
        Row: {
          id: string
          admin_id: string
          session_token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          session_token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          session_token?: string
          expires_at?: string
          created_at?: string
        }
      }
    }
  }
}
