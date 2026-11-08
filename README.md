# Asia Coffee — بن آسيا | Cloudflare Pages

واجهة عربية لموقع Asia Coffee (بن آسيا)، بهوية ذهبية وبنية وسوداء وخلفيات بيج، باستخدام اللوجو واليافطة المرسلين، مع فصل مسار إدارة المطعم عن مسار المطور.

## المسارات
- `/` واجهة العملاء والمنيو.
- `/admin` دخول إدارة المطعم: إدارة الأقسام والمنتجات والأسعار.
- `/admin/developer` دخول المطور: إدارة خطط واشتراكات صاحب المطعم وإعدادات النظام.

## التقنية
- واجهة HTML/CSS/JavaScript بدون خطوة build.
- Cloudflare Pages Functions للـ API.
- Cloudflare D1 لحفظ المنتجات والاشتراكات والإعدادات.
- `migrations/0001_initial.sql` لإنشاء الجداول الأساسية.

## إعداد Cloudflare
1. أنشئ قاعدة D1 باسم `ben-asia-db`.
2. انسخ Database ID إلى `wrangler.toml` بدل `REPLACE_WITH_D1_DATABASE_ID`.
3. نفّذ: `npx wrangler d1 migrations apply ben-asia-db --remote`
4. اربط GitHub repository بمشروع Pages، واجعل Build command فارغًا ومجلد النشر `public`.
5. أضف المتغيرات في Pages → Settings → Variables and Secrets (Production وPreview حسب الحاجة):
   - `ADMIN_PASSWORD` — Secret: كلمة مرور لوحة الأدمن.
   - `DEVELOPER_PASSWORD` — Secret: كلمة مرور المطور.
   - `SESSION_SECRET` — Secret عشوائي طويل (32 بايت أو أكثر).
   - `APP_ENV` — Text: `production`.
   - `APP_TIMEZONE` — Text: `Africa/Cairo`.
6. اربط D1 باسم binding `DB` في إعدادات Pages أو من خلال إعداد `wrangler.toml`.

## تنبيه مهم
هذا تسليم تأسيسي وليس نسخة تشغيل نهائية: تسجيل الدخول هنا نقطة بداية، ويلزم استكمال rate limiting، تدوير/إبطال الجلسات، صفحات لوحات التحكم الفعلية، والتحقق من الصلاحيات على كل API قبل نشر الموقع للعامة. لا تضع كلمات المرور أو أسرار Cloudflare داخل GitHub أو ملفات الواجهة.

## المتفق عليه للصلاحيات
- الأدمن يدير المنيو والمنتجات والأسعار.
- المطور وحده يدير منتج/خطة اشتراك صاحب المطعم، مدته، تجديده، إنهاءه، ومتابعة حالته.
- الكوبونات والإحالة اختيارية وقابلة للتحكم من إعدادات النظام، مع تحديد الخصم والنطاق والمدة.
- منتجات البن منفصلة عن المشروبات (`product_type = coffee_bean`).
