import { User as SupabaseUser } from "@supabase/auth-js";

export interface User extends SupabaseUser {
  username?: string;
  profile_image?: string | null;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  like_count?: number;
  dislike_count?: number;
  likeCount?: number;
  dislikeCount?: number;
  users?: {
    email: string;
    profile_image: string | null;
  };
}

export interface Comment {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
}


export interface Mission {
  id: string;
  user_id: string;
  name: string;
  description: string;
  total_days: number;
  status: string;
  created_at: string;   // İstersen Date yapabilirsin: Date
  updated_at: string;   // İstersen Date yapabilirsin: Date
  completed_days?: number;
  skipped_days?: number;
}

export interface MissionDay {
  id: string;
  mission_id: string;
  user_id: string;
  day_number: number;
  status: "pending" | "completed" | "skipped";
  created_at: string;
  updated_at: string;
}