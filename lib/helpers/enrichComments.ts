// lib/helpers/enrichComments.ts

import { createClient } from "@/utils/supabase/client";
import { Comment } from "@/types/types";

// Define a simplified user type for the enriched comments
interface CommentUser {
  id?: string;
  email: string;
  profile_image: string | null;
}

const supabase = createClient();

// Update return type annotation
export async function enrichCommentsWithUsers(comments: Comment[]): Promise<Array<Comment & { user: CommentUser }>> {
  if (!comments.length) return [];
  
  const userIds = [...new Set(comments.map((c) => c.user_id))];
  const { data: users } = await supabase
    .from("users")
    .select("id, email, profile_image")
    .in("id", userIds);

  interface DbUser {
    id: string;
    email: string;
    profile_image: string | null;
  }

  const userMap = Object.fromEntries((users || []).map((u: DbUser) => [u.id, u]));

  return comments.map((comment) => ({
    ...comment,
    user: userMap[comment.user_id] || { email: "Bilinmeyen", profile_image: null },
  }));
}