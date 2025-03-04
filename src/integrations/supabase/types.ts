export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chapters: {
        Row: {
          chapter: string
          chunk_id: number
          content: string
          id: number
          search_vector: unknown | null
        }
        Insert: {
          chapter: string
          chunk_id: number
          content: string
          id?: number
          search_vector?: unknown | null
        }
        Update: {
          chapter?: string
          chunk_id?: number
          content?: string
          id?: number
          search_vector?: unknown | null
        }
        Relationships: []
      }
      medical_topics: {
        Row: {
          created_at: string | null
          description: string | null
          parent_topic_id: string | null
          topic_id: string
          topic_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          parent_topic_id?: string | null
          topic_id: string
          topic_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          parent_topic_id?: string | null
          topic_id?: string
          topic_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_topics_parent_topic_id_fkey"
            columns: ["parent_topic_id"]
            isOneToOne: false
            referencedRelation: "medical_topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      nelson_chunks: {
        Row: {
          chunk_id: string
          content: string
        }
        Insert: {
          chunk_id: string
          content: string
        }
        Update: {
          chunk_id?: string
          content?: string
        }
        Relationships: []
      }
      nelson_qa: {
        Row: {
          id: number
          input: string | null
          instruction: string
          output: string
          search_vector: unknown | null
        }
        Insert: {
          id?: number
          input?: string | null
          instruction: string
          output: string
          search_vector?: unknown | null
        }
        Update: {
          id?: number
          input?: string | null
          instruction?: string
          output?: string
          search_vector?: unknown | null
        }
        Relationships: []
      }
      search_feedback: {
        Row: {
          created_at: string | null
          feedback_id: string
          feedback_text: string | null
          rating: number | null
          search_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_id?: string
          feedback_text?: string | null
          rating?: number | null
          search_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_id?: string
          feedback_text?: string | null
          rating?: number | null
          search_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_feedback_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "search_history"
            referencedColumns: ["search_id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string | null
          query: string
          response_chunks: string[] | null
          search_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          query: string
          response_chunks?: string[] | null
          search_id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          query?: string
          response_chunks?: string[] | null
          search_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      topic_chunks: {
        Row: {
          chapter: number
          chunk_id: string | null
          content: number | null
          Content: string | null
        }
        Insert: {
          chapter?: number
          chunk_id?: string | null
          content?: number | null
          Content?: string | null
        }
        Update: {
          chapter?: number
          chunk_id?: string | null
          content?: number | null
          Content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_chunks_chunk_id_fkey"
            columns: ["chunk_id"]
            isOneToOne: false
            referencedRelation: "nelson_chunks"
            referencedColumns: ["chunk_id"]
          },
          {
            foreignKeyName: "topic_chunks_Content_fkey"
            columns: ["Content"]
            isOneToOne: false
            referencedRelation: "medical_topics"
            referencedColumns: ["topic_id"]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
