"use client";

import { useRealtimeUpdates } from "@/lib/realtime"; // ✅ Realtime Hook
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MissionDaysTable = ({ missionId }: { missionId: string }) => {
  // ✅ Fetch mission_days & mission_notes in realtime
  const missionDays = useRealtimeUpdates("mission_days", missionId, "mission_id");
  const missionNotes = useRealtimeUpdates("mission_notes", missionId, "mission_id");

  // ✅ Merge mission days with their corresponding notes
  const days = missionDays.map((day) => ({
    ...day,
    note: missionNotes.find((note) => note.day_number === day.day_number)?.note || "Henüz not eklenmemiş",
  }));

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
              <TableCell>{day.note}</TableCell>
              <TableCell>
                {day.status === "completed" ? (
                  <p>✅</p>
                ) : day.status === "skipped" ? (
                  <p>❌</p>
                ) : (
                  <p>⏳</p>
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
