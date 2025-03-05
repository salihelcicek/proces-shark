"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkOrCreateUser } from "@/app/actionts";
import { getUserMissions } from "@/lib/db/missions";
import  AddMissionModal  from "@/components/AddMissionModal";
import Missions from "@/components/Missions";
export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await checkOrCreateUser();

      if (!userData) {
        router.replace("/login");
        return;
      }

      setUser(userData);

      const userMissions = await getUserMissions(userData.id);
      console.log("✅ Mission Verileri:", userMissions); // Log ekledik
      setMissions(userMissions);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Dashboard</h2>
      {user ? <p>Hoş geldin, {user.email}!</p> : <p>Giriş bilgisi alınamadı.</p>}

      <h3>Mission'lar</h3>
      <AddMissionModal userId={user.id} />
      <Missions userId={user.id} />
    </div>
  );
}
