import { useState } from 'react'
import { supabase, nameToEmail } from '../supabase'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    const parts = name.trim().split(/\s+/)
    if (parts.length < 3) return setError('يرجى إدخال الاسم الثلاثي كاملاً')
    if (password.length < 6) return setError('كلمة المرور 6 أحرف على الأقل')
    setBusy(true)
    const email = await nameToEmail(name)
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('الاسم أو كلمة المرور غير صحيحة')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message.includes('already') ? 'هذا الاسم مسجّل مسبقاً' : error.message)
      else if (data.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, full_name: name.trim() })
      }
    }
    setBusy(false)
  }

  return (
    <div className="mx-auto mt-16 max-w-sm p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">تطبيق الطالب الجامعي</h1>
      <form onSubmit={submit} className="space-y-3 rounded-xl bg-white p-5 shadow">
        <input
          className="w-full rounded-lg border p-2"
          placeholder="الاسم الثلاثي"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded-lg border p-2"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-indigo-600 p-2 font-medium text-white disabled:opacity-50">
          {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-sm text-indigo-600"
        >
          {mode === 'login' ? 'ليس لديك حساب؟ أنشئ حساباً' : 'لديك حساب؟ سجّل الدخول'}
        </button>
      </form>
    </div>
  )
}
