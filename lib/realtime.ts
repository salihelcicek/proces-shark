import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useRealtimeUpdates<T = any>( // ✅ Tip generic ama default any
  table: string,
  filterId: string,
  filterColumn: "user_id" | "mission_id" = "user_id",
  uniqueKey: string = "default"
): T[] {
  const [data, setData] = useState<T[]>([]); // ✅ Tipli data array

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
        setData(data as T[]); // ✅ data'yı doğru tipe cast ettik
      }
    };

    fetchData();

    const channelName = `${table}_${filterId}_${uniqueKey}_realtime`;
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
