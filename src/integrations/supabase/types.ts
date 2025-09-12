export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string
          description: string
          icon: string
          id: string
          points_earned: number | null
          student_id: string
          title: string
          unlocked_at: string
        }
        Insert: {
          achievement_type: string
          description: string
          icon: string
          id?: string
          points_earned?: number | null
          student_id: string
          title: string
          unlocked_at?: string
        }
        Update: {
          achievement_type?: string
          description?: string
          icon?: string
          id?: string
          points_earned?: number | null
          student_id?: string
          title?: string
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          ai_analysis: Json | null
          assessment_type: string
          completed_at: string
          confidence_scores: Json | null
          content: Json
          created_at: string
          detected_disorders: string[] | null
          id: string
          responses: Json
          student_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          assessment_type: string
          completed_at?: string
          confidence_scores?: Json | null
          content: Json
          created_at?: string
          detected_disorders?: string[] | null
          id?: string
          responses: Json
          student_id: string
        }
        Update: {
          ai_analysis?: Json | null
          assessment_type?: string
          completed_at?: string
          confidence_scores?: Json | null
          content?: Json
          created_at?: string
          detected_disorders?: string[] | null
          id?: string
          responses?: Json
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_disorders: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          symptoms: string[]
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          symptoms: string[]
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          symptoms?: string[]
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          activities: Json
          created_at: string
          current_activity_index: number | null
          difficulty_level: number | null
          disorder_type: string
          id: string
          is_active: boolean | null
          student_id: string
          updated_at: string
        }
        Insert: {
          activities: Json
          created_at?: string
          current_activity_index?: number | null
          difficulty_level?: number | null
          disorder_type: string
          id?: string
          is_active?: boolean | null
          student_id: string
          updated_at?: string
        }
        Update: {
          activities?: Json
          created_at?: string
          current_activity_index?: number | null
          difficulty_level?: number | null
          disorder_type?: string
          id?: string
          is_active?: boolean | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          full_name: string
          grade_level: string | null
          id: string
          primary_language: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          full_name: string
          grade_level?: string | null
          id?: string
          primary_language?: string | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          created_at?: string
          full_name?: string
          grade_level?: string | null
          id?: string
          primary_language?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progress_tracking: {
        Row: {
          activity_id: string
          activity_type: string
          completed: boolean | null
          created_at: string
          id: string
          improvements: Json | null
          mistakes: Json | null
          score: number | null
          session_date: string
          student_id: string
          time_spent: number
        }
        Insert: {
          activity_id: string
          activity_type: string
          completed?: boolean | null
          created_at?: string
          id?: string
          improvements?: Json | null
          mistakes?: Json | null
          score?: number | null
          session_date?: string
          student_id: string
          time_spent: number
        }
        Update: {
          activity_id?: string
          activity_type?: string
          completed?: boolean | null
          created_at?: string
          id?: string
          improvements?: Json | null
          mistakes?: Json | null
          score?: number | null
          session_date?: string
          student_id?: string
          time_spent?: number
        }
        Relationships: [
          {
            foreignKeyName: "progress_tracking_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_analytics: {
        Row: {
          activities_completed: number | null
          created_at: string
          current_level: number | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          monthly_progress: Json | null
          student_id: string
          time_spent_learning: number | null
          total_points: number | null
          updated_at: string
          weekly_goals: Json | null
        }
        Insert: {
          activities_completed?: number | null
          created_at?: string
          current_level?: number | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          monthly_progress?: Json | null
          student_id: string
          time_spent_learning?: number | null
          total_points?: number | null
          updated_at?: string
          weekly_goals?: Json | null
        }
        Update: {
          activities_completed?: number | null
          created_at?: string
          current_level?: number | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          monthly_progress?: Json | null
          student_id?: string
          time_spent_learning?: number | null
          total_points?: number | null
          updated_at?: string
          weekly_goals?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "student_analytics_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
