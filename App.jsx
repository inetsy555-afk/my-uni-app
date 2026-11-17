import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Schedule from './pages/Schedule'
import Grades from './pages/Grades'

const TABS = [
  { id: 'schedule', label: 'جدول المحاضرات' },
  { id: 'grades', label: 'الدرجات' },
  { id: 'profile', label: 'ملفي' },
]

export default function App() {
  const [session, setSession] = useState(undefined)
  const [tab, setTab] = useState('schedule')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <p className="p-6 text-center">جارٍ التحميل...</p>
  if (!session) return <Auth />

  return (
    <div className="mx-auto max-w-2xl p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">تطبيق الطالب</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-red-600">
          تسجيل الخروج
        </button>
      </header>
      <nav className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
              tab === t.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 shadow-sm'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {tab === 'schedule' && <Schedule />}
      {tab === 'grades' && <Grades />}
      {tab === 'profile' && <Profile user={session.user} />}
    </div>
  )
}
