import { Link } from 'react-router-dom';
import { MapPin, Calendar, Building2 } from 'lucide-react';
import type { Job } from '@/data/mockJobs';

const categoryColorMap: Record<string, string> = {
  'حكومية': 'category-government',
  'عسكرية': 'category-military',
  'شركات': 'category-corporate',
  'تدريب': 'category-training',
};

const JobCard = ({ job }: { job: Job }) => {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-card rounded-lg border border-border p-5 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm leading-snug mb-1 line-clamp-2">{job.title}</h3>
          <p className="text-xs text-muted-foreground mb-3">{job.company}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${categoryColorMap[job.category]}`}>
              {job.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {job.city}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(job.publishDate).toLocaleDateString('ar-SA')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
