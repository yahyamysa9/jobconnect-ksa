import { Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">م</span>
          </div>
          <span className="text-xl font-bold text-foreground">مسارك</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">الرئيسية</Link>
          <Link to="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">الوظائف</Link>
          <Link to="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">التصنيفات</Link>
          <Link to="/cities" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">المدن</Link>
        </nav>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link to="/search" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Link>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card p-4 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-foreground">الرئيسية</Link>
          <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-foreground">الوظائف</Link>
          <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-foreground">التصنيفات</Link>
          <Link to="/cities" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-foreground">المدن</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
