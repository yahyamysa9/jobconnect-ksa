import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { useJobs } from '@/hooks/useJobs';
import { mockJobs } from '@/data/mockJobs';
import { useState } from 'react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const { data: dbJobs } = useJobs({ search: query || undefined });

  const jobs = query.trim()
    ? (dbJobs && dbJobs.length > 0
        ? dbJobs.map((j) => ({ id: j.id, title: j.title, company: j.company_name, city: j.city, category: j.category as any, description: j.description || '', requirements: j.requirements || [], applyLink: j.apply_link || '', publishDate: j.publish_date, source: j.source || '' }))
        : mockJobs.filter((job) => {
            const q = query.trim().toLowerCase();
            return job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.city.toLowerCase().includes(q);
          }))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">البحث عن وظيفة</h1>
        <div className="relative max-w-2xl mb-8">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالكلمات المفتاحية..." className="w-full h-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>

        {query.trim() && <p className="text-sm text-muted-foreground mb-4">{jobs.length} نتيجة لـ "{query}"</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>

        {query.trim() && jobs.length === 0 && (
          <div className="text-center py-16"><p className="text-muted-foreground">لا توجد نتائج مطابقة</p></div>
        )}
      </div>
      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default SearchPage;
