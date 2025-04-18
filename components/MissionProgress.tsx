"use client";

import { CircularProgress, Card, CardBody, CardFooter, Chip } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useRealtimeUpdates } from "@/lib/realtime";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const MissionProgress = ({ missionId }: { missionId: string }) => {
  const missionDays = useRealtimeUpdates("mission_days", missionId, "mission_id");
  const [prevProgress, setPrevProgress] = useState(0);
  const confettiFiredRef = useRef(false); // confetti tekrar tekrar fırlamasın
  const totalDays = missionDays.length || 1;
  const completedDays = missionDays.filter((day: { status: string }) => day.status === "completed").length;
  const progress = Math.round((completedDays / totalDays) * 100);

  useEffect(() => {
    if (progress === 100 && !confettiFiredRef.current) {
      toast.success("🎉 Tebrikler! Görevi tamamen bitirdin!");
      fireConfetti();
      confettiFiredRef.current = true;
    } else if (progress < 100) {
      confettiFiredRef.current = false;
    }

    setPrevProgress(progress);
  }, [progress, prevProgress, completedDays, totalDays, missionDays]);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.6 },
    });
  };

  const getProgressColor = () => {
    if (progress >= 70) return "text-green-500";
    if (progress >= 31) return "text-yellow-500";
    return "text-red-500";
  };

  const getChipColor = () => {
    if (progress >= 70) return "border-green-500 text-green-600 dark:text-green-400";
    if (progress >= 31) return "border-yellow-500 text-yellow-600 dark:text-yellow-400";
    return "border-red-500 text-red-600 dark:text-red-400";
  };

  return (
    <Card className="w-[440px] h-[340px] bg-transparent shadow-md">
      <CardBody className="justify-center items-center pb-0">
        <CircularProgress
          classNames={{
            svg: "w-60 h-60 drop-shadow-md",
            indicator: `stroke-current ${getProgressColor()}`,
            track: "stroke-gray-300 dark:stroke-gray-700",
            value: `text-3xl font-bold ${getProgressColor()}`,
          }}
          showValueLabel={true}
          strokeWidth={4}
          value={progress}
        />
      </CardBody>
      <CardFooter className="justify-center items-center pt-0">
        <Chip
          classNames={{
            base: `border ${getChipColor()}`,
            content: `text-sm font-semibold ${getChipColor()}`,
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