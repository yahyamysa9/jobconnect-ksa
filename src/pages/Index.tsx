import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import JobCard from '@/components/JobCard';
import { mockJobs } from '@/data/mockJobs';

const Index = () => {
  const latestJobs = [...mockJobs].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <CategoryGrid />

      <section className="container pb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">أحدث الوظائف</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestJobs.map((job, i) => (
            <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Index;
