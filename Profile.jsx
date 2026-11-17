import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Profile({ user }) {
  const [form, setForm] = useState({ full_name: '', university: '', major: '', study_year: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => data && setForm({
        full_name: data.full_name || '',
        university: data.university || '',
        major: data.major || '',
        study_year: data.study_year || '',
      }))
  }, [user.id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function save(e) {
    e.preventDefault()
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...form, updated_at: new Date().toISOString() })
    setMsg(error ? 'تعذّر الحفظ' : 'تم الحفظ ✓')
  }

  return (
    <form onSubmit={save} className="space-y-3 rounded-xl bg-white p-5 shadow">
      <input className="w-full rounded-lg border p-2" placeholder="الاسم الثلاثي" value={form.full_name} onChange={set('full_name')} />
      <input className="w-full rounded-lg border p-2" placeholder="اسم الجامعة" value={form.university} onChange={set('university')} />
      <input className="w-full rounded-lg border p-2" placeholder="التخصص / الكلية" value={form.major} onChange={set('major')} />
      <input className="w-full rounded-lg border p-2" placeholder="السنة الدراسية (مثال: الثانية)" value={form.study_year} onChange={set('study_year')} />
      <button className="w-full rounded-lg bg-indigo-600 p-2 font-medium text-white">حفظ</button>
      {msg && <p className="text-center text-sm text-slate-600">{msg}</p>}
    </form>
  )
}
