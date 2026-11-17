import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const empty = { subject: '', study_year: '', score: '' }

export default function Grades() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)

  async function load() {
    const { data } = await supabase.from('grades').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function add(e) {
    e.preventDefault()
    const { error } = await supabase.from('grades').insert({ ...form, score: Number(form.score) })
    if (!error) { setForm(empty); load() }
  }

  async function remove(id) {
    await supabase.from('grades').delete().eq('id', id)
    load()
  }

  const avg = items.length ? (items.reduce((s, i) => s + Number(i.score), 0) / items.length).toFixed(1) : null

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid grid-cols-2 gap-2 rounded-xl bg-white p-4 shadow">
        <input required className="col-span-2 rounded-lg border p-2" placeholder="اسم المادة" value={form.subject} onChange={set('subject')} />
        <input required className="rounded-lg border p-2" placeholder="السنة الدراسية" value={form.study_year} onChange={set('study_year')} />
        <input required type="number" min="0" max="100" step="0.01" className="rounded-lg border p-2" placeholder="الدرجة من 100" value={form.score} onChange={set('score')} />
        <button className="col-span-2 rounded-lg bg-indigo-600 p-2 font-medium text-white">إضافة درجة</button>
      </form>

      {avg && <p className="rounded-lg bg-indigo-50 p-3 text-center font-medium text-indigo-800">المعدل العام: {avg} / 100</p>}

      <ul className="space-y-2">
        {items.map((g) => (
          <li key={g.id} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
            <div>
              <p className="font-medium">{g.subject}</p>
              <p className="text-sm text-slate-500">السنة: {g.study_year}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">{Number(g.score)}</span>
              <button onClick={() => remove(g.id)} className="text-sm text-red-600">حذف</button>
            </div>
          </li>
        ))}
      </ul>
      {!items.length && <p className="text-center text-slate-500">لا توجد درجات بعد</p>}
    </div>
  )
}
