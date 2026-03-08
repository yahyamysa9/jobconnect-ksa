import { Link } from 'react-router-dom';
import { categories } from '@/data/mockJobs';

const CategoryGrid = () => {
  return (
    <section className="container py-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">تصفح حسب التصنيف</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            to={`/jobs?category=${encodeURIComponent(cat.label)}`}
            className="bg-card rounded-xl border border-border p-5 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5 text-center"
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <h3 className="font-bold text-foreground text-sm mb-1">وظائف {cat.label}</h3>
            <p className="text-xs text-muted-foreground">{cat.count} وظيفة</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
