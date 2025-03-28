// lib/helpers/enrichComments.ts

import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export async function enrichCommentsWithUsers(comments: any[]) {
  const userIds = [...new Set(comments.map((c) => c.user_id))];
  const { data: users } = await supabase
    .from("users")
    .select("id, email, profile_image")
    .in("id", userIds);

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return comments.map((comment) => ({
    ...comment,
    user: userMap[comment.user_id] || { email: "Bilinmeyen", profile_image: null },
  }));
}
