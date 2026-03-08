import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="سياسة الخصوصية - وظيفتك" description="سياسة الخصوصية لمنصة وظيفتك للوظائف في المملكة العربية السعودية" />
      <Header />
      <main className="container py-10 flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-6">سياسة الخصوصية</h1>
        <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground leading-relaxed" dir="rtl">
          <p>نلتزم في <strong className="text-foreground">وظيفتك</strong> بحماية خصوصية مستخدمينا. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">1. المعلومات التي نجمعها</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>معلومات التصفح مثل عنوان IP ونوع المتصفح</li>
            <li>ملفات تعريف الارتباط (الكوكيز) لتحسين تجربة الاستخدام</li>
            <li>بيانات الاستخدام والتفاعل مع المنصة</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8">2. كيفية استخدام المعلومات</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>تحسين وتطوير خدمات المنصة</li>
            <li>تخصيص المحتوى المعروض</li>
            <li>تحليل أنماط الاستخدام لتحسين الأداء</li>
            <li>عرض إعلانات مناسبة عبر Google AdSense</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8">3. ملفات تعريف الارتباط</h2>
          <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">4. الإعلانات</h2>
          <p>نستخدم خدمة Google AdSense لعرض الإعلانات. قد تستخدم Google ملفات تعريف الارتباط لعرض إعلانات مخصصة بناءً على اهتماماتك.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">5. حماية البيانات</h2>
          <p>نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">6. مشاركة المعلومات</h2>
          <p>لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التي يتطلبها القانون.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">7. التواصل</h2>
          <p>لأي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر المنصة.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
