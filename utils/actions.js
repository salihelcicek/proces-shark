'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createUrl } from '@/utils/environment'

const signInWith = provider => async () => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: createUrl('/dashboard'),
    },
  })

  if (error) {
    console.log(error)
  }

  redirect(data.url)
}

export const signinWithGoogle = signInWith('google')