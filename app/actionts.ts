"use client";

import { createClient } from "@/utils/supabase/client";
import { saveUserToDB } from "@/lib/db/user";

export async function checkOrCreateUser() {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getSession();

  if (!session?.session) return null;

  const userId = session.session.user.id;
  const email = session.session.user.email;
  const profileImage = session.session.user.user_metadata?.avatar_url || null;

  await saveUserToDB(userId, email, profileImage);
  return session.session.user;
}
