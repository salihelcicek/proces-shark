"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMissionById } from "@/lib/db/missions";
import { getMissionDays, updateMissionDayStatus } from "@/lib/db/missionDays";

interface MissionDay {
  day_number: number;
  status: 'pending' | 'completed' | 'skipped';
}

export default function MissionDetail({ user }) {
  const { missionId } = useParams();
  const [mission, setMission] = useState(null);
  const [days, setDays] = useState<MissionDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const missionData = await getMissionById(missionId);
      const missionDays = await getMissionDays(missionId);
      setMission(missionData);
      setDays(missionDays || []); // Varsayılan olarak boş array
      setLoading(false);
    };

    fetchData();
  }, [missionId]);

  const handleDayClick = async (dayNumber: number) => {
    if (!user?.id) {
      console.error("❌ Kullanıcı bilgisi eksik! user: ", user);
      return;
    }
    
    const currentStatus = days.find((day) => day.day_number === dayNumber)?.status || "pending";
    const newStatus = currentStatus === "pending" ? "completed" : currentStatus === "completed" ? "skipped" : "pending";

    await updateMissionDayStatus(missionId, user.id, dayNumber, newStatus);

    setDays((prev) => prev.map((day) =>
      day.day_number === dayNumber ? { ...day, status: newStatus } : day
    ));
  };

  if (loading) return <p>Yükleniyor...</p>;

  if (!mission) return <p className="text-center text-red-500">Mission bulunamadı!</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold">{mission.name}</h1>
      <p className="text-gray-600">{mission.description}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Günlük Hedefler</h2>
        <div className="grid grid-cols-7 gap-2 mt-4">
          {Array.from({ length: mission.total_days }, (_, i) => {
            const day = days.find((d) => d.day_number === i + 1);
            return (
              <div
                key={i}
                onClick={() => handleDayClick(i + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition-all duration-300 
                  ${day?.status === "completed" ? "bg-green-500 text-white" :
                    day?.status === "skipped" ? "bg-red-500 text-white" :
                    "bg-gray-200"}`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}