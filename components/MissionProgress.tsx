"use client";

import { CircularProgress, Card, CardBody, CardFooter, Chip } from "@heroui/react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserSession as useAuth } from "@/lib/auth";

const MissionProgress = ({ missionId }: { missionId: string }) => {
  const supabase = createClient();
  const { user } = useAuth();
  const [completedDays, setCompletedDays] = useState(0);
  const [totalDays, setTotalDays] = useState(1);

  useEffect(() => {
    const fetchMissionProgress = async () => {
      if (!user) return;

      const { data: mission, error: missionError } = await supabase
        .from("missions")
        .select("total_days")
        .eq("id", missionId)
        .single();

      if (missionError) {
        console.error("❌ Mission verisi alınırken hata oluştu:", missionError.message);
        return;
      }

      setTotalDays(mission?.total_days || 1);

      const { data: completed, error: completedError } = await supabase
        .from("mission_days")
        .select("id")
        .eq("mission_id", missionId)
        .eq("status", "completed");

      if (completedError) {
        console.error("❌ Tamamlanan günler alınırken hata oluştu:", completedError.message);
        return;
      }

      setCompletedDays(completed.length);
    };

    fetchMissionProgress();
  }, [supabase, user, missionId]);

  const progress = Math.round((completedDays / totalDays) * 100);

  return (
    <Card className="w-[440px] h-[340px]  bg-transparent">
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
