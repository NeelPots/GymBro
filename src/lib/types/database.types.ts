/**
 * Hand-written until a live Supabase project exists. Once you run
 * `supabase gen types typescript --project-id <id> > src/lib/types/database.types.ts`
 * against the real project, this file should be replaced wholesale - keep
 * the shape below in sync with supabase/migrations/*.sql until then.
 *
 * Every table needs `Relationships: []` and the schema needs
 * `Views`/`Functions`/`Enums`/`CompositeTypes` (even empty) - newer
 * @supabase/supabase-js versions constrain their generics against the
 * `GenericSchema`/`GenericTable` shapes from @supabase/postgrest-js, and
 * without these the whole schema silently collapses to `never`, breaking
 * .select()/.insert() type inference everywhere.
 */
export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          default_reps: number;
          default_sets: number;
          difficulty_tier: number;
          source: "system" | "user_submitted";
          submitted_by: string | null;
          moderation_status: "approved" | "pending" | "rejected";
          is_public: boolean;
          instructions: string | null;
          easier_variation: string | null;
          harder_variation: string | null;
          video_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description?: string | null;
          default_reps: number;
          default_sets: number;
          difficulty_tier?: number;
          source?: "system" | "user_submitted";
          submitted_by?: string | null;
          moderation_status?: "approved" | "pending" | "rejected";
          is_public?: boolean;
          instructions?: string | null;
          easier_variation?: string | null;
          harder_variation?: string | null;
          video_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          default_reps?: number;
          default_sets?: number;
          difficulty_tier?: number;
          source?: "system" | "user_submitted";
          submitted_by?: string | null;
          moderation_status?: "approved" | "pending" | "rejected";
          is_public?: boolean;
          instructions?: string | null;
          easier_variation?: string | null;
          harder_variation?: string | null;
          video_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      session_logs: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          logged_date: string;
          target_reps: number;
          target_sets: number;
          completed_reps: number;
          completed_sets: number;
          rpe: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          logged_date: string;
          target_reps: number;
          target_sets: number;
          completed_reps: number;
          completed_sets: number;
          rpe: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string;
          logged_date?: string;
          target_reps?: number;
          target_sets?: number;
          completed_reps?: number;
          completed_sets?: number;
          rpe?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          caption: string | null;
          media_url: string;
          media_type: "image" | "video";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          caption?: string | null;
          media_url: string;
          media_type?: "image" | "video";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          caption?: string | null;
          media_url?: string;
          media_type?: "image" | "video";
          created_at?: string;
        };
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          media_url: string;
          media_type: "image" | "video";
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          media_url: string;
          media_type?: "image" | "video";
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          media_url?: string;
          media_type?: "image" | "video";
          created_at?: string;
          expires_at?: string;
        };
        Relationships: [];
      };
      post_likes: {
        Row: {
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
