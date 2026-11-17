# my-uni-app

نسخة أولية (MVP) لتطبيق ويب عربي للطلاب الجامعيين: الملف الشخصي، جدول المحاضرات، وسجل الدرجات.

## التشغيل محلياً
```
cp .env.example .env   # ثم املأ مفاتيح Supabase
npm install
npm run dev
```

## قاعدة البيانات
شغّل الملف `supabase/schema.sql` في Supabase ← SQL Editor.
وعطّل Confirm email من Authentication ← Providers ← Email.

## النشر على Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- المتغيرات: `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`
