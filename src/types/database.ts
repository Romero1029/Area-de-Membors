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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          role: 'student' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'student' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'student' | 'admin'
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          thumbnail_url: string | null
          product_type: 'course' | 'ebook' | 'bundle'
          is_published: boolean
          sort_order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          product_type?: 'course' | 'ebook' | 'bundle'
          is_published?: boolean
          sort_order?: number
          created_by?: string | null
        }
        Update: {
          slug?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          product_type?: 'course' | 'ebook' | 'bundle'
          is_published?: boolean
          sort_order?: number
        }
      }
      modules: {
        Row: {
          id: string
          product_id: string
          title: string
          description: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          title: string
          description?: string | null
          sort_order?: number
        }
        Update: {
          title?: string
          description?: string | null
          sort_order?: number
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          lesson_type: 'video' | 'text' | 'file'
          video_url: string | null
          video_duration: number | null
          content: string | null
          file_url: string | null
          is_free_preview: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          lesson_type?: 'video' | 'text' | 'file'
          video_url?: string | null
          video_duration?: number | null
          content?: string | null
          file_url?: string | null
          is_free_preview?: boolean
          sort_order?: number
        }
        Update: {
          title?: string
          description?: string | null
          lesson_type?: 'video' | 'text' | 'file'
          video_url?: string | null
          video_duration?: number | null
          content?: string | null
          file_url?: string | null
          is_free_preview?: boolean
          sort_order?: number
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          product_id: string
          enrolled_at: string
          expires_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          expires_at?: string | null
          is_active?: boolean
        }
        Update: {
          expires_at?: string | null
          is_active?: boolean
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
          watch_seconds: number
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
          watch_seconds?: number
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          watch_seconds?: number
        }
      }
    }
    Views: {
      course_progress: {
        Row: {
          user_id: string
          product_id: string
          total_lessons: number
          completed_lessons: number
          percent_complete: number
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_enrolled: {
        Args: { p_product_id: string }
        Returns: boolean
      }
    }
    Enums: {}
  }
}
