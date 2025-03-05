import { createClient } from "@/utils/supabase/client";

// ✅ Bir günün notunu getir
export async function getMissionNote(missionId: string, userId: string, dayNumber: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("mission_notes")
    .select("*")
    .eq("mission_id", missionId)
    .eq("user_id", userId)
    .eq("day_number", dayNumber)
    .maybeSingle();

  if (error) {
    console.error("❌ Not verisi çekilirken hata oluştu:", error.message);
    return null;
  }

  return data;
}

// ✅ Bir güne not kaydet veya güncelle
export async function saveMissionNote(missionId: string, userId: string, dayNumber: number, note: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("mission_notes")
    .upsert([{ mission_id: missionId, user_id: userId, day_number: dayNumber, note }], { onConflict: ["mission_id", "user_id", "day_number"] });

  if (error) {
    console.error("❌ Not kaydedilirken hata oluştu:", error.message);
  }

  return data;
}
