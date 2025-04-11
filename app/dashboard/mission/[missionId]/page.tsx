"use client";

import MissionDetail from "./components/MissionDetail";
import { useUserSession } from "@/lib/auth";
import { useParams } from "next/navigation";

export default function MissionDetailPage() {
  const { user, loading } = useUserSession(); // ✅ Client-side kullanıcı verisi
  const params = useParams(); // ✅ Next.js 15'te params artık burada erişilmeli
  const missionId = Array.isArray(params?.missionId) ? params.missionId[0] : params?.missionId; // ✅ Ensure string type

  if (loading) {
    return <p className="text-center text-gray-500">Yükleniyor...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-500">Giriş yapmalısın!</p>;
  }

  if (!missionId) {
    return <p className="text-center text-red-500">Mission ID bulunamadı!</p>;
  }

  return <MissionDetail missionId={missionId} user={user} />;
}
