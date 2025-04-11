"use client";

import { useEffect, useState, useCallback } from "react";
import { checkOrCreateUser } from "@/app/actionts";
import { useParams, useRouter } from "next/navigation";
import { deleteBlog, getBlogById } from "@/lib/db/blogs";
import { likeBlog, dislikeBlog } from "@/lib/db/likes";
import CommentSection from "@/components/blog/CommentSection";
import { ThumbsUp, ThumbsDown, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlogDetailPage() {
  const { id } = useParams();
  const blogId = Array.isArray(id) ? id[0] : id;

  const [user, setUser] = useState(null);
  const [blog, setBlog] = useState(null);

  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Bu blog yazısını silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    const res = await deleteBlog(blog?.id);
    if (res?.success) {
      toast.success("Blog başarıyla silindi!");
      router.push("/about-blog");
    } else {
      toast.error("Bir hata oluştu.");
    }
  };

  const fetchData = useCallback(async () => {
    const userData = await checkOrCreateUser();
    setUser(userData);

    const blogData = await getBlogById(blogId);
    setBlog(blogData);
  }, [blogId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLike = async () => {
    if (!user) return toast.error("Lütfen giriş yapınız.");
    const res = await likeBlog(blog.id, user.id);
    if (res?.success) {
      toast.success("Blog beğenildi!");
      fetchData(); // like sonrası güncelle
    }
  };

  const handleDislike = async () => {
    if (!user) return toast.error("Lütfen giriş yapınız.");
    await dislikeBlog(blog.id, user.id);
    toast.success("Beğenilmedi!");
    fetchData(); // dislike sonrası güncelle
  };

  if (!blog) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-muted-foreground mb-6">{blog.content}</p>

      {/* Blog sahibi bilgisi */}
      <div className="flex items-center gap-3 mt-6 text-muted-foreground text-sm mb-6">
        {blog.users?.profile_image && (
          <Image
            src={blog.users.profile_image}
            alt={blog.users.email}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        )}
        <span className="font-semibold hover:underline text-sky-600 dark:text-sky-300">
          {blog.users?.email}
        </span>
      </div>

      {/* Like - Dislike */}
      <div className="flex items-center gap-4 mb-10">
        <button onClick={handleLike} className="flex items-center gap-1 hover:text-green-600">
          <ThumbsUp className="w-4 h-4" /> {blog.like_count || 0}
        </button>
        <button onClick={handleDislike} className="flex items-center gap-1 hover:text-red-600">
          <ThumbsDown className="w-4 h-4" />
        </button>
        {user?.id === blog.user_id && (
          <div className="flex gap-2 m-5">
            <Link href={`/about-blog/edit-blog/${blog.id}`}>
              <Button size={"sm"}>
                <Pencil className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Yorumlar */}
      {user && <CommentSection blogId={blogId} user={user} />}
    </div>
  );
}