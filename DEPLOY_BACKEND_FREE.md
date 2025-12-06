# نشر الـ Backend مجاناً على Render

## الخطوات السريعة:

### 1. ادفع المستودع إلى GitHub (أو GitLab):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/anime-api.git
git push -u origin main
```

### 2. انشئ حساب مجاني على Render:
- اذهب إلى: https://render.com
- اشترك بـ GitHub account

### 3. أنشئ خدمة جديدة على Render:
1. في Dashboard، اضغط "New +" ثم اختر "Web Service"
2. اختر مستودع GitHub الخاص بـ `api.consumet.org-main`
3. ملء التفاصيل:
   - **Name**: `consumet-api` (أو أي اسم)
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Build Command**: (اترك فارغ أو `npm install && npm run build`)
   - **Start Command**: `npm start`
   - **Plan**: اختر `Free` (مجاني)

4. اضغط "Deploy"

### 4. بعد النشر (5-10 دقائق):
- ستحصل على رابط الخدمة (مثل: `https://consumet-api.onrender.com`)
- احفظ هذا الرابط

### 5. تحديث الواجهة لاستخدام الـ API:
في `anime-react-app/src/App.jsx` أو أي ملف يستخدم الـ API:
```javascript
const API_URL = 'https://consumet-api.onrender.com';
// ثم استخدم: fetch(API_URL + '/api/...')
```

### 6. أعد نشر الواجهة:
```pwsh
cd C:\Users\Mina\Desktop\anime_scraper-main\anime-react-app
npm run build
firebase deploy --only hosting
```

---

## ملاحظات مهمة:
- الخطة المجانية على Render قد تكون بطيئة أو قد توقف الخدمة بعد فترة عدم استخدام
- للحصول على أداء أفضل، يمكنك الترقية إلى خطة مدفوعة ($5/شهر فما فوق)
- خيار آخر مجاني: Railway.app أو Fly.io

---

## البديل: نشر على Railway (مجاني أيضًا):
- اذهب إلى: https://railway.app
- اتصل بـ GitHub
- اختر المستودع ونشّر (بنفس الخطوات تقريباً)
