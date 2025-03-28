import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export async function getAllBlogs() {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Bloglar alınamadı:", error.message);
    return [];
  }

  return data;
}

export async function getAllBlogsWithLikes() {
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select(`
      *,
      likes:likes(count),
      dislikes:likes(count)
    `);

  if (error) {
    console.error("Blog verisi alınamadı:", error.message);
    return [];
  }

  // Like/Dislike sayısını elle hesaplayalım:
  const { data: allLikes } = await supabase
    .from("likes")
    .select("blog_id, type");

  return blogs.map((blog) => {
    const blogLikes = allLikes?.filter((l) => l.blog_id === blog.id) || [];
    return {
      ...blog,
      likeCount: blogLikes.filter((l) => l.type === "like").length,
      dislikeCount: blogLikes.filter((l) => l.type === "dislike").length,
    };
  });
}

export async function getBlogById(id: string) {
  const supabase = createClient();

  // 1. Blog verisini çek
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*, users(email, profile_image)")
    .eq("id", id)
    .single();

  if (error || !blog) {
    console.error("Blog getirilemedi:", error?.message);
    return null;
  }

  // 2. Like sayısını al
  const { data: likes } = await supabase
    .from("likes")
    .select("type")
    .eq("blog_id", id);

  const likeCount = likes?.filter((l) => l.type === "like").length || 0;

  // 3. Birleştir ve döndür
  return {
    ...blog,
    like_count: likeCount,
  };
}

// lib/db/blogs.ts

export async function updateBlog(id: string, title: string, content: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("blogs")
    .update({ title, content })
    .eq("id", id);

  if (error) {
    console.error("Güncelleme hatası:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}


export async function deleteBlog(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) {
    console.error("Blog silinemedi:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

