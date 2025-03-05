import { createClient } from "@/utils/supabase/client";

// ✅ Bir Mission'ın tüm günlerini çek
export async function getMissionDays(missionId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("mission_days")
    .select("*")
    .eq("mission_id", missionId)
    .order("day_number", { ascending: true });

  if (error) {
    console.error("❌ Günlük veriler çekilirken hata oluştu:", error.message);
    return [];
  }

  return data;
}



// ✅ Bir Günün Durumunu Güncelle veya Yoksa Ekle
export async function updateMissionDayStatus(missionId: string, userId: string, dayNumber: number, newStatus: string) {
  const supabase = createClient();

  // Önce gün var mı kontrol et
  const { data: existingDay, error: checkError } = await supabase
    .from("mission_days")
    .select("*")
    .eq("mission_id", missionId)
    .eq("user_id", userId)
    .eq("day_number", dayNumber)
    .maybeSingle(); // ❌ `.single()` değil, `.maybeSingle()` kullanıyoruz.

  if (checkError) {
    console.error("❌ Günlük veriyi kontrol ederken hata oluştu:", checkError.message);
    return;
  }

  if (existingDay) {
    // Eğer gün zaten varsa, güncelle
    const { error: updateError } = await supabase
      .from("mission_days")
      .update({ status: newStatus, updated_at: new Date() })
      .eq("id", existingDay.id); // ✅ Güncellerken doğrudan ID'yi kullan

    if (updateError) {
      console.error("❌ Günlük durum güncellenirken hata oluştu:", updateError.message);
    }
  } else {
    // Eğer gün yoksa, yeni ekle
    const { error: insertError } = await supabase
      .from("mission_days")
      .insert([{ mission_id: missionId, user_id: userId, day_number: dayNumber, status: newStatus }]);

    if (insertError) {
      console.error("❌ Yeni gün eklenirken hata oluştu:", insertError.message);
    }
  }
}

