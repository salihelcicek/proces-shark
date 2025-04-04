// lib/realtime3.ts
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export function useMissionsRealtime(userId: string) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("❌ missions fetch error:", error.message);
      } else {
        setData(data);
      }
    };

    fetchData();

    const channelName = `missions_${userId}_realtime`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "missions" }, // filter yok!
        (payload) => {
          console.log("🔔 Mission event triggered!", payload);
          fetchData();
        }
      )
      
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return data;
}
