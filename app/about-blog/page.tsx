"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Trash2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { deleteBlog, getAllBlogsWithLikes } from "@/lib/db/blogs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { checkOrCreateUser } from "../actionts";
import { toast } from "sonner";
import BlogFilters from "@/components/blog/BlogFilters";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Blog, User } from "@/types/types";
import ConfirmDialog from "@/components/ConfirmDialog";


export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({ search: "", author: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const filteredBlogs = blogs.filter((blog) => {
    const matchTitle = blog.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchAuthor = filters.author ? blog.user_id === filters.author : true;
    return matchTitle && matchAuthor;
  });

  const handleDelete = async () => {
    if (!selectedBlogId) return;
  
    const res = await deleteBlog(selectedBlogId);
    if (res?.success) {
      toast.success("Blog başarıyla silindi!");
      setBlogs((prev) => prev.filter((b) => b.id !== selectedBlogId));
    } else {
      toast.error("Bir hata oluştu.");
    }
  
    setConfirmOpen(false);
    setSelectedBlogId(null);
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
        <h1 className="text-3xl font-bold mb-8 text-center text-sky-600">
          📝 Topluluk Blogları
        </h1>

        {/* Filtre */}
        <BlogFilters onFilterChange={setFilters} />

        <Badge className="mt-2 bg-slate-100 text-slate-800 hover:bg-slate-200">
          <Link href="/profile" className="">
            Profil
          </Link>
        </Badge>
        <br />
        <Badge className="mt-2 bg-slate-100 text-slate-800 hover:bg-slate-200">
          <Link href="/about-blog/add-blog" className="">
            Yeni blog oluştur
          </Link>
        </Badge>
        

        {/* Blog Listesi veya Boş Mesaj */}
        {filteredBlogs.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">
            Hiç blog bulunamadı.
          </p>
        ) : (
          <div className="grid gap-6 mt-6">
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 shadow-md relative">
                  {/* Avatar */}
                  {blog.users?.profile_image && (
                    <div className="absolute top-4 right-4">
                      <Image
                        src={blog.users.profile_image}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="rounded-full border"
                      />
                    </div>
                  )}

                  <h2 className="text-xl font-semibold text-foreground mb-2">{blog.title}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-3">{blog.content}</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                  {new Date(blog.created_at).toLocaleDateString("tr-TR")}
                </p>

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
                          onClick={() => {
                            setSelectedBlogId(blog.id);
                            setConfirmOpen(true);
                          }}
                          
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
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedBlogId(null);
        }}
        onConfirm={handleDelete}
        title="Bu blogu silmek istiyor musun?"
        description="Bu işlem geri alınamaz. Blog kalıcı olarak silinecek."
      />


    </div>
  );
}
