import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Supabase Auth يتطلب بريداً، لذلك نحوّل الاسم الثلاثي إلى بريد ثابت عبر SHA-256.
export async function nameToEmail(name) {
  const norm = name.trim().replace(/\s+/g, ' ').normalize('NFC')
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(norm))
  const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 40)
  return `${hex}@uni-students.app`
}
