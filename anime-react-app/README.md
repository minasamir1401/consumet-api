# موقع الأنمي - AnimeHub

موقع أنمي عصري مبني باستخدام React و Flask API.

## 🚀 كيفية التشغيل

### 1. تشغيل Flask API (Backend)

```bash
# في نافذة Terminal أولى
cd c:\Users\Mina\Desktop\anime_scraper-main
python main.py
```

سيعمل الـ API على: **http://localhost:5000**

### 2. تشغيل React App (Frontend)

```bash
# في نافذة Terminal ثانية
cd c:\Users\Mina\Desktop\anime_scraper-main\anime-react-app
npm run dev
```

سيعمل الموقع على المنفذ الذي يظهر في Terminal (عادةً 5173 أو 5176)

### 3. فتح الموقع

افتح المتصفح واذهب إلى الرابط الذي يظهر في Terminal:

- مثال: **http://localhost:5176**

---

## 🎯 المميزات

- ✅ واجهة عربية (RTL)
- ✅ Hero section جميل
- ✅ أحدث الحلقات من witanime
- ✅ الأنميات الموسمية
- ✅ البحث عن الأنمي
- ✅ تفاصيل الأنمي مع الحلقات
- ✅ تصميم عصري مع تأثيرات حركية

---

## 🔧 حل المشاكل

### المحتوى لا يظهر؟

1. **تأكد من تشغيل Flask API**:

   ```bash
   # اذهب إلى http://localhost:5000/latest-episodes في المتصفح
   # يجب أن ترى بيانات JSON
   ```

2. **افحص Console في المتصفح**:

   - اضغط F12
   - انظر إلى Console
   - ابحث عن رسائل الأخطاء

3. **تأكد من CORS**:

   - تأكد أن ملف `main.py` يحتوي على `flask_cors`
   - قم بإعادة تشغيل Flask API

4. **امسح Cache**:
   - اضغط **Ctrl + Shift + R** في المتصفح

---

## 📁 بنية المشروع

```
anime_scraper-main/
├── main.py              # Flask API
├── wit_anime.py         # Scraper functions
├── anime-react-app/     # React Frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── ...
│   └── index.html
```

---

## 👨‍💻 المطور

**Mina Samir** - Front-End Developer

---

## 📝 ملاحظات

- تأكد من تشغيل **كلا السيرفرين** (Flask و React) في نفس الوقت
- Flask يجب أن يعمل على المنفذ **5000**
- React سيعمل تلقائياً على منفذ متاح (5173، 5174، 5175، أو 5176)
