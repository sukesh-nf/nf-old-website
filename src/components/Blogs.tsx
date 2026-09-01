import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Card {
  slug: string;
  href: string;
  label?: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const globalPosts: Card[] = [
  {
    slug: 'ai-isnt-creating-the-next-management-challenge',
    href: '#/blog/ai-isnt-creating-the-next-management-challenge',
    label: 'NexFontier',
    title: "AI Isn't Creating the Next Management Challenge. It's Exposing It.",
    excerpt: "AI is making work faster, but faster work is not automatically becoming greater enterprise value. The next management challenge is the attention bottleneck created when output scales faster than human judgement.",
    date: '12 Aug 2026',
    readTime: '8 min read',
  },
  {
    slug: 'feedback-doesnt-create-learning-evidence-does',
    href: '#/blog/feedback-doesnt-create-learning-evidence-does',
    label: 'Harvard Business Review',
    title: "Feedback Doesn't Create Learning. Evidence Does.",
    excerpt: "Why organisations need more than better conversations in AI-mediated markets. Feedback based on perception changes behaviour temporarily. Feedback grounded in evidence improves capability.",
    date: 'Jul 2026',
    readTime: '9 min read',
  },
  {
    slug: 'reading-the-shift',
    href: '#/reading-the-shift',
    label: 'EY Global AI Sentiment 2026',
    title: 'AI Adoption Is Splitting Into Two Different Market Economies',
    excerpt: "NexFrontier's response to EY's Global AI Sentiment Study: how AI adoption is splitting into different behavioural economies and exposing a deeper operational divide.",
    date: '2026',
    readTime: '8 min read',
  },
  {
    slug: 'data-readiness-index',
    href: '#/data-readiness-index',
    label: 'Cloudera Data Readiness Index 2026',
    title: 'Data Readiness Will Not Save Slow Operations',
    excerpt: "Cloudera's Data Readiness Index 2026 confirms the infrastructure beneath enterprise AI ambitions was never designed for the speed of markets now forming around them.",
    date: '2026',
    readTime: '7 min read',
  },
  {
    slug: 'agentic-ai-cx-frontline',
    href: '#/agentic-ai-cx-frontline',
    label: 'NiCE Agentic AI CX Frontline 2026',
    title: 'AI Is Making Operational Responsiveness a Competitive Advantage.',
    excerpt: "The real shift isn't AI agents. It's operational reinvention. NexFrontier's response to NiCE's Agentic AI CX Frontline report.",
    date: '2026',
    readTime: '9 min read',
  },
  {
    slug: 'gartner-bq-2q26-ai-roi-operational-readiness',
    href: '#/blog/gartner-bq-2q26-ai-roi-operational-readiness',
    label: "Gartner's Business Quarterly 2Q26",
    title: "AI Will Not Deliver ROI Until Businesses Can Operate Differently",
    excerpt: "Gartner's Business Quarterly 2Q26 makes an important observation: many organisations have learned a great deal about AI, but boards are still struggling to see meaningful returns. The challenge is no longer access to AI. It is operational capability.",
    date: 'May 2026',
    readTime: '6 min read',
  },
  {
    slug: 'mckinsey-2025-sustainable-inclusive-growth-capability-challenge',
    href: '#/blog/mckinsey-2025-sustainable-inclusive-growth-capability-challenge',
    label: "McKinsey's 2025 Sustainable & Inclusive Growth Impact Report",
    title: "Beyond Training: The Capability Challenge McKinsey's Report Points Toward",
    excerpt: "Many will read McKinsey's 2025 workforce report and conclude: we need more training. NexFrontier believes the market has already moved beyond that question. The emerging challenge is not knowledge. It is organisational capability.",
    date: 'May 2026',
    readTime: '8 min read',
  },
  {
    slug: 'mistaking-technology-investment-for-operational-readiness',
    href: '#/blog/mistaking-technology-investment-for-operational-readiness',
    label: 'Veeam Data Protection 2026',
    title: "Businesses Are Mistaking Technology Investment for Operational Readiness",
    excerpt: "Owning technology, running AI pilots, and modernising systems are not the same as being operationally ready. The Veeam 2026 report highlights a gap many businesses are only discovering under pressure.",
    date: 'May 2026',
    readTime: '9 min read',
  },
  {
    slug: 'agentic-ai-is-not-a-feature',
    href: '#/blog/agentic-ai-is-not-a-feature',
    label: 'Perspective',
    title: "Agentic AI Is Not a Feature. It's Infrastructure",
    excerpt: "Why the companies winning with AI aren't deploying chatbots. They're building the backbone that lets intelligent systems act reliably at scale.",
    date: 'May 2026',
    readTime: '6 min read',
  },
  {
    slug: 'the-quiet-loss-most-businesses-miss',
    href: '#/blog/the-quiet-loss-most-businesses-miss',
    label: 'Perspective',
    title: 'The Quiet Loss Most Businesses Are Missing',
    excerpt: "Revenue doesn't always vanish loudly. Dropped queries, stalled handoffs, and unresolved friction compound silently, until they show up in the numbers.",
    date: 'Apr 2026',
    readTime: '5 min read',
  },
  {
    slug: 'why-data-readiness-precedes-ai-readiness',
    href: '#/blog/why-data-readiness-precedes-ai-readiness',
    label: 'Perspective',
    title: 'Why Data Readiness Precedes AI Readiness',
    excerpt: 'Before an AI agent can act, it must be able to see, trust, and retrieve. Most organisations skip this layer entirely.',
    date: 'Mar 2026',
    readTime: '7 min read',
  },
];

const myPosts: Card[] = [
  {
    slug: 'malaysia-ai-adoption-gap',
    href: '#/blog/malaysia-ai-adoption-gap',
    label: 'Malaysia',
    title: "Malaysia's AI Adoption Gap and the Window to Close It",
    excerpt: "Malaysian enterprises are investing in AI tools but underinvesting in operational readiness. The gap between deployment and results is widening.",
    date: 'May 2026',
    readTime: '6 min read',
  },
  {
    slug: 'sme-digitalisation-malaysia-beyond-grants',
    href: '#/blog/sme-digitalisation-malaysia-beyond-grants',
    label: 'Malaysia',
    title: "SME Digitalisation in Malaysia: Beyond the Grant Cycle",
    excerpt: "Matching grants have done their job. The next phase requires sustainable infrastructure that doesn't depend on subsidy.",
    date: 'Mar 2026',
    readTime: '5 min read',
  },
  {
    slug: 'malaysia-cx-frontline-readiness',
    href: '#/blog/malaysia-cx-frontline-readiness',
    label: 'Malaysia',
    title: "Malaysia's Next Growth Layer Is Invisible",
    excerpt: "How AI-mediated demand is quietly reshaping business across Southeast Asia, and why operational readiness is becoming the new competitive edge.",
    date: 'Feb 2026',
    readTime: '6 min read',
  },
];

const nzPosts: Card[] = [
  {
    slug: 'nz-australia-ai-stress-test',
    href: '#/blog/nz-australia-ai-stress-test',
    label: 'New Zealand',
    title: "The Future of AI May Be Stress-Tested in New Zealand and Australia",
    excerpt: "NZ and Australia aren't AI laggards. They may become the world's most important stress-test environments for operational trust in the AI era.",
    date: 'May 2026',
    readTime: '9 min read',
  },
  {
    slug: 'nz-australia-ai-era-cautiously',
    href: '#/blog/nz-australia-ai-era-cautiously',
    label: 'New Zealand',
    title: "New Zealand and Australia Are Entering the AI Era More Cautiously Than the Market Realises",
    excerpt: "The region isn't facing an AI adoption challenge. It's facing an operational readiness challenge. And that distinction matters enormously.",
    date: 'May 2026',
    readTime: '10 min read',
  },
  {
    slug: 'new-zealand-agentic-ai-opportunity',
    href: '#/blog/new-zealand-agentic-ai-opportunity',
    label: 'New Zealand',
    title: "New Zealand's Agentic AI Opportunity in Professional Services",
    excerpt: "NZ firms punch above their weight in services exports. Agentic infrastructure could be the multiplier that lets small teams compete globally.",
    date: 'Apr 2026',
    readTime: '5 min read',
  },
];

const tabs = [
  { id: 'global', label: 'Global', posts: globalPosts },
  { id: 'malaysia', label: 'Malaysia', posts: myPosts },
  { id: 'new-zealand', label: 'New Zealand', posts: nzPosts },
];

function BlogCard({ post }: { post: Card }) {
  return (
    <a
      href={post.href}
      className="group relative flex flex-col justify-between p-5 bg-nex-navy/40 border border-nex-cyan/30 rounded-xl overflow-hidden transition-all duration-300 h-full min-w-0 shadow-[0_0_18px_rgba(0,212,255,0.10),inset_0_0_24px_rgba(0,212,255,0.05)] hover:border-nex-cyan/60 hover:bg-nex-navy/60 hover:shadow-[0_0_32px_rgba(0,212,255,0.22),inset_0_0_36px_rgba(0,212,255,0.09)] hover:-translate-y-1.5 hover:scale-[1.02]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.08)_0%,transparent_65%)] pointer-events-none transition-opacity duration-300 group-hover:opacity-150" />
      <div className="relative">
        {post.label && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-[11px] font-bold uppercase tracking-widest mb-3">
            {post.label}
          </span>
        )}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="font-urbanist text-white font-bold text-sm leading-snug group-hover:text-nex-cyan transition-colors duration-200">
            {post.title}
          </h4>
          <ArrowRight className="w-4 h-4 text-nex-cyan/40 group-hover:text-nex-cyan group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-0.5" />
        </div>
        <p className="font-inter text-nex-grey text-xs leading-relaxed line-clamp-3">{post.excerpt}</p>
      </div>
      <div className="relative flex items-center gap-3 font-inter text-nex-grey/50 text-xs mt-4">
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>
    </a>
  );
}

