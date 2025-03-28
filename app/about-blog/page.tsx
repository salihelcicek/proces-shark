"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Trash2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { deleteBlog, getAllBlogsWithLikes } from "@/lib/db/blogs"; // likes sayısı için yeni fonksiyon
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { checkOrCreateUser } from "../actionts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Bu blog yazısını silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;
  
    const res = await deleteBlog(blog.id);
    if (res?.success) {
      toast.success("Blog başarıyla silindi!");
      router.push("/about-blog");
    } else {
      toast.error("Bir hata oluştu.");
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const blogData = await getAllBlogsWithLikes();
      setBlogs(blogData);

      const userData = await checkOrCreateUser();
      setUser(userData);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-sky-600">📝 Topluluk Blogları</h1>
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 shadow-md relative">
                <h2 className="text-xl font-semibold text-foreground mb-2">{blog.title}</h2>
                <p className="text-muted-foreground text-sm line-clamp-3">{blog.content}</p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/about-blog/${blog.id}`}
                    className="text-sky-600 font-medium hover:underline"
                  >
                    Devamını Oku →
                  </Link>
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

                  <div className="flex gap-3 text-sm text-muted-foreground items-center">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" /> {blog.likeCount ?? 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="w-4 h-4" /> {blog.dislikeCount ?? 0}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
