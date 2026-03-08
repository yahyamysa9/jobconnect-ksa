import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="من نحن - وظيفتك" description="تعرف على منصة وظيفتك لعرض أحدث الوظائف في المملكة العربية السعودية" />
      <Header />
      <main className="container py-10 flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-6">من نحن</h1>
        <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground leading-relaxed" dir="rtl">
          <p>
            <strong className="text-foreground">وظيفتك</strong> هي منصة سعودية متخصصة في جمع وعرض أحدث الفرص الوظيفية في المملكة العربية السعودية، تشمل الوظائف الحكومية والعسكرية ووظائف القطاع الخاص وبرامج التدريب.
          </p>
          <p>
            نهدف إلى تسهيل عملية البحث عن العمل من خلال توفير منصة شاملة وسهلة الاستخدام تجمع الوظائف من مصادر متعددة وموثوقة في مكان واحد.
          </p>
          <h2 className="text-xl font-bold text-foreground mt-8">رؤيتنا</h2>
          <p>أن نكون المنصة الأولى والأكثر موثوقية للباحثين عن عمل في المملكة العربية السعودية.</p>
          <h2 className="text-xl font-bold text-foreground mt-8">رسالتنا</h2>
          <p>تمكين الباحثين عن عمل من الوصول إلى أحدث الفرص الوظيفية بسهولة وسرعة، مع ضمان دقة المعلومات وتحديثها بشكل مستمر.</p>
          <h2 className="text-xl font-bold text-foreground mt-8">ما نقدمه</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>عرض أحدث الوظائف الحكومية والعسكرية</li>
            <li>وظائف القطاع الخاص والشركات الكبرى</li>
            <li>برامج التدريب والتأهيل</li>
            <li>تصنيف الوظائف حسب المدينة والتخصص</li>
            <li>محرك بحث متقدم للعثور على الوظيفة المناسبة</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
