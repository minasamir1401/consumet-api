# متغيرات البيئة (Environment Variables)

## الملفات ذات الصلة:
- `.env.example` — قالب المتغيرات (يُرفع إلى GitHub)
- `.env` — ملف البيئة الفعلي المحلي (لا يُرفع — مُحمي بـ .gitignore)

---

## المتغيرات المتاحة:

### متطلب (Required):
- **PORT** — منفذ الخادم (افتراضي: 3000)

### اختياري (Optional):
- **NODE_ENV** — بيئة التشغيل (DEMO أو PROD)
- **REDIS_HOST** — مضيف Redis للتخزين المؤقت
- **REDIS_PORT** — منفذ Redis
- **REDIS_PASSWORD** — كلمة مرور Redis
- **REDIS_TTL** — مدة التخزين المؤقت بالثواني
- **TMDB_KEY** — مفتاح TMDB API (للأفلام والمسلسلات)
- **LOG_LEVEL** — مستوى السجل (info, debug, error)

---

## كيفية استخدام على Render:

1. في لوحة تحكم Render، افتح خدمتك `consumet-api`
2. اذهب إلى "Environment" أو "Settings"
3. أضف متغيرات البيئة:
   ```
   PORT=3000
   NODE_ENV=production
   REDIS_HOST=(اتركه فارغاً إن لم تكن تستخدم Redis)
   TMDB_KEY=(أضف مفتاحك إن كان لديك)
   ```

---

## محلياً (للتطوير):

1. حرّر ملف `.env` في مجلد `api.consumet.org-main/`
2. أضف قيمك المفضلة
3. شغّل: `npm start` أو `npm run dev`

---

ملاحظة: ملف `.env` لا يُرفع إلى GitHub لأسباب أمان. استخدم `.env.example` كمرجع.
