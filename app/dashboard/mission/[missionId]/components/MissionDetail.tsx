"use client";

import { useEffect, useState } from "react";
import { getMissionById } from "@/lib/db/missions";
import { getMissionDays, updateMissionDayStatus } from "@/lib/db/missionDays";
import { getMissionNote, saveMissionNote } from "@/lib/db/missionNote";
import { toast } from "sonner";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";
import MissionProgress from "@/components/MissionProgress";
import MissionDaysTable from "@/components/MissionsDayTable";
import AIAdvice from "@/components/AIAdvice";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function MissionDetail({ missionId, user }) {
  const [mission, setMission] = useState(null);
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const MAX_WORDS = 50;
  const wordCount = note.trim().split(/\s+/).filter(Boolean).length;
  const wordsRemaining = MAX_WORDS - wordCount;
  const completedDays = days.filter((d) => d.status === "completed").length;
  const skippedDays = days.filter((d) => d.status === "skipped").length;
  const pendingDays = days.filter((d) => d.status === "pending" || !d.status).length;
  


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
    const existingNote = await getMissionNote(missionId, user.id, dayNumber);
    setNote(existingNote?.note || "");
  };

  const handleSaveNote = async () => {
    if (!user?.id || selectedDay === null) return;
    await saveMissionNote(missionId, user.id, selectedDay, note);
    toast.success("Not başarıyla kaydedildi!");
  };

  const handleStatusChange = async (dayNumber: number, newStatus: "pending" | "completed" | "skipped") => {
    if (!user?.id) return;
    await updateMissionDayStatus(missionId, user.id, dayNumber, newStatus);
    setDays((prev) =>
      prev.map((day) =>
        day.day_number === dayNumber ? { ...day, status: newStatus } : day
      )
    );
  };

  if (loading) return <p className="p-6 text-center">Yükleniyor...</p>;
  if (!mission) return <p className="text-center text-red-500">Mission bulunamadı!</p>;


  const totalDays = mission.total_days;

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Başlık */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">{mission.name}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{mission.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <div className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white p-4 rounded-md text-center">
            <p className="text-2xl font-bold">{totalDays}</p>
            <p className="text-sm">Toplam Gün</p>
          </div>

          <div className="bg-green-100 dark:bg-green-700 text-green-800 dark:text-white p-4 rounded-md text-center">
            <p className="text-2xl font-bold">{completedDays}</p>
            <p className="text-sm">Tamamlandı</p>
          </div>

          <div className="bg-red-100 dark:bg-red-700 text-red-800 dark:text-white p-4 rounded-md text-center">
            <p className="text-2xl font-bold">{skippedDays}</p>
            <p className="text-sm">Atlandı</p>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-white p-4 rounded-md text-center">
            <p className="text-2xl font-bold">{pendingDays}</p>
            <p className="text-sm">Beklemede</p>
          </div>
        </div>
        </div>

        {/* Gösterge kutusu (legend) */}
        <div className="flex justify-center gap-6 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-500" /> Tamamlandı</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-500" /> Atlandı</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600" /> Beklemede</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress */}
          <div className="flex flex-col items-center">
            <MissionProgress missionId={mission.id} />
          </div>

          {/* Günler */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">🗓️ Günlük Hedefler</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: mission.total_days }, (_, i) => {
                const day = days.find((d) => d.day_number === i + 1);
                const statusColor = day?.status === "completed"
                  ? "bg-green-500 text-white"
                  : day?.status === "skipped"
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white";

                const tooltipText = day?.status === "completed"
                  ? "Tamamlandı"
                  : day?.status === "skipped"
                    ? "Atlandı"
                    : "Beklemede";

                return (
                  <ContextMenu key={i}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ContextMenuTrigger onClick={() => handleDayClick(i + 1)}>
                          <div
                            className={`w-10 h-10 flex items-center justify-center text-sm rounded-full cursor-pointer transition-transform duration-200 hover:scale-110
                              ${statusColor} ${selectedDay === i + 1 ? "ring-2 ring-sky-500 scale-110" : ""}
                            `}
                          >
                            {i + 1}
                          </div>
                        </ContextMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>{tooltipText}</TooltipContent>
                    </Tooltip>
                    <ContextMenuContent className="bg-white dark:bg-gray-800 shadow-xl border rounded">
                      <ContextMenuItem onClick={() => handleStatusChange(i + 1, "pending")}>
                        Beklemede
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => handleStatusChange(i + 1, "completed")}>
                        Tamamlandı
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => handleStatusChange(i + 1, "skipped")}>
                        Atlandı
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
            </div>

            {/* Not Paneli */}
            {selectedDay !== null && (
              <div className="mt-6 bg-muted p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2 text-center">{selectedDay}. Gün Notu</h3>
                <Textarea
                  value={note}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                    if (words.length <= MAX_WORDS) {
                      setNote(e.target.value);
                    }
                  }}
                  placeholder="Bugün hakkında bir şeyler yaz..."
                />
                <p className={`text-xs text-right mt-1 ${wordsRemaining < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                  {wordsRemaining} kelime kaldı
                </p>
                <Button onClick={handleSaveNote} className="mt-3 w-full">
                  Notu Kaydet
                </Button>
              </div>
            )}
          </div>

          {/* Günlük Liste */}
          <div className="col-span-1 lg:col-span-2">
            <MissionDaysTable missionId={mission.id} />
          </div>
        </div>



        {/* AI Tavsiye */}
        <div className="mt-16">
          <AIAdvice mission={{
            name: mission.name,
            description: mission.description,
            total_days: mission.total_days,
            completed_days: days.filter(d => d.status === "completed").length,
            skipped_days: days.filter(d => d.status === "skipped").length,
          }} />
        </div>
      </div>
    </TooltipProvider>
  );
}
