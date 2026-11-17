import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
const empty = { subject: '', day: DAYS[0], start_time: '', end_time: '', room: '' }

export default function Schedule() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)

  async function load() {
    const { data } = await supabase.from('lectures').select('*').order('start_time')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function add(e) {
    e.preventDefault()
    const row = { ...form, end_time: form.end_time || null }
    const { error } = await supabase.from('lectures').insert(row)
    if (!error) { setForm(empty); load() }
  }

  async function remove(id) {
    await supabase.from('lectures').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid grid-cols-2 gap-2 rounded-xl bg-white p-4 shadow">
        <input required className="col-span-2 rounded-lg border p-2" placeholder="اسم المادة" value={form.subject} onChange={set('subject')} />
        <select className="rounded-lg border p-2" value={form.day} onChange={set('day')}>
          {DAYS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <input className="rounded-lg border p-2" placeholder="القاعة" value={form.room} onChange={set('room')} />
        <label className="text-xs text-slate-500">من<input required type="time" className="w-full rounded-lg border p-2 text-base text-slate-900" value={form.start_time} onChange={set('start_time')} /></label>
        <label className="text-xs text-slate-500">إلى<input type="time" className="w-full rounded-lg border p-2 text-base text-slate-900" value={form.end_time} onChange={set('end_time')} /></label>
        <button className="col-span-2 rounded-lg bg-indigo-600 p-2 font-medium text-white">إضافة محاضرة</button>
      </form>

      {DAYS.map((day) => {
        const list = items.filter((i) => i.day === day)
        if (!list.length) return null
        return (
          <section key={day}>
            <h3 className="mb-1 font-bold">{day}</h3>
            <ul className="space-y-2">
              {list.map((l) => (
                <li key={l.id} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                  <div>
                    <p className="font-medium">{l.subject}</p>
                    <p className="text-sm text-slate-500">
                      {l.start_time?.slice(0, 5)}{l.end_time ? ` - ${l.end_time.slice(0, 5)}` : ''}
                      {l.room ? ` • قاعة ${l.room}` : ''}
                    </p>
                  </div>
                  <button onClick={() => remove(l.id)} className="text-sm text-red-600">حذف</button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {!items.length && <p className="text-center text-slate-500">لا توجد محاضرات بعد</p>}
    </div>
  )
}
