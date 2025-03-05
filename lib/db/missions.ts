import { createClient } from "@/utils/supabase/client";

// ✅ Yeni Mission Ekle
export async function createMission(userId: string, name: string, description: string, totalDays: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("missions")
    .insert([{ user_id: userId, name, description, total_days: totalDays }])
    .select()
    .single();

  if (error) {
    console.error("❌ Mission eklenirken hata oluştu:", error.message);
    return null;
  }

  // ✅ Mission eklendikten sonra otomatik olarak günleri ekleyelim
  await addMissionDays(data.id, userId, totalDays);

  return data;
}

// ✅ Kullanıcının Mission'larını Listele

export async function getUserMissions(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("missions")
    .select("id, name, description, total_days, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  console.log("📌 Supabase'ten Çekilen Mission'lar:", data);

  if (error) {
    console.error("❌ Mission'lar alınırken hata oluştu:", error.message);
    return [];
  }

  return data;
}


// ✅ Mission Güncelle
export async function updateMission(missionId: string, name: string, description: string, totalDays: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("missions")
    .update({ name, description, total_days: totalDays })
    .eq("id", missionId)
    .select()
    .single();

  if (error) throw new Error("Mission güncellenirken hata oluştu: " + error.message);
  return data;
}

// ✅ Mission Sil
export async function deleteMission(missionId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("missions")
    .delete()
    .eq("id", missionId);

  if (error) throw new Error("Mission silinirken hata oluştu: " + error.message);
}


export async function getMissionById(missionId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("id", missionId)
    .single();

  if (error) {
    console.error("❌ Mission çekilirken hata oluştu:", error.message);
    return null;
  }

  return data;
}

export async function addMissionDays(missionId: string, userId: string, totalDays: number) {
  const supabase = createClient();

  const days = Array.from({ length: totalDays }, (_, i) => ({
    mission_id: missionId,
    user_id: userId,
    day_number: i + 1,
    status: "pending"
  }));

  const { error } = await supabase.from("mission_days").insert(days);

  if (error) {
    console.error("❌ Mission günleri eklenirken hata oluştu:", error.message);
  }
}