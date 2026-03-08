import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { useJobs, useCategories, useCities } from '@/hooks/useJobs';
import { mockJobs, categories as defaultCategories, cities as defaultCities } from '@/data/mockJobs';
import { useState } from 'react';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialCity = searchParams.get('city') || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);

  const { data: dbJobs, isLoading } = useJobs({
    category: selectedCategory || undefined,
    city: selectedCity || undefined,
  });
  const { data: dbCategories } = useCategories();
  const { data: dbCities } = useCities();

  const cats = dbCategories && dbCategories.length > 0 ? dbCategories : defaultCategories.map((c, i) => ({ id: String(i), name: c.label, icon: c.icon, created_at: '' }));
  const cits = dbCities && dbCities.length > 0 ? dbCities : defaultCities.map((c, i) => ({ id: String(i), name: c, created_at: '' }));

  const jobs = dbJobs && dbJobs.length > 0
    ? dbJobs.map((j) => ({ id: j.id, title: j.title, company: j.company_name, city: j.city, category: j.category as any, description: j.description || '', requirements: j.requirements || [], applyLink: j.apply_link || '', publishDate: j.publish_date, source: j.source || '' }))
    : mockJobs.filter((job) => {
        if (selectedCategory && job.category !== selectedCategory) return false;
        if (selectedCity && job.city !== selectedCity) return false;
        return true;
      });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">جميع الوظائف</h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">كل التصنيفات</option>
            {cats.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">كل المدن</option>
            {cits.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{jobs.length} وظيفة</p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="bg-card rounded-lg border border-border p-5 animate-pulse h-32" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}

        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-16"><p className="text-muted-foreground">لا توجد وظائف مطابقة للبحث</p></div>
        )}
      </div>
      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Jobs;
