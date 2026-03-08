import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScrapedJob {
  title: string;
  company_name: string;
  company_logo: string;
  city: string;
  category: string;
  description: string;
  apply_link: string;
  source_url: string;
}

function classifyCategory(title: string): string {
  const text = title.toLowerCase();
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
  };
  for (const [key, city] of Object.entries(cities)) {
    if (text.includes(key)) return city;
  }
  return 'متعددة المدن';
}

function parseJobsFromMarkdown(markdown: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  const lines = markdown.split('\n').map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    // Look for pattern: ![logo](logo_url) then [job_title](job_url) then [company_name](org_url)
    const logoMatch = lines[i].match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (!logoMatch) continue;

    // Next non-empty line should be job title link
    const nextLine = lines[i + 1];
    if (!nextLine) continue;
    const titleMatch = nextLine.match(/^\[([^\]]+)\]\((https:\/\/www\.ewdifh\.com\/jobs\/\d+)\)$/);
    if (!titleMatch) continue;

    const jobTitle = titleMatch[1].trim();
    const jobUrl = titleMatch[2];

    // Next line should be company name link
    const companyLine = lines[i + 2];
    let companyName = logoMatch[1] || 'غير محدد';
    if (companyLine) {
      const companyMatch = companyLine.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (companyMatch) {
        companyName = companyMatch[1].trim();
      }
    }

    const companyLogo = logoMatch[2];

    jobs.push({
      title: jobTitle,
      company_name: companyName,
      company_logo: companyLogo,
      city: extractCity(jobTitle),
      category: classifyCategory(jobTitle + ' ' + companyName),
      description: jobTitle,
      apply_link: jobUrl,
      source_url: jobUrl,
    });

    i += 2; // Skip processed lines
  }

  return jobs;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      return new Response(JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting job scrape from ewdifh.com (أي وظيفة)...');

    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.ewdifh.com',
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 5000,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok) {
      console.error('Firecrawl scrape failed:', JSON.stringify(scrapeData));
      return new Response(JSON.stringify({ success: false, error: `Scrape failed: ${scrapeData.error || scrapeResponse.status}` }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    console.log('Scraped markdown length:', markdown.length);

    const scrapedJobs = parseJobsFromMarkdown(markdown);
    console.log(`Parsed ${scrapedJobs.length} jobs`);

    if (scrapedJobs.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'لم يتم العثور على وظائف جديدة', imported: 0, debug: { markdown_length: markdown.length, markdown_preview: markdown.substring(0, 1000) } }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let imported = 0;
    let skipped = 0;

    for (const job of scrapedJobs) {
      // Check for duplicates by source_url
      const { data: existing } = await supabase
        .from('jobs')
        .select('id')
        .eq('source_url', job.source_url)
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      // Also check by title + company
      const { data: existing2 } = await supabase
        .from('jobs')
        .select('id')
        .eq('title', job.title)
        .eq('company_name', job.company_name)
        .maybeSingle();

      if (existing2) {
        skipped++;
        continue;
      }

      // Try to get actual apply link from individual job page
      let actualApplyLink = job.apply_link;
      try {
        const jobPageResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: job.source_url,
            formats: ['markdown'],
            onlyMainContent: true,
            waitFor: 3000,
          }),
        });

        if (jobPageResponse.ok) {
          const jobPageData = await jobPageResponse.json();
          const jobMarkdown = jobPageData.data?.markdown || jobPageData.markdown || '';
          
          // Look for apply/registration links
          const applyLinkMatch = jobMarkdown.match(/\[(?:رابط التقديم|التقديم|قدم الآن|سجل الآن|Apply|للتقديم)[^\]]*\]\(([^)]+)\)/i);
          if (applyLinkMatch && !applyLinkMatch[1].includes('ewdifh.com')) {
            actualApplyLink = applyLinkMatch[1];
          } else {
            // Try to find any external link that looks like an apply link
            const externalLinks = [...jobMarkdown.matchAll(/\[([^\]]+)\]\((https?:\/\/(?!www\.ewdifh\.com)[^)]+)\)/g)];
            if (externalLinks.length > 0) {
              // Use the last external link (usually the apply button)
              actualApplyLink = externalLinks[externalLinks.length - 1][2];
            }
          }
        }
      } catch (e) {
        console.log('Could not fetch job detail page, using listing link:', e);
      }

      const { error: insertError } = await supabase.from('jobs').insert({
        title: job.title,
        company_name: job.company_name,
        city: job.city,
        category: job.category,
        description: job.description,
        apply_link: actualApplyLink,
        source: 'أي وظيفة',
        source_url: job.source_url,
        publish_date: new Date().toISOString().split('T')[0],
      });

      if (insertError) {
        console.error('Insert error:', job.title, insertError.message);
      } else {
        imported++;
        console.log('Imported:', job.title, '| Apply link:', actualApplyLink);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_found: scrapedJobs.length,
        imported,
        skipped,
        message: `تم جلب ${imported} وظيفة جديدة، وتم تخطي ${skipped} وظيفة مكررة`,
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
