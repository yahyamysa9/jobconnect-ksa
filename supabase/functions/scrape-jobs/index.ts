import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScrapedJob {
  title: string;
  company_name: string;
  city: string;
  category: string;
  description: string;
  apply_link: string;
  source_url: string;
  source: string;
}

function classifyCategory(title: string, companyName: string): string {
  const text = (title + ' ' + companyName).toLowerCase();
  if (text.includes('عسكري') || text.includes('جندي') || text.includes('ضابط') || text.includes('القوات') || text.includes('الدفاع') || text.includes('الحرس') || text.includes('أمن عام')) return 'عسكرية';
  if (text.includes('تدريب') || text.includes('تمهير') || text.includes('تعاوني') || text.includes('منتهي بالتوظيف') || text.includes('دبلوم') || text.includes('دور')) return 'تدريب';
  if (text.includes('وزارة') || text.includes('هيئة') || text.includes('حكومي') || text.includes('ديوان') || text.includes('أمانة') || text.includes('جامعة') || text.includes('صندوق') || text.includes('مركز وطني') || text.includes('مكتبة الملك')) return 'حكومية';
  return 'شركات';
}

function extractCity(text: string): string {
  const cities: Record<string, string> = {
    'الرياض': 'الرياض', 'بالرياض': 'الرياض',
    'جدة': 'جدة', 'بجدة': 'جدة',
    'الدمام': 'الدمام', 'بالدمام': 'الدمام',
    'مكة': 'مكة المكرمة', 'بمكة': 'مكة المكرمة',
    'المدينة المنورة': 'المدينة المنورة', 'بالمدينة': 'المدينة المنورة',
    'أبها': 'أبها', 'تبوك': 'تبوك', 'حائل': 'حائل',
    'الطائف': 'الطائف', 'نجران': 'نجران', 'الظهران': 'الظهران',
    'الخبر': 'الخبر', 'الأحساء': 'الأحساء', 'بالأحساء': 'الأحساء',
    'الجبيل': 'الجبيل', 'ينبع': 'ينبع', 'بريدة': 'بريدة',
    'خميس مشيط': 'خميس مشيط', 'القصيم': 'القصيم',
  };
  for (const [key, city] of Object.entries(cities)) {
    if (text.includes(key)) return city;
  }
  return 'متعددة المدن';
}

// ===== Source: أي وظيفة (ewdifh.com) =====
function parseEwdifhJobs(markdown: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  const lines = markdown.split('\n').map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const logoMatch = lines[i].match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (!logoMatch) continue;

    const nextLine = lines[i + 1];
    if (!nextLine) continue;
    const titleMatch = nextLine.match(/^\[([^\]]+)\]\((https:\/\/www\.ewdifh\.com\/jobs\/\d+)\)$/);
    if (!titleMatch) continue;

    const jobTitle = titleMatch[1].trim();
    const jobUrl = titleMatch[2];

    const companyLine = lines[i + 2];
    let companyName = logoMatch[1] || 'غير محدد';
    if (companyLine) {
      const companyMatch = companyLine.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (companyMatch) companyName = companyMatch[1].trim();
    }

    jobs.push({
      title: jobTitle,
      company_name: companyName,
      city: extractCity(jobTitle),
      category: classifyCategory(jobTitle, companyName),
      description: jobTitle,
      apply_link: jobUrl,
      source_url: jobUrl,
      source: 'أي وظيفة',
    });
    i += 2;
  }
  return jobs;
}

