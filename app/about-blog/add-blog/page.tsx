"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkOrCreateUser } from "@/app/actionts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddBlog = async () => {
    if (!title || !content) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    const user = await checkOrCreateUser();
    const supabase = createClient();

    const { error } = await supabase.from("blogs").insert({
      title,
      content,
      user_id: user.id,
    });

    if (error) {
      toast.error("Blog eklenemedi.");
      console.error(error);
    } else {
      toast.success("Blog başarıyla eklendi!");
      router.push("/about-blog");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Yeni Blog Ekle</h1>

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
        className="mb-4"
        rows={8}
      />

      <Button onClick={handleAddBlog} disabled={loading}>
        {loading ? "Ekleniyor..." : "Blogu Ekle"}
      </Button>
    </div>
  );
}
