"use client";

import { useMemo } from "react";
import { useRealtimeUpdates } from "@/lib/realtime";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const MissionDaysTable = ({ missionId }: { missionId: string }) => {
  const missionDays = useRealtimeUpdates("mission_days", missionId, "mission_id","f");
  const missionNotes = useRealtimeUpdates("mission_notes", missionId, "mission_id","d");
  const missionDaySorted = [...missionDays].sort((a, b) => a.day_number - b.day_number);

  // ⚡ Memoized note map
  const noteMap = useMemo(() => {
    const map = new Map();
    missionNotes.forEach((note) => map.set(note.day_number, note.note));
    return map;
  }, [missionNotes]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>;
      case "skipped":
        return <Badge className="bg-red-100 text-red-800">Atlandı</Badge>;
      default:
        return <Badge className="bg-gray-200 text-gray-700">Beklemede</Badge>;
    }
  };

  return (
    <div className="mt-3 p-4 bg-muted rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">📋 Günlük Durumlar</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gün</TableHead>
            <TableHead>Not</TableHead>
            <TableHead>Durum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
          missionDaySorted.map((day) => (
            <TableRow key={day.day_number}>
              <TableCell> <Badge className="bg-sky-500 dark:bg-blue-600 dark:text-white">Gün {day.day_number}</Badge></TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {noteMap.get(day.day_number) || <em>Henüz not yok</em>}
              </TableCell>
              <TableCell>{getStatusBadge(day.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MissionDaysTable;
