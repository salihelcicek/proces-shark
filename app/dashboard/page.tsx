"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkOrCreateUser } from "@/app/actionts";
import { getUserMissions } from "@/lib/db/missions";
import  AddMissionModal  from "@/components/AddMissionModal";
import Missions from "@/components/Missions";
import {Badge} from "@/components/ui/badge"
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
    <div style={{ textAlign: "center", marginTop: "100px" }} className="flex flex-col justify-center items-center gap-5">
      <h1 className="text-3xl text-center font-bold">Mission Dashboard</h1>
      {user ? <Badge variant={"outline"} className="text-center text-xl font-bold">Hoş geldin, {user.email}! 🎉</Badge> : <Badge>Giriş bilgisi alınamadı.</Badge>}
      <p className="hover:underline">Mission seç ve çalışmaya başla ! 😎</p>

      
      <Missions userId={user.id} />
      <AddMissionModal userId={user.id} />
    </div>
  );
}
