import { useParams, Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Building2, ExternalLink, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { useJob } from '@/hooks/useJobs';
import { mockJobs } from '@/data/mockJobs';

const JobDetail = () => {
  const { id } = useParams();
  const { data: dbJob, isLoading } = useJob(id || '');

  const mockJob = mockJobs.find((j) => j.id === id);
  const job = dbJob
    ? { id: dbJob.id, title: dbJob.title, company: dbJob.company_name, city: dbJob.city, category: dbJob.category, description: dbJob.description || '', requirements: dbJob.requirements || [], applyLink: dbJob.apply_link || '', publishDate: dbJob.publish_date, source: dbJob.source || '' }
    : mockJob;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container py-8"><div className="bg-card rounded-xl border border-border p-8 animate-pulse h-64" /></div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead title="الوظيفة غير موجودة" description="الوظيفة المطلوبة غير موجودة أو تم حذفها" />
        <Header />
        <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">الوظيفة غير موجودة</p></div>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({ title: job.title, text: `${job.title} - ${job.company}`, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const jobJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || job.title,
    datePosted: job.publishDate,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city,
        addressCountry: 'SA',
      },
    },
    employmentType: 'FULL_TIME',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${job.title} - ${job.company}`}
        description={`وظيفة ${job.title} في شركة ${job.company} بمدينة ${job.city}. ${job.description?.slice(0, 120) || 'قدّم الآن'}`}
        canonical={`https://jobconnect-ksa.lovable.app/jobs/${job.id}`}
        type="article"
        jsonLd={jobJsonLd}
      />
      <Header />
      <div className="container py-8">
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowRight className="w-4 h-4" /> العودة للوظائف
        </Link>

        <div className="bg-card rounded-xl border border-border p-6 md:p-8 card-shadow">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">{job.title}</h1>
                <p className="text-muted-foreground font-medium">{job.company}</p>
              </div>
            </div>
            <button onClick={handleShare} className="p-2.5 rounded-lg border border-border hover:bg-muted transition-colors shrink-0">
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground"><MapPin className="w-4 h-4" /> {job.city}</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground"><Calendar className="w-4 h-4" /> {new Date(job.publishDate).toLocaleDateString('ar-SA')}</span>
          </div>

          {job.description && (
            <div className="mb-6">
              <h2 className="font-bold text-foreground mb-2">وصف الوظيفة</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="font-bold text-foreground mb-2">الشروط والمتطلبات</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /> {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.applyLink && (
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg hero-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
              <ExternalLink className="w-4 h-4" /> التقديم على الوظيفة
            </a>
          )}
        </div>
      </div>
      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default JobDetail;
