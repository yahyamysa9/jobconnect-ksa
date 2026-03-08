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
}

function classifyCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('عسكري') || text.includes('جندي') || text.includes('ضابط') || text.includes('القوات') || text.includes('الدفاع') || text.includes('الحرس') || text.includes('أمن عام')) return 'عسكرية';
  if (text.includes('تدريب') || text.includes('تمهير') || text.includes('تعاوني') || text.includes('منتهي بالتوظيف')) return 'تدريب';
  if (text.includes('وزارة') || text.includes('هيئة') || text.includes('حكومي') || text.includes('ديوان') || text.includes('أمانة')) return 'حكومية';
  return 'شركات';
}

function extractCity(text: string): string {
  const cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'أبها', 'تبوك', 'حائل', 'الطائف', 'نجران', 'الظهران', 'الخبر', 'بريدة', 'خميس مشيط', 'جازان', 'ينبع'];
  for (const city of cities) {
    if (text.includes(city)) return city;
  }
  return 'الرياض';
}

function parseJobsFromMarkdown(markdown: string, sourceUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  // Split by job entries - look for patterns like links with job titles
  const lines = markdown.split('\n');
  let currentJob: Partial<ScrapedJob> | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match markdown links like [job title](url)
    const linkMatch = trimmed.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const title = linkMatch[1].trim();
      const url = linkMatch[2].trim();
      
      // Skip navigation links, category links etc
      if (title.length < 5 || title.includes('الرئيسية') || title.includes('تصنيف') || title.includes('اتصل') || title.includes('سياسة')) continue;
      
      // If we have a previous job, save it
      if (currentJob?.title) {
        jobs.push({
          title: currentJob.title,
          company_name: currentJob.company_name || 'غير محدد',
          city: currentJob.city || extractCity(currentJob.title + ' ' + (currentJob.description || '')),
          category: classifyCategory(currentJob.title, currentJob.description || ''),
          description: currentJob.description || currentJob.title,
          apply_link: currentJob.apply_link || url,
          source_url: currentJob.source_url || url,
        });
      }
      
      currentJob = {
        title: title,
        apply_link: url.startsWith('http') ? url : `https://www.aiwazifa.com${url}`,
        source_url: url.startsWith('http') ? url : `https://www.aiwazifa.com${url}`,
      };
    } else if (currentJob) {
      // Try to extract company name and details from surrounding text
      if (!currentJob.company_name && trimmed.length > 3 && !trimmed.startsWith('#') && !trimmed.startsWith('*')) {
        // Check if it looks like a company/org name
        if (trimmed.includes('شركة') || trimmed.includes('وزارة') || trimmed.includes('هيئة') || trimmed.includes('مؤسسة') || trimmed.includes('جامعة') || trimmed.includes('بنك') || trimmed.includes('مستشفى')) {
          currentJob.company_name = trimmed.replace(/[*#\-]/g, '').trim();
        } else if (!currentJob.description) {
          currentJob.description = trimmed.replace(/[*#\-]/g, '').trim();
        }
      }
      
      // Extract city
      if (!currentJob.city) {
        currentJob.city = extractCity(trimmed);
        if (currentJob.city === 'الرياض' && !trimmed.includes('الرياض')) {
          currentJob.city = undefined as any;
        }
      }
    }
  }
  
  // Don't forget the last job
  if (currentJob?.title) {
    jobs.push({
      title: currentJob.title,
      company_name: currentJob.company_name || 'غير محدد',
      city: currentJob.city || extractCity(currentJob.title + ' ' + (currentJob.description || '')),
      category: classifyCategory(currentJob.title, currentJob.description || ''),
      description: currentJob.description || currentJob.title,
      apply_link: currentJob.apply_link || sourceUrl,
      source_url: currentJob.source_url || sourceUrl,
    });
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

    console.log('Starting job scrape from aiwazifa.com...');

    // Scrape the main jobs page
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.aiwazifa.com',
        formats: ['markdown', 'links'],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok) {
      console.error('Firecrawl scrape failed:', scrapeData);
      return new Response(JSON.stringify({ success: false, error: `Scrape failed: ${scrapeData.error || scrapeResponse.status}` }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    console.log('Scraped markdown length:', markdown.length);

    // Parse jobs from markdown
    const scrapedJobs = parseJobsFromMarkdown(markdown, 'https://www.aiwazifa.com');
    console.log(`Parsed ${scrapedJobs.length} jobs from scraped content`);

    if (scrapedJobs.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No jobs found on the page', imported: 0, markdown_preview: markdown.substring(0, 500) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Check for duplicates and insert new jobs
    let imported = 0;
    let skipped = 0;

    for (const job of scrapedJobs) {
      // Check if job already exists by title + company
      const { data: existing } = await supabase
        .from('jobs')
        .select('id')
        .eq('title', job.title)
        .eq('company_name', job.company_name)
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      const { error: insertError } = await supabase.from('jobs').insert({
        title: job.title,
        company_name: job.company_name,
        city: job.city,
        category: job.category,
        description: job.description,
        apply_link: job.apply_link,
        source: 'أي وظيفة',
        source_url: job.source_url,
        publish_date: new Date().toISOString().split('T')[0],
      });

      if (insertError) {
        console.error('Insert error for job:', job.title, insertError);
      } else {
        imported++;
      }
    }

    console.log(`Import complete. Imported: ${imported}, Skipped (duplicates): ${skipped}`);

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
