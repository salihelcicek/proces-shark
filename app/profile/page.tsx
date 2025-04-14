"use client";

import { useEffect, useState } from "react";
import { checkOrCreateUser } from "../actionts";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User, Blog, Mission } from "@/types/types";
import { useRouter } from "next/navigation";
export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    missionCount: 0,
    blogCount: 0,
    totalLikes: 0,
  });
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showMoreBlogs, setShowMoreBlogs] = useState(false);
  const [showMoreMissions, setShowMoreMissions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const user = await checkOrCreateUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUser(user);

      if (!user) return;

      const [missionsRes, blogsRes, likes] = await Promise.all([
        supabase.from("missions").select("*").eq("user_id", user.id),
        supabase.from("blogs").select("*").eq("user_id", user.id),
        supabase.from("likes").select("*").eq("user_id", user.id).eq("type", "like"),
      ]);

      setStats({
        missionCount: missionsRes.data?.length || 0,
        blogCount: blogsRes.data?.length || 0,
        totalLikes: likes.data?.length || 0,
      });

      setBlogs(blogsRes.data || []);
      setMissions(missionsRes.data || []);
    };

    fetchData();
  }, [router]);

  if (!user) return <div className="p-6">Yükleniyor...</div>;

  const formattedDate = new Date(user.created_at).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">👤 Profilim</h1>

      <div className="flex items-center gap-4 mb-8">
        <Image
          src={user.user_metadata?.avatar_url ?? "/default.png"}
          alt="Profil"
          width={64}
          height={64}
          className="rounded-full border"
        />
        <div>
          <p className="font-semibold text-lg">{user.email}</p>
          <p className="text-muted-foreground text-sm">Kayıt Tarihi: {formattedDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-10">
        <div className="bg-muted rounded-md py-4">
          <p className="text-2xl font-bold">{stats.missionCount}</p>
          <p className="text-muted-foreground">Görev</p>
        </div>
        <div className="bg-muted rounded-md py-4">
          <p className="text-2xl font-bold">{stats.blogCount}</p>
          <p className="text-muted-foreground">Blog</p>
        </div>
        <div className="bg-muted rounded-md py-4">
          <p className="text-2xl font-bold">{stats.totalLikes}</p>
          <p className="text-muted-foreground">Beğeni</p>
        </div>
      </div>

      {/* Bloglar */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">📝 Yazdığın Bloglar</h2>
        {blogs.length === 0 ? (
          <p className="text-muted-foreground">Henüz blog yazısı eklemediniz.</p>
        ) : (
          <div className="space-y-4">
            {blogs.slice(0, showMoreBlogs ? blogs.length : 3).map((blog) => (
              <Card key={blog.id} className="p-4 hover:shadow-sm">
                <Link href={`/about-blog/${blog.id}`} className="hover:underline font-medium text-sky-600">
                  {blog.title}
                </Link>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{blog.content}</p>
              </Card>
            ))}
            {blogs.length > 3 && (
              <div className="text-center mt-2">
                <Button variant="outline" onClick={() => setShowMoreBlogs(!showMoreBlogs)}>
                  {showMoreBlogs ? "Azalt" : "Daha Fazla Göster"}
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Görevler */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🎯 Görevlerin</h2>
        {missions.length === 0 ? (
          <p className="text-muted-foreground">Henüz görev eklemediniz.</p>
        ) : (
          <div className="space-y-4">
            {missions.slice(0, showMoreMissions ? missions.length : 3).map((mission) => (
              <Card key={mission.id} className="p-4 hover:shadow-sm">
                <Link href={`/dashboard/mission/${mission.id}`} className="hover:underline font-medium text-foreground">
                  {mission.name}
                </Link>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {mission.description || "Açıklama eklenmemiş."}
                </p>
              </Card>
            ))}
            {missions.length > 3 && (
              <div className="text-center mt-2">
                <Button variant="outline" onClick={() => setShowMoreMissions(!showMoreMissions)}>
                  {showMoreMissions ? "Azalt" : "Daha Fazla Göster"}
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
