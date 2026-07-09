/**
 * Hand-written until a live Supabase project exists. Once you run
 * `supabase gen types typescript --project-id <id> > src/lib/types/database.types.ts`
 * against the real project, this file should be replaced wholesale - keep
 * the shape below in sync with supabase/migrations/0001_init.sql until then.
 */
export interface Database {
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
          created_at?: string;
        };
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
      };
    };
  };
}
