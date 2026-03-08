import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { mockJobs, categories, cities } from '@/data/mockJobs';
import { useState, useMemo } from 'react';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialCity = searchParams.get('city') || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      if (selectedCategory && job.category !== selectedCategory) return false;
      if (selectedCity && job.city !== selectedCity) return false;
      return true;
    });
  }, [selectedCategory, selectedCity]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">جميع الوظائف</h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">كل التصنيفات</option>
            {categories.map((c) => (
              <option key={c.label} value={c.label}>{c.label}</option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">كل المدن</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filteredJobs.length} وظيفة</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">لا توجد وظائف مطابقة للبحث</p>
          </div>
        )}
      </div>

      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Jobs;