// ===== Source: جدارات (jadarat.sa) =====
function parseJadaratJobs(markdown: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  const lines = markdown.split('\n').map(l => l.trim()).filter(Boolean);

  // جدارات typically shows job cards with title, company, location
  // Try multiple parsing strategies

  // Strategy 1: Look for job links
  const jobLinkPattern = /\[([^\]]+)\]\((https?:\/\/jadarat\.sa\/[^\s)]+)\)/g;
  const seenUrls = new Set<string>();
  
  for (const match of markdown.matchAll(jobLinkPattern)) {
    const title = match[1].trim();
    const url = match[2];
    
    // Skip navigation/menu links
    if (title.length < 10 || seenUrls.has(url)) continue;
    if (['الرئيسية', 'تسجيل', 'دخول', 'اتصل', 'عن', 'سياسة'].some(w => title === w)) continue;
    
    seenUrls.add(url);
    jobs.push({
      title,
      company_name: 'جدارات',
      city: extractCity(title),
      category: 'حكومية',
      description: title,
      apply_link: url,
      source_url: url,
      source: 'جدارات',
    });
  }

  // Strategy 2: Look for structured job data patterns
  // Jadarat often lists jobs in sections with headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for job title patterns (often starts with specific keywords)
    if ((line.includes('وظيفة') || line.includes('وظائف') || line.includes('فرصة')) && 
        line.length > 15 && line.length < 200 &&
        !line.startsWith('[') && !line.startsWith('!') && !line.startsWith('#')) {
      
      // Check if this isn't already captured
      const isDuplicate = jobs.some(j => j.title === line || line.includes(j.title));
      if (isDuplicate) continue;

      // Try to find company name in surrounding lines
      let companyName = 'جدارات';
      for (let j = Math.max(0, i - 3); j <= Math.min(lines.length - 1, i + 3); j++) {
        if (j === i) continue;
        const nearby = lines[j];
        if (nearby.includes('شركة') || nearby.includes('مؤسسة') || nearby.includes('وزارة') || nearby.includes('هيئة')) {
          companyName = nearby.replace(/^[#*\-\s]+/, '').trim();
          break;
        }
      }

      jobs.push({
        title: line.replace(/^[#*\-\s]+/, '').trim(),
        company_name: companyName,
        city: extractCity(line),
        category: classifyCategory(line, companyName),
        description: line,
        apply_link: 'https://jadarat.sa/ExploreJobs',
        source_url: 'https://jadarat.sa/ExploreJobs',
        source: 'جدارات',
      });
    }
  }

  return jobs;
}

async function scrapeSource(
  firecrawlApiKey: string,
  url: string,
  parser: (md: string) => ScrapedJob[],
  sourceName: string
): Promise<{ jobs: ScrapedJob[]; error?: string }> {
  try {
    console.log(`Scraping ${sourceName} from ${url}...`);
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'links'],
        onlyMainContent: true,
        waitFor: 5000,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`${sourceName} scrape failed:`, JSON.stringify(data));
      return { jobs: [], error: data.error || `Status ${response.status}` };
    }

    const markdown = data.data?.markdown || data.markdown || '';
    console.log(`${sourceName} markdown length: ${markdown.length}`);
    
    const jobs = parser(markdown);
    console.log(`${sourceName}: parsed ${jobs.length} jobs`);
    return { jobs };
  } catch (e) {
    console.error(`${sourceName} error:`, e);
    return { jobs: [], error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

async function fetchApplyLink(firecrawlApiKey: string, sourceUrl: string): Promise<string> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: sourceUrl,
        formats: ['markdown', 'links'],
        onlyMainContent: true,
        waitFor: 2000,
      }),
    });

    if (!response.ok) {
      await response.text();
      return '';
    }

    const data = await response.json();
    const jobMarkdown = data.data?.markdown || data.markdown || '';
    const pageLinks: string[] = data.data?.links || [];

    const isExcluded = (url: string) =>
      url.includes('ewdifh.com') || url.includes('t.me') || url.includes('twitter.com') ||
      url.includes('facebook.com') || url.includes('linkedin.com') || url.includes('whatsapp.com') ||
      url.includes('x.com') || url.includes('telegram.org') || url.includes('share') ||
      url.includes('jadarat.sa');

    // Try apply link patterns
    const applyPatterns = [
      /\[(?:رابط التقديم|التقديم|قدم الآن|سجل الآن|للتقديم|اضغط هنا للتقديم|Apply|تقديم)[^\]]*\]\(([^)]+)\)/gi,
      /\[(?:[^\]]*تقديم[^\]]*|[^\]]*التسجيل[^\]]*)\]\(([^)]+)\)/gi,
    ];

    for (const pattern of applyPatterns) {
      const matches = [...jobMarkdown.matchAll(pattern)];
      for (const match of matches) {
        if (!isExcluded(match[1])) return match[1];
      }
    }

    // Try external links
    if (pageLinks.length > 0) {
      const externalLinks = pageLinks.filter((l: string) => !isExcluded(l) && l.startsWith('http'));
      if (externalLinks.length > 0) return externalLinks[externalLinks.length - 1];
    }

    // Last resort: any non-excluded link
    const allLinks = [...jobMarkdown.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)];
    const filtered = allLinks.filter(m => !isExcluded(m[2]));
    if (filtered.length > 0) return filtered[filtered.length - 1][2];

    return '';
  } catch {
    return '';
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      return new Response(JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for optional source filter
    let requestedSource = '';
    try {
      const body = await req.json();
      requestedSource = body?.source || '';
    } catch { /* no body */ }

    console.log('Starting multi-source job scrape...');

    // Define sources
    const sources = [
      { name: 'أي وظيفة', url: 'https://www.ewdifh.com', parser: parseEwdifhJobs, needsApplyLink: true },
      { name: 'جدارات', url: 'https://jadarat.sa/ExploreJobs', parser: parseJadaratJobs, needsApplyLink: false },
    ];

    const activeSources = requestedSource
      ? sources.filter(s => s.name === requestedSource)
      : sources;

    let totalFound = 0;
    let totalImported = 0;
    let totalSkipped = 0;
    const sourceResults: Record<string, { found: number; imported: number; skipped: number; error?: string }> = {};

    // Scrape all sources in parallel
    const scrapeResults = await Promise.allSettled(
      activeSources.map(s => scrapeSource(firecrawlApiKey, s.url, s.parser, s.name))
    );

    for (let si = 0; si < activeSources.length; si++) {
      const source = activeSources[si];
      const result = scrapeResults[si];
      
      if (result.status === 'rejected') {
        sourceResults[source.name] = { found: 0, imported: 0, skipped: 0, error: String(result.reason) };
        continue;
      }

      const { jobs: scrapedJobs, error: scrapeError } = result.value;
      
      if (scrapeError) {
        sourceResults[source.name] = { found: 0, imported: 0, skipped: 0, error: scrapeError };
        continue;
      }

      totalFound += scrapedJobs.length;
      let imported = 0;
      let skipped = 0;

      // Filter duplicates
      const newJobs: ScrapedJob[] = [];
      for (const job of scrapedJobs) {
        const { data: existing } = await supabase
          .from('jobs')
          .select('id')
          .eq('source_url', job.source_url)
          .maybeSingle();
        if (existing) { skipped++; continue; }

        const { data: existing2 } = await supabase
          .from('jobs')
          .select('id')
          .eq('title', job.title)
          .eq('company_name', job.company_name)
          .maybeSingle();
        if (existing2) { skipped++; continue; }

        newJobs.push(job);
      }

      console.log(`${source.name}: ${newJobs.length} new, ${skipped} skipped`);

      // Process new jobs in batches
      const batchSize = 5;
      for (let b = 0; b < newJobs.length; b += batchSize) {
        const batch = newJobs.slice(b, b + batchSize);
        const results = await Promise.allSettled(batch.map(async (job) => {
          let applyLink = job.apply_link;

          // For ewdifh, fetch actual apply link from detail page
          if (source.needsApplyLink && job.source_url.includes('ewdifh.com')) {
            const actualLink = await fetchApplyLink(firecrawlApiKey, job.source_url);
            if (actualLink) applyLink = actualLink;
          }

          console.log(`[${source.name}] ${job.title} | Apply: ${applyLink || '(none)'}`);

          const { error: insertError } = await supabase.from('jobs').insert({
            title: job.title,
            company_name: job.company_name,
            city: job.city,
            category: job.category,
            description: job.description,
            apply_link: applyLink,
            source: job.source,
            source_url: job.source_url,
            publish_date: new Date().toISOString().split('T')[0],
          });

          if (insertError) {
            console.error('Insert error:', job.title, insertError.message);
            return false;
          }
          return true;
        }));

        for (const r of results) {
          if (r.status === 'fulfilled' && r.value) imported++;
        }
      }

      totalImported += imported;
      totalSkipped += skipped;
      sourceResults[source.name] = { found: scrapedJobs.length, imported, skipped };
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_found: totalFound,
        imported: totalImported,
        skipped: totalSkipped,
        sources: sourceResults,
        message: `تم جلب ${totalImported} وظيفة جديدة من ${activeSources.length} مصدر، وتم تخطي ${totalSkipped} مكررة`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scrape-jobs:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
