import { createClient } from "@/utils/supabase/client";

export async function saveUserToDB(userId: string, email: string, profileImage: string | null) {
  const supabase = createClient();

  // Kullanıcı zaten kayıtlı mı kontrol et
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email) // ✅ Email ile kontrol ediyoruz!
    .single();

  if (existingUser) {
    console.log("✅ Kullanıcı zaten kayıtlı:",checkError,":", existingUser.id);
    return;
  }

  // Kullanıcıyı kaydet
  const { error: insertError } = await supabase
    .from("users")
    .insert([{ id: userId, email, profile_image: profileImage }]);

  if (insertError) {
    console.error("❌ Kullanıcı eklenirken hata oluştu:", insertError.message);
  }
}
