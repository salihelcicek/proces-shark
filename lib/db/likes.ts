import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function likeBlog(blogId: string, userId: string) {
  const { data, error } = await supabase
    .from("likes")
    .upsert(
      {
        blog_id: blogId,
        user_id: userId,
        type: "like",
      },
      { onConflict: "blog_id, user_id" }
    );

  if (error) {
    console.error("Like eklenemedi:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

export async function dislikeBlog(blogId: string, userId: string) {
  const { data, error } = await supabase
    .from("likes")
    .upsert(
      {
        blog_id: blogId,
        user_id: userId,
        type: "dislike",
      },
      { onConflict: "blog_id, user_id" }
    );

  if (error) {
    console.error("Dislike işlemi başarısız:", error.message);
    return { error: error.message };
  }

  return { success: true };
}
