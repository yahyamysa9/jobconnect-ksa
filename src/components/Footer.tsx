import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-bold">و</span>
              </div>
              <span className="text-lg font-bold text-foreground">وظيفتك</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة سعودية لعرض أحدث الوظائف الحكومية والعسكرية ووظائف القطاع الخاص وبرامج التدريب.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-3">روابط سريعة</h3>
            <div className="space-y-2">
              <Link to="/jobs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">جميع الوظائف</Link>
              <Link to="/categories" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">التصنيفات</Link>
              <Link to="/cities" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">المدن</Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">من نحن</Link>
              <Link to="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">سياسة الاستخدام</Link>
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">سياسة الخصوصية</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-3">التصنيفات</h3>
            <div className="space-y-2">
              <Link to="/jobs?category=حكومية" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">وظائف حكومية</Link>
              <Link to="/jobs?category=عسكرية" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">وظائف عسكرية</Link>
              <Link to="/jobs?category=شركات" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">وظائف شركات</Link>
              <Link to="/jobs?category=تدريب" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">تدريب</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">© 2026 وظيفتك - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
