import { createClient } from "@/utils/supabase/client";

export async function getUserSession() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    console.error("❌ Kullanıcı oturumu alınamadı:", error?.message);
    return null;
  }

  return session.user; // ✅ Kullanıcı bilgilerini döndürüyor
}