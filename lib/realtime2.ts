import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Define a type with minimal requirements for items in the realtime updates
export function useRealtimeUpdates<T extends { id: string } = { id: string; [key: string]: unknown }>(
  table: string, 
  filterValue: string, 
  filterColumn = "blog_id"
): T[] {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    if (!filterValue) return;
  
    const fetchInitial = async () => {
      const selectFields =
        table === "comments" ? "*, users(email, profile_image)" : "*";
  
      const { data } = await supabase
        .from(table)
        .select(selectFields)
        .eq(filterColumn, filterValue);
  
      // Use type assertion with unknown first to satisfy TypeScript
      setItems((data || []) as unknown as T[]);
    };
  
    fetchInitial();
  
    const channel = supabase
      .channel(`${table}-realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          setItems((prev) => {
            if (payload.eventType === "INSERT") return [payload.new as T, ...prev];
            if (payload.eventType === "DELETE")
              return prev.filter((item) => item.id !== payload.old.id);
            if (payload.eventType === "UPDATE")
              return prev.map((item) =>
                item.id === payload.new.id ? payload.new as T : item
              );
            return prev;
          });
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filterValue, filterColumn]); // ✅ FIXED: added filterColumn
  

  return items;
}
