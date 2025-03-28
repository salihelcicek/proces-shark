import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function addComment(blogId: string, userId: string, content: string, parentId: string | null = null) {
  const supabase = createClient();
  const { data, error } = await supabase.from("comments").insert({
    blog_id: blogId,
    user_id: userId,
    content,
    parent_id: parentId
  });

  if (error) {
    console.error("Yorum eklenemedi:", error.message);
  }

  return data;
}


export async function deleteComment(commentId: string) {
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) console.error("Yorum silinemedi:", error.message);
}

export async function updateComment(commentId: string, content: string) {
  const { error } = await supabase.from("comments").update({ content }).eq("id", commentId);
  if (error) console.error("Yorum güncellenemedi:", error.message);
}
