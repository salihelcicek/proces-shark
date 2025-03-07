"use client";

import { CircularProgress, Card, CardBody, CardFooter, Chip } from "@heroui/react";
import { useState } from "react";
import { useRealtimeUpdates } from "@/lib/realtime"; // ✅ Realtime Hook

const MissionProgress = ({ missionId }: { missionId: string }) => {
// ✅ Fetch mission_days in realtime using missionId instead of userId
const missionDays = useRealtimeUpdates("mission_days", missionId, "mission_id");


  // ✅ Get total days & completed days
  const totalDays = missionDays.length || 1;
  const completedDays = missionDays.filter((day) => day.status === "completed").length;

  // ✅ Calculate progress percentage
  const progress = Math.round((completedDays / totalDays) * 100);

  return (
    <Card className="w-[440px] h-[340px] bg-transparent">
      <CardBody className="justify-center items-center pb-0">
        <CircularProgress
          classNames={{
            svg: "w-60 h-60 drop-shadow-md",
            indicator: "stroke-black dark:stroke-white",
            track: "stroke-gray-300 dark:stroke-gray-700",
            value: "text-3xl font-semibold text-black dark:text-white",
          }}
          showValueLabel={true}
          strokeWidth={4}
          value={progress}
        />
      </CardBody>
      <CardFooter className="justify-center items-center pt-0">
        <Chip
          classNames={{
            base: "border border-gray-400 dark:border-gray-600",
            content: "text-black dark:text-white text-small font-semibold",
          }}
          variant="bordered"
        >
          {completedDays} / {totalDays} Gün Tamamlandı
        </Chip>
      </CardFooter>
    </Card>
  );
};

export default MissionProgress;
