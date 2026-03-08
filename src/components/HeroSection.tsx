import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="hero-gradient py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4 leading-tight">
          ابحث عن وظيفتك المثالية
        </h1>
        <p className="text-primary-foreground/80 text-base md:text-lg mb-8 max-w-xl mx-auto">
          أحدث الوظائف الحكومية والعسكرية ووظائف القطاع الخاص في المملكة العربية السعودية
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن وظيفة، شركة، أو مدينة..."
              className="w-full h-14 rounded-xl bg-primary-foreground text-foreground placeholder:text-muted-foreground px-5 pr-14 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              type="submit"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Search className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
