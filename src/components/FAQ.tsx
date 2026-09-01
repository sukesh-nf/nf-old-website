import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, ArrowUp, ArrowRight, X, BookOpen } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useMeta } from '../lib/useMeta';
import { useJsonLd } from '../lib/useJsonLd';
import { KNOWLEDGE_SECTIONS, ALL_ARTICLES } from './knowledge/data';

const NAV_LINKS = KNOWLEDGE_SECTIONS.map((s) => ({ id: s.id, label: s.title }));

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-nex-cyan to-nex-blue transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function StickyNav({ activeId }: { activeId: string | null }) {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScroll.current && current > 400);
      lastScroll.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`sticky z-40 transition-transform duration-300 ${
        hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{ top: 80 }}
    >
      <div className="bg-nex-dark/90 backdrop-blur-md border-b border-nex-cyan/10">
        <div className="container-wide max-w-5xl mx-auto py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`font-inter text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                    activeId === link.id
                      ? 'text-nex-cyan bg-nex-cyan/10'
                      : 'text-nex-grey hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex items-center gap-2 font-inter text-xs font-medium text-nex-grey px-3 py-1.5"
            >
              <BookOpen size={14} className="text-nex-cyan" />
              Sections
              <ChevronDown size={14} className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
            </button>
            <a
              href="#/knowledge/what-is-operational-readiness"
              className="hidden sm:inline-flex items-center gap-1.5 font-inter text-xs font-semibold text-nex-cyan hover:text-white transition-colors whitespace-nowrap"
            >
              Start Reading
              <ArrowRight size={12} />
            </a>
          </div>
          {mobileOpen && (
            <div className="lg:hidden mt-3 flex flex-col gap-1 pb-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`font-inter text-sm text-left px-3 py-2 rounded-lg transition-colors ${
                    activeId === link.id ? 'text-nex-cyan bg-nex-cyan/10' : 'text-nex-grey hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StickySearch({
  query,
  setQuery,
  results,
  onResultClick,
  visible,
}: {
  query: string;
  setQuery: (q: string) => void;
  results: { slug: string; question: string; section: string }[];
  onResultClick: (slug: string) => void;
  visible: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nex-grey/60" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-11 pr-10 py-3 rounded-full bg-white/[0.06] border border-nex-cyan/20 text-nex-text font-inter text-sm placeholder:text-nex-grey/50 focus:outline-none focus:border-nex-cyan/50 focus:bg-white/[0.08] transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-nex-grey/60 hover:text-nex-cyan transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {query && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 left-0 right-0 rounded-xl bg-nex-darker/95 backdrop-blur-md border border-nex-cyan/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50"
          >
            {results.slice(0, 6).map((r) => (
              <button
                key={r.slug}
                onClick={() => {
                  onResultClick(r.slug);
                  setQuery('');
                }}
                className="w-full text-left px-4 py-3 hover:bg-nex-cyan/[0.06] transition-colors border-b border-white/[0.04] last:border-b-0"
              >
                <p className="font-urbanist text-sm text-nex-text font-medium leading-snug">{r.question}</p>
                <p className="font-inter text-xs text-nex-grey/60 mt-0.5">{r.section}</p>
              </button>
            ))}
          </motion.div>
        )}
        {query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 left-0 right-0 rounded-xl bg-nex-darker/95 backdrop-blur-md border border-nex-cyan/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 z-50"
          >
            <p className="font-inter text-sm text-nex-grey">No questions match your search. Try different keywords.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccordionCard({
  article,
  index,
}: {
  article: { slug: string; question: string; shortAnswer: React.ReactNode };
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      className={`rounded-xl overflow-hidden transition-shadow duration-300 ${
        open
          ? 'shadow-[0_0_0_1px_rgba(24,213,255,0.25),0_4px_24px_rgba(24,213,255,0.06)]'
          : 'shadow-[0_0_0_1px_rgba(255,255,255,0.06)]'
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all duration-200 ${
          open
            ? 'bg-gradient-to-r from-nex-cyan/[0.08] to-nex-blue/[0.04]'
            : 'bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
      >
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-inter transition-all duration-200 ${
            open ? 'bg-nex-cyan text-nex-dark shadow-[0_0_8px_rgba(24,213,255,0.4)]' : 'bg-white/[0.07] text-nex-grey'
          }`}
        >
          Q
        </span>
        <span className="font-urbanist font-semibold text-nex-text text-[15px] leading-snug min-w-0 flex-1">
          {article.question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className={`flex-shrink-0 ml-2 transition-colors duration-200 ${open ? 'text-nex-cyan' : 'text-white/70'}`}
        >
          <ChevronDown size={17} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-nex-darker/60 border-t border-nex-cyan/10">
              <div className="flex items-start gap-3 px-6 py-5">
                <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-nex-cyan/[0.12] flex items-center justify-center text-[10px] font-bold font-inter text-nex-cyan">
                  A
                </span>
                <div className="faq-answer min-w-0 flex-1">
                  {article.shortAnswer}
                </div>
              </div>
              <div className="px-6 pb-4 pl-14">
                <a
                  href={`#/knowledge/${article.slug}`}
                  className="inline-flex items-center gap-1.5 font-inter text-xs font-semibold text-nex-cyan hover:text-white transition-colors"
                >
                  Read the full article
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-nex-cyan/10 border border-nex-cyan/30 flex items-center justify-center text-nex-cyan hover:bg-nex-cyan/20 hover:shadow-[0_0_16px_rgba(24,213,255,0.3)] transition-all duration-200"
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}

export default function FAQ() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);

  useMeta({
    title: 'Knowledge Centre - NexFrontier',
    description:
      'Questions every business should be asking in an AI-mediated market. Explore operational readiness, hidden operational loss, AI readiness, and evidence-based measurement.',
    ogUrl: '/#/faq',
  });

  useJsonLd([
    {
      '@type': 'FAQPage',
      'url': 'https://nexfrontierlogic.nz/#/faq',
      'mainEntity': ALL_ARTICLES.map((a) => ({
        '@type': 'Question',
        'name': a.question,
        'acceptedAnswer': { '@type': 'Answer', 'text': a.shortAnswerText },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://nexfrontierlogic.nz/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Knowledge Centre', 'item': 'https://nexfrontierlogic.nz/#/faq' },
      ],
    },
  ]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_ARTICLES.filter(
      (a) =>
        a.question.toLowerCase().includes(q) ||
        a.shortAnswerText.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    ).map((a) => ({ slug: a.slug, question: a.question, section: a.section }));
  }, [query]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: [0, 0.1, 0.5] }
    );
    KNOWLEDGE_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setSearchVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigateToArticle = (slug: string) => {
    window.location.hash = `#/knowledge/${slug}`;
  };

  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <ReadingProgress />
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-96 h-96 bg-nex-cyan/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-nex-blue/5 rounded-full blur-3xl" />
          </div>
          <div className="container-wide max-w-4xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="inline-block font-inter text-xs font-semibold tracking-widest uppercase text-nex-cyan mb-5">
                Knowledge Centre
              </span>
              <h1 id="page-heading" className="font-urbanist font-bold text-3xl md:text-5xl text-nex-text leading-tight mb-6">
                Questions Every Business Should Be Asking in an AI-Mediated Market
              </h1>
              <p className="font-inter text-nex-grey text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                Markets are changing. Customers increasingly interact through AI-assisted buying journeys. Digital platforms influence trust. Operational confidence is becoming as important as visibility. Operational Readiness is emerging as the next competitive advantage. The questions below explore why.
              </p>
              <StickySearch
                query={query}
                setQuery={setQuery}
                results={searchResults}
                onResultClick={navigateToArticle}
                visible={true}
              />
            </motion.div>
          </div>
        </section>

        <StickyNav activeId={activeId} />

        {/* Sticky search appears below nav on scroll */}
        <div className="sticky z-30 bg-nex-dark/80 backdrop-blur-sm border-b border-nex-cyan/5" style={{ top: 120 }}>
          <div className="container-wide max-w-4xl mx-auto py-3">
            <StickySearch
              query={query}
              setQuery={setQuery}
              results={searchResults}
              onResultClick={navigateToArticle}
              visible={searchVisible}
            />
          </div>
        </div>

        {/* Sections */}
        <div className="container-wide max-w-4xl mx-auto py-12 md:py-16">
          <div className="space-y-20">
            {KNOWLEDGE_SECTIONS.map((section, sIdx) => (
              <section
                key={section.id}
                id={section.id}
                className={`scroll-mt-32 rounded-2xl p-6 md:p-10 ${
                  sIdx % 2 === 0
                    ? 'bg-white/[0.015] border border-white/[0.05]'
                    : ''
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-urbanist font-bold text-2xl md:text-3xl text-white mb-2">
                    {section.title}
                  </h2>
                  <p className="font-inter text-nex-grey text-sm mb-8 max-w-xl">
                    {section.blurb}
                  </p>
                  <div className="space-y-3">
                    {section.articles.map((article, i) => (
                      <AccordionCard key={article.slug} article={article} index={i} />
                    ))}
                  </div>
                </motion.div>
              </section>
            ))}
          </div>

          {/* Contextual CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl border border-nex-cyan/25 bg-gradient-to-br from-nex-navy/80 to-nex-darker/80 p-8 md:p-10 text-center"
          >
            <h3 className="font-urbanist font-bold text-xl md:text-2xl text-white mb-3">
              Ready to Assess Your Operational Readiness?
            </h3>
            <p className="font-inter text-nex-grey text-sm max-w-lg mx-auto mb-6">
              The Foundation Customer Programme helps organisations measure readiness, identify hidden friction, and build the evidence base for confident AI investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#beta-programme"
                className="font-inter inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-nex-cyan text-nex-dark font-semibold text-sm rounded-full hover:shadow-glow-cyan-lg transition-all duration-300"
              >
                Explore the Foundation Customer Programme
                <ArrowRight size={14} />
              </a>
              <a
                href="#calculate-quiet-loss"
                className="font-inter inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-nex-cyan/60 text-nex-cyan font-semibold text-sm rounded-full hover:bg-nex-cyan/10 transition-all duration-300"
              >
                Calculate Your Quiet Loss
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
}
