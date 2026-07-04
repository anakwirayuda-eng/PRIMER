import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anonKey) {
  throw new Error(
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi — salin .env.example ke .env'
  )
}

export const supabase: SupabaseClient = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
})

function tunggu(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Sign-in anonim dengan retry backoff+jitter — puluhan HP kelas login serentak
 * di belakang NAT kampus sering kena rate-limit 429 Supabase. Kalau 4 percobaan
 * tetap gagal, lanjut TANPA auth_uid ("best-effort") daripada mengunci sesi.
 */
export async function pastikanSesiAnon(): Promise<string | null> {
  const { data: existing } = await supabase.auth.getSession()
  if (existing.session?.user?.id) return existing.session.user.id

  const percobaanMaks = 4
  for (let percobaan = 0; percobaan < percobaanMaks; percobaan++) {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (!error && data.user?.id) return data.user.id

    const basis = 300 * Math.pow(2, percobaan)
    const jitter = Math.random() * 200
    await tunggu(basis + jitter)
  }

  console.warn('pastikanSesiAnon: gagal setelah retry, lanjut best-effort tanpa auth_uid')
  return null
}
