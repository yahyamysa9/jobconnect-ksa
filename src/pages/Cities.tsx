import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cities, mockJobs } from '@/data/mockJobs';

const Cities = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">المدن</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {cities.map((city) => {
            const count = mockJobs.filter((j) => j.city === city).length;
            return (
              <Link
                key={city}
                to={`/jobs?city=${encodeURIComponent(city)}`}
                className="bg-card rounded-xl border border-border p-5 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5 text-center"
              >
                <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                <h2 className="font-bold text-foreground text-sm">{city}</h2>
                <p className="text-xs text-muted-foreground mt-1">{count} وظيفة</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Cities;
