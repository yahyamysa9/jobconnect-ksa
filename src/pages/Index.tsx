import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import JobCard from '@/components/JobCard';
import SEOHead from '@/components/SEOHead';
import AdBanner from '@/components/AdBanner';
import { useJobs } from '@/hooks/useJobs';
import { mockJobs } from '@/data/mockJobs';

const Index = () => {
  const { data: dbJobs, isLoading } = useJobs();

  const jobs = dbJobs && dbJobs.length > 0
    ? dbJobs.map((j) => ({
        id: j.id,
        title: j.title,
        company: j.company_name,
        city: j.city,
        category: j.category as any,
        description: j.description || '',
        requirements: j.requirements || [],
        applyLink: j.apply_link || '',
        publishDate: j.publish_date,
        source: j.source || '',
      }))
    : mockJobs;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="أحدث الوظائف في السعودية"
        description="منصة وظيفتك لعرض أحدث الوظائف الحكومية والعسكرية ووظائف القطاع الخاص وبرامج التدريب في المملكة العربية السعودية"
        canonical="https://jobconnect-ksa.lovable.app/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'وظيفتك',
          url: 'https://jobconnect-ksa.lovable.app',
          description: 'منصة وظيفتك لعرض أحدث الوظائف في المملكة العربية السعودية',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://jobconnect-ksa.lovable.app/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <Header />
      <HeroSection />
      <CategoryGrid />
      <AdBanner className="container" />

      <section className="container pb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">أحدث الوظائف</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-card rounded-lg border border-border p-5 animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job, i) => (
              <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Index;
