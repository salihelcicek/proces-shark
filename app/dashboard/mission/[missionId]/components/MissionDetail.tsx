"use client";

import { useEffect, useState } from "react";
import { getMissionById } from "@/lib/db/missions";
import { getMissionDays, updateMissionDayStatus } from "@/lib/db/missionDays";
import { getMissionNote, saveMissionNote } from "@/lib/db/missionNote";
import { toast } from "sonner";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";
import MissionProgress from "@/components/MissionProgress";
import MissionDaysTable from "@/components/MissionsDayTable";

export default function MissionDetail({ missionId, user }) {
  const [mission, setMission] = useState(null);
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!missionId || !user) return;
      const missionData = await getMissionById(missionId);
      const missionDays = await getMissionDays(missionId);
      setMission(missionData);
      setDays(missionDays || []);
      setLoading(false);
    };

    fetchData();
  }, [missionId, user]);

  const handleDayClick = async (dayNumber: number) => {
    if (!user?.id) return;
    setSelectedDay(dayNumber);

    // ✅ Seçilen günün mevcut notunu getir
    const existingNote = await getMissionNote(missionId, user.id, dayNumber);
    setNote(existingNote?.note || "");
  };

  const handleSaveNote = async () => {
    if (!user?.id || selectedDay === null) return;

    await saveMissionNote(missionId, user.id, selectedDay, note);
    toast.success("Not başarıyla kaydedildi! ✅");
  };

  const handleStatusChange = async (dayNumber: number, newStatus: "pending" | "completed" | "skipped") => {
    if (!user?.id) return;

    await updateMissionDayStatus(missionId, user.id, dayNumber, newStatus);

    setDays((prev) =>
      prev.map((day) =>
        day.day_number === dayNumber ? { ...day, status: newStatus } : day
      )
    );

    toast.success(`Gün ${dayNumber} durumu: ${newStatus === "completed" ? "Tamamlandı ✅" : newStatus === "skipped" ? "Atlandı ❌" : "Beklemede ⏳"}`);
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!mission) return <p className="text-center text-red-500">Mission bulunamadı!</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">{mission.name}</h1>
        <p className="text-gray-600 text-center">{mission.description}</p>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-6 max-w-6xl mx-auto">
      {/* 1. Bölüm - Progress Bar */}
      <div className="flex flex-col items-center space-y-4 justify-center">
        <MissionProgress missionId={mission.id} />

      </div>

      {/* 2. Bölüm - Günlük Hedefler ve Not Paneli */}
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-center">Günlük Hedefler</h2>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {Array.from({ length: mission.total_days }, (_, i) => {
              const day = days.find((d) => d.day_number === i + 1);
              return (
                <ContextMenu key={i}>
                  <ContextMenuTrigger onClick={() => handleDayClick(i + 1)}>
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-md cursor-pointer transition-all duration-300 m-2
                        ${day?.status === "completed" ? "bg-green-600 text-white hover:scale-110" : 
                          day?.status === "skipped" ? "bg-red-600 text-white hover:scale-110" : 
                          "bg-gray-200 hover:scale-110"}
                        ${selectedDay === i + 1 ? "border-2 border-blue-500 shadow-md scale-110" : ""}
                      `}
                    >
                      {i + 1}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="bg-black text-white rounded-md shadow-md">
                    <ContextMenuItem onClick={() => handleStatusChange(i + 1, "pending")}>
                      ⏳ Beklemede
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleStatusChange(i + 1, "completed")}>
                      ✅ Tamamlandı
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleStatusChange(i + 1, "skipped")}>
                      ❌ Atlandı
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </div>
        </div>

        {/* Not Paneli */}
        {selectedDay !== null && (
          <div className="p-4 border rounded-md bg-white shadow-md">
            <h2 className="text-lg font-semibold text-center">{selectedDay}. Gün Notu</h2>
            <textarea
              className="w-full p-2 border rounded-md mt-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bugün hakkında bir not bırak..."
            />
            <button
              className="mt-2 w-1/3 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md"
              onClick={handleSaveNote}
            >
              Kaydet
            </button>
          </div>
        )}
      </div>

      {/* 3. Bölüm - Günlük İlerleme Tablosu */}
      <div>
        <MissionDaysTable missionId={mission.id} />
      </div>
    </div>
    </div>
  );
}