const GAP = 16; // px gap between cards

function BlogCarousel({ posts }: { posts: Card[] }) {
  const [index, setIndex] = useState(0);
  const [containerW, setContainerW] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleCount = 3;
  const maxIndex = Math.max(0, posts.length - visibleCount);

  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(maxIndex, i + 1));

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerW(containerRef.current.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const cardW = containerW ? (containerW - GAP * (visibleCount - 1)) / visibleCount : 0;
  const offset = index * (cardW + GAP);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={containerRef}>
        <motion.div
          className="flex"
          style={{ gap: GAP }}
          animate={{ x: -offset }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        >
          {posts.map(post => (
            <div
              key={post.slug}
              style={{ minWidth: `calc((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount})` }}
            >
              <BlogCard post={post} />
            </div>
          ))}
        </motion.div>
      </div>

      {posts.length > visibleCount && (
        <div className="flex items-center justify-end gap-3 mt-6" role="group" aria-label="Carousel controls">
          <button
            onClick={prev}
            disabled={!canPrev}
            aria-label="Previous posts"
            className="w-11 h-11 flex items-center justify-center rounded-full border border-nex-cyan/60 bg-nex-cyan/10 text-nex-cyan hover:border-nex-cyan hover:bg-nex-cyan/20 hover:shadow-[0_0_16px_rgba(0,212,255,0.5)] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2" role="group" aria-label="Carousel position">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show posts ${i * visibleCount + 1} to ${Math.min((i + 1) * visibleCount, posts.length)}`}
                aria-pressed={i === index}
                className={`rounded-full transition-all duration-300 ${i === index ? 'bg-nex-cyan w-6 h-2 shadow-[0_0_8px_rgba(0,212,255,0.6)]' : 'bg-nex-cyan/30 w-2 h-2 hover:bg-nex-cyan/60'}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={!canNext}
            aria-label="Next posts"
            className="w-11 h-11 flex items-center justify-center rounded-full border border-nex-cyan/60 bg-nex-cyan/10 text-nex-cyan hover:border-nex-cyan hover:bg-nex-cyan/20 hover:shadow-[0_0_16px_rgba(0,212,255,0.5)] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Blogs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (id: string) => void }) {
  const [carouselKey, setCarouselKey] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = tabs.find(t => t.id === activeTab) ?? tabs[0];

  const switchTab = (id: string) => {
    onTabChange(id);
    setCarouselKey(k => k + 1);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (i + 1) % tabs.length;
      switchTab(tabs[next].id);
      tabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (i - 1 + tabs.length) % tabs.length;
      switchTab(tabs[prev].id);
      tabRefs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      switchTab(tabs[0].id);
      tabRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      switchTab(tabs[tabs.length - 1].id);
      tabRefs.current[tabs.length - 1]?.focus();
    }
  };

  return (
    <section className="section-divider pb-0 md:pb-0 lg:pb-0" id="blog">
      <div className="container-wide pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="mb-8">
            <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest mb-3">Blogs</p>
            <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              Perspectives
            </h2>
            <p className="font-inter text-nex-grey text-base max-w-2xl leading-relaxed">
              Thinking on agentic AI, operational readiness, and what the shift means for businesses in global and regional markets.
            </p>
          </div>

          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Blog categories"
            className="flex items-center gap-1 mb-8 border-b border-nex-cyan/10"
          >
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                ref={el => { tabRefs.current[i] = el; }}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => switchTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, i)}
                className={`relative px-5 py-2.5 font-inter text-sm font-semibold transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-nex-cyan'
                    : 'text-nex-grey/60 hover:text-nex-grey'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-nex-cyan"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              id={`tabpanel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <BlogCarousel key={carouselKey} posts={active.posts} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
