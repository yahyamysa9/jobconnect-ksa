import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { categories } from '@/data/mockJobs';

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">التصنيفات</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={`/jobs?category=${encodeURIComponent(cat.label)}`}
              className="bg-card rounded-xl border border-border p-8 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h2 className="font-bold text-foreground text-lg mb-1">وظائف {cat.label}</h2>
              <p className="text-sm text-muted-foreground">{cat.count} وظيفة متاحة</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Categories;
