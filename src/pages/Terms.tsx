import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="سياسة الاستخدام - مسارك" description="سياسة استخدام منصة مسارك للوظائف في المملكة العربية السعودية" />
      <Header />
      <main className="container py-10 flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-6">سياسة الاستخدام</h1>
        <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground leading-relaxed" dir="rtl">
          <p>باستخدامك لمنصة <strong className="text-foreground">مسارك</strong>، فإنك توافق على الالتزام بالشروط والأحكام التالية:</p>

          <h2 className="text-xl font-bold text-foreground mt-8">1. طبيعة الخدمة</h2>
          <p>منصة مسارك هي منصة إعلانية تعرض الوظائف المتاحة من مصادر متعددة. لا تُعد المنصة وسيطاً للتوظيف ولا تضمن الحصول على وظيفة.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">2. دقة المعلومات</h2>
          <p>نسعى لتقديم معلومات دقيقة ومحدثة، لكننا لا نتحمل المسؤولية عن أي أخطاء أو تغييرات في تفاصيل الوظائف المعلن عنها من قبل الجهات الموظفة.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">3. استخدام المحتوى</h2>
          <p>جميع المحتويات المنشورة على المنصة محمية بحقوق الملكية الفكرية. يُمنع نسخ أو إعادة نشر المحتوى دون إذن مسبق.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">4. سلوك المستخدم</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>عدم استخدام المنصة لأغراض غير مشروعة</li>
            <li>عدم محاولة اختراق أو تعطيل خدمات المنصة</li>
            <li>عدم نشر محتوى مضلل أو مسيء</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8">5. الروابط الخارجية</h2>
          <p>قد تحتوي المنصة على روابط لمواقع خارجية. لا نتحمل المسؤولية عن محتوى أو سياسات تلك المواقع.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">6. التعديلات</h2>
          <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يُعد استمرارك في استخدام المنصة موافقة على التعديلات.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
