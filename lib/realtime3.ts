// lib/realtime3.ts
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// We use a more specific type as default - a minimal record type with common mission fields
export function useMissionsRealtime<T = { id: string; [key: string]: unknown }>(userId: string): T[] {
  const [data, setData] = useState<T[]>([]);

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
