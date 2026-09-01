import { useState, useEffect, useRef, useCallback } from 'react';
import { useJsonLd } from './lib/useJsonLd';
import Header from './components/Header';
import Hero from './components/Hero';
import EarlyAccess from './components/EarlyAccess';
import CalculateQuietLoss from './components/CalculateQuietLoss';
import MarketChange from './components/MarketChange';
import WhatNexFrontierDoes from './components/WhatNexFrontierDoes';
import GovernedByDesign from './components/GovernedByDesign';
import GovernAssure from './components/GovernAssure';
import WhyItMatters from './components/WhyItMatters';
import WhoWeWorkWith from './components/WhoWeWorkWith';
import FoundationOverview from './components/FoundationOverview';
import BetaProgramme from './components/BetaProgramme';
import WhatHappensAfter from './components/WhatHappensAfter';
import InvestorBrief from './components/InvestorBrief';
import Footer from './components/Footer';
import CaseExample from './components/CaseExample';
import ReadingTheShift from './components/ReadingTheShift';
import DataReadinessIndex from './components/DataReadinessIndex';
import AgenticAICXFrontline from './components/AgenticAICXFrontline';
import AdminUpload from './components/AdminUpload';
import ExemplarVideos from './components/ExemplarVideos';
import FAQ from './components/FAQ';
import Blogs from './components/Blogs';
import BlogPost from './components/BlogPost';
import KnowledgeArticle from './components/KnowledgeArticle';
import Careers from './components/Careers';
import InvestorDataRoom from './components/InvestorDataRoom';
import Team from './components/Team';
import PrivacyPolicy from './components/PrivacyPolicy';
import TrueCase from './components/TrueCase';
import InvestorQ1 from './components/InvestorQ1';
import InvestorQ2 from './components/InvestorQ2';
import InvestorQ3 from './components/InvestorQ3';
import InvestorQ4 from './components/InvestorQ4';

