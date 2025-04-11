import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useRealtimeUpdates(table: string, filterValue: string, filterColumn = "blog_id") {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!filterValue) return;
  
    const fetchInitial = async () => {
      const selectFields =
        table === "comments" ? "*, users(email, profile_image)" : "*";
  
      const { data } = await supabase
        .from(table)
        .select(selectFields)
        .eq(filterColumn, filterValue);
  
      setItems(data || []);
    };
  
    fetchInitial();
  
    const channel = supabase
      .channel(`${table}-realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          setItems((prev) => {
            if (payload.eventType === "INSERT") return [payload.new, ...prev];
            if (payload.eventType === "DELETE")
              return prev.filter((item) => item.id !== payload.old.id);
            if (payload.eventType === "UPDATE")
              return prev.map((item) =>
                item.id === payload.new.id ? payload.new : item
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
