import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const sbAuthToken = cookieStore.get("sb-auth-token");

  if (!sbAuthToken) {
    console.warn("⚠️ Sunucu Tarafında sb-auth-token Çerezi Yok! Middleware doğru çalışıyor mu?");
  } else {
    console.log("✅ Sunucu Tarafında sb-auth-token Alındı:", sbAuthToken);
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = cookieStore.getAll();
          console.log("✅ Sunucu Tarafında Çerezler:", allCookies);
          return allCookies;
        },
        setAll(cookiesToSet) {
          try {
            console.log("✅ Çerezler Sunucuya Set Ediliyor:", cookiesToSet);
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error("❌ Çerez Setlenirken Hata:", error);
          }
        },
      },
    }
  );
}
