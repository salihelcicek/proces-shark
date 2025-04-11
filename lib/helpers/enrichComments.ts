// lib/helpers/enrichComments.ts

import { createClient } from "@/utils/supabase/client";
import { Comment, User } from "@/types/types"; // Add type imports

const supabase = createClient();

export async function enrichCommentsWithUsers(comments: Comment[]) {
  if (!comments.length) return [];
  
  const userIds = [...new Set(comments.map((c) => c.user_id))];
  const { data: users } = await supabase
    .from("users")
    .select("id, email, profile_image")
    .in("id", userIds);

  const userMap = Object.fromEntries((users || []).map((u: User) => [u.id, u]));

  return comments.map((comment) => ({
    ...comment,
    user: userMap[comment.user_id] || { email: "Bilinmeyen", profile_image: null },
  }));
}