# نشر الواجهة والباك-إند (Firebase Hosting + Cloud Run)

ملف هذا يشرح خطوة بخطوة كيفية نشر المشروع الموجود في هذا المستودع:
- الواجهة: `anime-react-app` (Vite)
- الباك‑إند: `api.consumet.org-main` (Fastify, يوجد `Dockerfile`)

متطلبات سابقة
- حساب Google Cloud مع تمكين Billing (مطلوب لنشر Cloud Run).
- تثبيت الأدوات محليًا: `gcloud` و`firebase-tools` و`npm`.

أوامر سريعة لإعداد الأدوات (PowerShell):
```pwsh
# تثبيت Firebase CLI
npm install -g firebase-tools
firebase login

# تثبيت Google Cloud SDK (إذا لم يكن مثبتًا). اتبع التعليمات من https://cloud.google.com/sdk/docs/install
gcloud auth login
# اختر المشروع
gcloud config set project YOUR_GCP_PROJECT_ID
```

1) بناء ونشر الباك‑إند على Cloud Run

- من داخل مجلد الباك‑إند:
```pwsh
cd c:\Users\Mina\Desktop\anime_scraper-main\api.consumet.org-main
# تبني وترفع صورة الحاوية إلى Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_GCP_PROJECT_ID/consumet-api

# أو استخدم Artifact Registry (مفضل للمشروعات الجديدة)
#gcloud builds submit --tag REGION-docker.pkg.dev/YOUR_GCP_PROJECT_ID/REPOSITORY/consumet-api

# نشر على Cloud Run
gcloud run deploy consumet-api \
  --image gcr.io/YOUR_GCP_PROJECT_ID/consumet-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000

# بعد النشر سيتم طباعة URL الخدمة، احتفظ به (مثلاً: https://consumet-api-xxxxx.a.run.app)
```

2) بناء الواجهة (Vite)

```pwsh
cd c:\Users\Mina\Desktop\anime_scraper-main\anime-react-app
npm install
npm run build
# الناتج سيكون في مجلد `dist` حسب `firebase.json` الموجود
```

3) إعداد Firebase Hosting لواجهة الـ React وتهيئة rewrite لنداء الـ API

- افتح `anime-react-app\firebase.json` وستجد إعداد Hosting موجود. لتوجيه طلبات الـ API إلى خدمة Cloud Run داخل نفس مشروع GCP استخدم rewrite من نوع `run`، مثال:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      { "source": "/api/**", "run": { "serviceId": "consumet-api", "region": "us-central1" } },
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

ملاحظات:
- `serviceId` يجب أن يكون اسم خدمة Cloud Run الذي اخترته عند النشر (`consumet-api` بالمثال).
- `region` نفس المنطقة التي نشرت بها الخدمة على Cloud Run.

4) تهيئة Firebase وربط المشروع ثم النشر

```pwsh
cd c:\Users\Mina\Desktop\anime_scraper-main\anime-react-app
firebase login
firebase init hosting
# اختر المشروع GCP نفسه، واكد أن المجلد العام هو `dist`, لا تقم بإعادة كتابة index.html عندما يسألك

firebase deploy --only hosting
```

بعد ذلك، عند زيارة موقع Firebase Hosting سترى الواجهة، وأي طلب إلى `/api/...` سيتم توجيهه إلى خدمة Cloud Run.

نصائح وحلول مشاكل محتملة
- إن أردت استخدام اسم نطاق مخصص، استخدم `firebase hosting:sites:connect` أو اذهب إلى Console > Hosting > Connect domain.
- إن لم يكن لديك صلاحيات تمكين Cloud Run أو billing، أخبرني وأنا أقدّم خيار نشر بديل (Firebase Functions)، لكن يتطلب تعديل الكود.

إذا تحب أقدر: أكتب سكربت نشر أو أعدّل `firebase.json` تلقائيًا، وأجهز ملف `cloudbuild.yaml` لتشغيل CI/CD مع Cloud Build.
