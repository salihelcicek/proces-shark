// app/edit-blog/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getBlogById, updateBlog } from "@/lib/db/blogs";
import { toast } from "sonner";

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      const blog = await getBlogById(id);
      if (blog) {
        setTitle(blog.title);
        setContent(blog.content);
      }
    }
    fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !content) {
      toast.error("Başlık ve içerik boş olamaz!");
      return;
    }

    const { success, error } = await updateBlog(id, title, content);

    if (success) {
      toast.success("Blog başarıyla güncellendi!");
      router.push("/about-blog");
    } else {
      toast.error(error || "Güncelleme başarısız.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Blogu Düzenle</h1>
      <Input
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />
      <Textarea
        placeholder="İçerik"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-6 min-h-[200px]"
      />
      <Button onClick={handleUpdate}>Güncelle</Button>
    </div>
  );
}
