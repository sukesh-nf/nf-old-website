import { useEffect } from 'react';

interface MetaConfig {
  title: string;
  description: string;
  ogImage?: string;
  ogUrl?: string;
}

const BASE_URL = 'https://nexfrontierlogic.nz';
const DEFAULT_IMAGE = '/og-image.png';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useMeta({ title, description, ogImage = DEFAULT_IMAGE, ogUrl }: MetaConfig) {
  useEffect(() => {
    document.title = title;

    const url = ogUrl ? `${BASE_URL}${ogUrl}` : BASE_URL;
    const absImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

    setMeta('description', description);
    setMeta('robots', 'index, follow');

    setMeta('og:type', 'website', 'property');
    setMeta('og:site_name', 'NexFrontier', 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', absImage, 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', absImage);

    return () => {
      // Restore home defaults on unmount
      const homeTitle = 'NexFrontier - Operational Reliability Infrastructure for the AI-Mediated Economy';
      const homeDesc = 'NexFrontier is the operational reliability layer that stops quiet loss, recovers hidden revenue, and makes AI-mediated customer experiences work reliably at scale.';
      document.title = homeTitle;
      setMeta('description', homeDesc);
      setMeta('og:title', homeTitle, 'property');
      setMeta('og:description', homeDesc, 'property');
      setMeta('og:url', BASE_URL, 'property');
      setMeta('og:image', `${BASE_URL}${DEFAULT_IMAGE}`, 'property');
      setMeta('twitter:title', homeTitle);
      setMeta('twitter:description', homeDesc);
      setMeta('twitter:image', `${BASE_URL}${DEFAULT_IMAGE}`);
    };
  }, [title, description, ogImage, ogUrl]);
}
