"use client";

import { useEffect, useState } from "react";
import { getMissionById } from "@/lib/db/missions";
import { getMissionDays, updateMissionDayStatus } from "@/lib/db/missionDays";
import { getMissionNote, saveMissionNote } from "@/lib/db/missionNote";
import { toast } from "sonner";
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

    // Önce kaydedilmiş notu getir
    const existingNote = await getMissionNote(missionId, user.id, dayNumber);
    setNote(existingNote?.note || "");
  };

  const handleSaveNote = async () => {
    if (!user?.id || selectedDay === null) return;
    
    await saveMissionNote(missionId, user.id, selectedDay, note);
    toast.success("Not başarıyla kaydedildi!");
  };

  const handleToggleStatus = async (dayNumber: number) => {
    if (!user?.id) return;

    const currentStatus = days.find((day) => day.day_number === dayNumber)?.status || "pending";
    const newStatus = currentStatus === "pending" ? "completed" : currentStatus === "completed" ? "skipped" : "pending";

    await updateMissionDayStatus(missionId, user.id, dayNumber, newStatus);

    setDays((prev) =>
      prev.map((day) =>
        day.day_number === dayNumber ? { ...day, status: newStatus } : day
      )
    );
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!mission) return <p className="text-center text-red-500">Mission bulunamadı!</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold">{mission.name}</h1>
      <p className="text-gray-600">{mission.description}</p>

      {/* Günler */}
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
                  ${selectedDay === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Not Paneli */}
      {selectedDay !== null && (
        <div className="mt-6 p-4 border rounded-md bg-white shadow-md">
          <h2 className="text-lg font-semibold">Gün {selectedDay} Notu</h2>
          <textarea
            className="w-full p-2 border rounded-md mt-2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bugün hakkında bir not bırak..."
          />
          <button
            className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-700"
            onClick={handleSaveNote}
          >
            Kaydet
          </button>
        </div>
      )}
    </div>
  );
}
