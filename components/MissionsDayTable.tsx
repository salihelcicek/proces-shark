"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserSession as useAuth } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const MissionDaysTable = ({ missionId }: { missionId: string }) => {
  const supabase = createClient();
  const { user } = useAuth();
  const [days, setDays] = useState<
    { day_number: number; status: string | null; note: string | null }[]
  >([]);

  useEffect(() => {
    const fetchMissionDays = async () => {
      if (!user) return;

      // Mission Days tablosundan tüm günleri çek
      const { data: missionDays, error: missionDaysError } = await supabase
        .from("mission_days")
        .select("day_number, status")
        .eq("mission_id", missionId)
        .order("day_number", { ascending: true });

      if (missionDaysError) {
        console.error("❌ Günler alınırken hata oluştu:", missionDaysError.message);
        return;
      }

      // Mission Notes tablosundan ilgili günlerin notlarını çek
      const { data: missionNotes, error: missionNotesError } = await supabase
        .from("mission_notes")
        .select("day_number, note")
        .eq("mission_id", missionId);

      if (missionNotesError) {
        console.error("❌ Notlar alınırken hata oluştu:", missionNotesError.message);
        return;
      }

      // Mission günlerini notlarla birleştir
      const mergedData = missionDays.map((day) => {
        const noteEntry = missionNotes.find((note) => note.day_number === day.day_number);
        return {
          ...day,
          note: noteEntry ? noteEntry.note : null, // Eğer not varsa ekle, yoksa null
        };
      });

      setDays(mergedData);
    };

    fetchMissionDays();
  }, [supabase, user, missionId]);

  return (
    <div className="mt-3 m-5">
      <h2 className="text-lg font-semibold mb-4">Tüm Günler</h2>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Gün</TableHead>
            <TableHead>İçerik</TableHead>
            <TableHead>Durum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.map((day) => (
            <TableRow key={day.day_number}>
              <TableCell>Gün {day.day_number}</TableCell>
              <TableCell>{day.note || "Henüz not eklenmemiş"}</TableCell>
              <TableCell>
                {day.status === "completed" ? (
                  <Badge variant="default">Tamamlandı</Badge>
                ) : day.status === "skipped" ? (
                  <Badge variant="destructive">Atlandı</Badge>
                ) : (
                  <Badge variant="outline">Beklemede</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MissionDaysTable;
