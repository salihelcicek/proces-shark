'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const signInWith = provider => async () => {
  const supabase = await createClient()

  const auth_callback_url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    },
  })

  if (error) {
    console.log(error)
  }

  redirect(data.url)
}

export const signinWithGoogle = signInWith('google')