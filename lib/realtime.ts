import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export function useRealtimeUpdates(table: string, filterId: string, filterColumn: "user_id" | "mission_id" = "user_id") {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!filterId) return;

    console.log(`📡 Listening for changes in ${table} (Filtered by ${filterColumn}: ${filterId})`);

    // Fetch initial data
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

    fetchData(); // Load initial data

    // ✅ Subscribe to Realtime Changes
    const channel = supabase
      .channel(`${table}_realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: table, filter: `${filterColumn}=eq.${filterId}` },
        async (payload) => {
          console.log(`🔄 Realtime Update on ${table}:`, payload);
          
          if (payload.eventType === "INSERT") {
            toast.success(`✅ New ${table} added!`);
          } else if (payload.eventType === "UPDATE") {
            toast.info(`✏️ ${table} updated!`);
          } else if (payload.eventType === "DELETE") {
            toast.warning(`❌ ${table} deleted!`);
          }

          fetchData(); // Refresh data when an update occurs
        }
      )
      .subscribe();

    // Cleanup listener on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filterId, filterColumn]);

  return data; // Return live data to be used in components
}
