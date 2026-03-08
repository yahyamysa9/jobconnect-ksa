import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'وظيفتك';
const DEFAULT_IMAGE = 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1d3aed5a-93ec-458d-a690-357dbf023204/id-preview-cd132427--3e2732fb-1553-40be-976e-16adbcd2c16e.lovable.app-1772951621569.png';

const SEOHead = ({ title, description, canonical, type = 'website', image, jsonLd }: SEOHeadProps) => {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', image || DEFAULT_IMAGE);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image || DEFAULT_IMAGE);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const href = canonical || window.location.href.split('?')[0];
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);

    // JSON-LD
    const ldId = 'seo-jsonld';
    let script = document.getElementById(ldId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = ldId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    return () => {
      // Cleanup JSON-LD on unmount
      document.getElementById(ldId)?.remove();
    };
  }, [title, description, canonical, type, image, jsonLd]);

  return null;
};

export default SEOHead;