function getPage(): string {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  if (hash) return hash;
  return window.location.pathname.replace(/^\//, '');
}

const HOME_SCROLL_KEY = 'homeScrollPosition';

function isSubPage(p: string): boolean {
  if (p.startsWith('blog/')) return true;
  if (p.startsWith('knowledge/')) return true;
  return ['admin-upload', 'case-example', 'reading-the-shift', 'data-readiness-index', 'agentic-ai-cx-frontline', 'exemplar-videos', 'faq', 'careers', 'investor-data-room', 'team', 'privacy', 'true-case', 'investor-q1', 'investor-q2', 'investor-q3', 'investor-q4'].includes(p);
}

function App() {
  const [blogTab, setBlogTab] = useState('global');
  const [page, setPage] = useState(() => {
    const p = getPage();
    if (p) window.scrollTo({ top: 0 });
    return p;
  });
  const pageRef = useRef(page);
  pageRef.current = page;

  const prevPageRef = useRef('');

  const focusMainHeading = useCallback(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById('page-heading') ?? document.querySelector('main, h1');
      if (el instanceof HTMLElement) {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      }
    });
  }, []);

  useEffect(() => {
    if (isSubPage(page)) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      focusMainHeading();
    } else if (isSubPage(prevPageRef.current)) {
      // returning home from a sub-page  - restore position without visible jump
      const saved = sessionStorage.getItem(HOME_SCROLL_KEY);
      window.scrollTo({ top: saved ? Number(saved) : 0, behavior: 'instant' as ScrollBehavior });
    }
    prevPageRef.current = page;
  }, [page, focusMainHeading]);


  useEffect(() => {
    const onBeforeHashChange = () => {
      if (!isSubPage(pageRef.current)) {
        sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY));
      }
    };

    const onHashChange = () => {
      const raw = window.location.hash.replace(/^#/, '').split('?')[0];
      const isAnchor = raw && !raw.startsWith('/') && !isSubPage(raw);
      const next = raw.replace(/^\//, '');

      setPage(isSubPage(next) ? next : '');

      if (isSubPage(next)) {
        // scroll handled by useEffect after page renders
      } else if (isAnchor) {
        // nav link to an anchor on the home page
        requestAnimationFrame(() => {
          const el = document.getElementById(raw);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
      } else {
        // scroll restoration handled by useEffect after home page renders
      }
    };

    window.addEventListener('click', onBeforeHashChange, true);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('click', onBeforeHashChange, true);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  if (page === 'admin-upload') return <AdminUpload />;
  if (page === 'case-example') return <CaseExample />;
  if (page === 'reading-the-shift') return <ReadingTheShift />;
  if (page === 'data-readiness-index') return <DataReadinessIndex />;
  if (page === 'agentic-ai-cx-frontline') return <AgenticAICXFrontline />;
  if (page === 'exemplar-videos') return <ExemplarVideos />;
  if (page === 'faq') return <FAQ />;
  if (page === 'careers') return <Careers />;
  if (page === 'investor-data-room') return <InvestorDataRoom />;
  if (page === 'team') return <Team />;
  if (page === 'privacy') return <PrivacyPolicy />;
  if (page === 'true-case') return <TrueCase />;
  if (page === 'investor-q1') return <InvestorQ1 />;
  if (page === 'investor-q2') return <InvestorQ2 />;
  if (page === 'investor-q3') return <InvestorQ3 />;
  if (page === 'investor-q4') return <InvestorQ4 />;
  if (page.startsWith('blog/')) return <BlogPost slug={page.replace('blog/', '')} onBack={(tab) => { setBlogTab(tab); window.history.back(); }} />;
  if (page.startsWith('knowledge/')) return <KnowledgeArticle slug={page.replace('knowledge/', '')} onBack={() => { window.location.hash = '#/faq'; }} />;

  return <HomePage blogTab={blogTab} setBlogTab={setBlogTab} />;
}

function HomePage({ blogTab, setBlogTab }: { blogTab: string; setBlogTab: (t: string) => void }) {
  const [qlEmailConsent, setQlEmailConsent] = useState(false);
  useJsonLd([
    {
      '@type': 'WebPage',
      '@id': 'https://nexfrontier.my/',
      'url': 'https://nexfrontier.my/',
      'name': 'NexFrontier - Operational Reliability Infrastructure for the AI-Mediated Economy',
      'description': 'NexFrontier is the operational reliability layer that stops quiet loss, recovers hidden revenue, and makes AI-mediated customer experiences work reliably at scale.',
      'isPartOf': { '@id': 'https://nexfrontier.my/#website' },
      'about': { '@id': 'https://nexfrontier.my/#organization' },
      'inLanguage': 'en',
    },
    {
      '@type': 'Product',
      'name': 'NexFrontier Operational Reliability Platform',
      'description': 'The infrastructure layer that sits above existing systems of record to detect quiet loss, close agentic AI execution gaps, and recover hidden revenue for enterprises.',
      'brand': { '@id': 'https://nexfrontier.my/#organization' },
      'category': 'Enterprise AI Infrastructure Software',
      'offers': {
        '@type': 'Offer',
        'availability': 'https://schema.org/PreOrder',
        'description': 'BETA programme - apply for early access',
      },
      'audience': {
        '@type': 'BusinessAudience',
        'audienceType': 'Enterprise',
        'numberOfEmployees': { '@type': 'QuantitativeValue', 'minValue': 100 },
      },
    },
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is quiet loss?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Quiet loss is the hidden revenue that enterprises lose through dropped queries, stalled handoffs, and unresolved operational frictions in AI-mediated customer journeys. It accumulates silently and never appears on an incident report because no single event causes it.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What does NexFrontier do?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'NexFrontier provides operational reliability infrastructure that sits above existing enterprise systems to detect and close the gaps where AI-mediated customer interactions fail - recovering hidden revenue and making agentic AI work reliably at scale.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Who does NexFrontier work with?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'NexFrontier works with mid-to-large enterprises that are deploying or scaling agentic AI in customer-facing operations - particularly in financial services, telecommunications, and professional services. We operate across Malaysia, New Zealand, and Southeast Asia.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How is NexFrontier different from traditional AI automation tools?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Traditional automation tools layer on top of broken processes. NexFrontier is infrastructure: it sits above existing systems of record without replacing them, instrumenting the operational layer so AI agents can act reliably. We focus on execution reliability, not model capability.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How can I join the NexFrontier beta programme?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'You can apply for early access through the beta programme section on this website. NexFrontier is currently accepting a limited cohort of enterprise partners for its initial deployment phase.',
          },
        },
      ],
    },
  ]);

  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-nex-cyan focus:text-nex-dark focus:font-semibold focus:rounded-lg focus:text-sm">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
      <Hero />
      <EarlyAccess />
      <CalculateQuietLoss onConsentChange={(v) => setQlEmailConsent(v)} />
      <MarketChange />
      <FoundationOverview />
      <WhatNexFrontierDoes />
      <GovernedByDesign />
      <GovernAssure />
      <WhyItMatters />
      <WhoWeWorkWith />
      <BetaProgramme qlEmailConsent={qlEmailConsent} />
      <WhatHappensAfter />
      <InvestorBrief />
      <Blogs activeTab={blogTab} onTabChange={setBlogTab} />
      <Footer />
      </main>
    </div>
  );
}

export default App;
