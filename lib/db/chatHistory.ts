import { createClient } from "@/utils/supabase/client"
const supabase = createClient()

// ✅ Mesaj ekle
// chatHistory.ts
export async function addChatMessage(
  userId: string,
  role: "user" | "assistant",
  content: string
): Promise<{ id: number; role: "user" | "assistant"; content: string; created_at: string } | null> {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert([{ user_id: userId, role, content }])
    .select()

  if (error || !data || data.length === 0) {
    console.error("❌ Mesaj kaydedilemedi:", error?.message)
    return null
  }

  return {
    id: data[0].id,
    role: data[0].role,
    content: data[0].content,
    created_at: data[0].created_at,
  }
}


// ✅ Kullanıcının geçmişini getir
export async function getChatHistory(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id,content, role,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Chat geçmişi alınamadı:", error.message);
    return [];
  }

  return data || [];
}

export async function deleteAllMessages(userId: string) {
  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("user_id", userId)

  if (error) console.error("❌ Sohbet silinemedi:", error.message)
}

export async function deleteMessagesInRange(userId: string, startDate: string, endDate: string) {
  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("user_id", userId)
    .gte("created_at", startDate)
    .lte("created_at", endDate)

  if (error) console.error("❌ Belirtilen aralıkta sohbet silinemedi:", error.message)
}


