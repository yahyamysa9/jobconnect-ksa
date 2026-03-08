import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://jobconnect-ksa.lovable.app";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const now = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "hourly" },
    { loc: "/jobs", priority: "0.9", changefreq: "hourly" },
    { loc: "/categories", priority: "0.8", changefreq: "weekly" },
    { loc: "/cities", priority: "0.8", changefreq: "weekly" },
    { loc: "/search", priority: "0.7", changefreq: "daily" },
  ];

  // Fetch active jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, updated_at")
    .eq("is_active", true)
    .order("publish_date", { ascending: false })
    .limit(1000);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  if (jobs) {
    for (const job of jobs) {
      const lastmod = job.updated_at ? job.updated_at.split("T")[0] : now;
      xml += `  <url>
    <loc>${SITE_URL}/jobs/${job.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
