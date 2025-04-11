import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useRealtimeUpdates(
  table: string,
  filterId: string,
  filterColumn: "user_id" | "mission_id" = "user_id",
  uniqueKey: string = "default"
) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!filterId) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq(filterColumn, filterId);

      if (error) {
        console.error(`❌ Error fetching ${table}:`, error.message);
      } else {
        setData(data);
      }
    };

    fetchData();

    const channelName = `${table}_${filterId}_${uniqueKey}_realtime`; // 🔑 benzersiz kanal adı
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter: `${filterColumn}=eq.${filterId}` },
        async () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filterId, filterColumn, uniqueKey]);

  return data;
}


