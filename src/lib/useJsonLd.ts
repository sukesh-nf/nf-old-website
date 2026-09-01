import { useEffect } from 'react';

const SCRIPT_ID = 'json-ld-structured-data';

export function useJsonLd(schema: object | object[]) {
  useEffect(() => {
    let el = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = SCRIPT_ID;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    const graphs = Array.isArray(schema) ? schema : [schema];
    el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graphs });

    return () => {
      // Restore home schema on unmount
      const homeEl = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (homeEl) homeEl.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
