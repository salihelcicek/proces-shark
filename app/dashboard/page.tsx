"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkOrCreateUser } from "@/app/actionts";
import { getUserMissions } from "@/lib/db/missions";
import AddMissionModal from "@/components/AddMissionModal";
import Missions from "@/components/Missions";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/types";
import type { Mission } from "@/types/types";

// ✅ eslint-disable: unused değişken uyarısı için (eğer sadece setMissions kullanılmıyorsa)

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await checkOrCreateUser();

      if (!userData) {
        router.replace("/login");
        return;
      }

      setUser(userData);

      const userMissions = await getUserMissions(userData.id);

      // ✅ Tip uyumu için dönüştürme
      const formattedMissions: Mission[] = userMissions.map((mission: {
        id: string;
        name: string;
        description: string;
        total_days: number;
        created_at: string;
        status?: string;
        updated_at?: string;
      }) => ({
        id: mission.id,
        user_id: userData.id,
        name: mission.name,
        description: mission.description,
        total_days: mission.total_days,
        status: mission.status ?? "active",
        created_at: mission.created_at,
        updated_at: mission.updated_at ?? new Date().toISOString(),
      }));

      setMissions(formattedMissions);
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  if (loading)
    return (
      <p className="text-gray-800 dark:text-gray-200 text-lg text-center mt-10">
        Yükleniyor...
      </p>
    );

  return (
    <div className="flex flex-col justify-center items-center gap-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      {/* Başlık */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center 
        bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 
        dark:from-gray-800 dark:via-gray-900 dark:to-black 
        p-4 rounded-lg shadow-lg">
        Mission Dashboard 🦈
      </h1>

      {/* Kullanıcı Bilgisi */}
      {user ? (
        <Badge className="text-xl font-semibold bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 px-4 rounded-lg">
          Hoş geldin, {user.email ?? "Kullanıcı"}! 🎉
        </Badge>
      ) : (
        <Badge className="bg-red-500 text-white">Giriş bilgisi alınamadı.</Badge>
      )}

      {/* Açıklama */}
      <p className="text-lg hover:underline text-gray-600 dark:text-gray-300">
        Mission seç ve çalışmaya başla! 😎
      </p>

      {/* Mission Listesi ve Mission Ekleme */}
      <div className="w-full max-w-4xl space-y-6">
        {user && (
          <>
            <Missions userId={user.id} />
            <AddMissionModal userId={user.id} />
          </>
        )}
      </div>
    </div>
  );
}
