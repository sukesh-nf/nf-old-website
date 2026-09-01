import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Calendar, ChevronRight, Check, Share2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useMeta } from '../lib/useMeta';
import { useJsonLd } from '../lib/useJsonLd';
import { getArticle } from './knowledge/data';

const BASE_URL = 'https://nexfrontierlogic.nz';

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

function Breadcrumbs({ question }: { question: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-inter text-xs text-nex-grey/60 mb-8 flex-wrap">
      <a href="/" className="hover:text-nex-cyan transition-colors">Home</a>
      <ChevronRight size={12} className="text-nex-grey/40" />
      <a href="#/faq" className="hover:text-nex-cyan transition-colors">Knowledge Centre</a>
      <ChevronRight size={12} className="text-nex-grey/40" />
      <span className="text-nex-grey/80 truncate max-w-[180px]">{question}</span>
    </nav>
  );
}

function ShareButtons({ slug }: { slug: string }) {
  const url = `${BASE_URL}/#/knowledge/${slug}`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 font-inter text-xs text-nex-grey hover:text-nex-cyan transition-colors"
      >
        {copied ? <Check size={14} className="text-nex-cyan" /> : <Share2 size={14} />}
        {copied ? 'Copied' : 'Share'}
      </button>
    </div>
  );
}

export default function KnowledgeArticle({ slug, onBack }: { slug: string; onBack: () => void }) {
  const article = getArticle(slug);

  useMeta({
    title: article ? `${article.question} - NexFrontier Knowledge Centre` : 'Article Not Found - NexFrontier',
    description: article ? article.metaDescription : 'Knowledge article from NexFrontier.',
    ogUrl: `/#/knowledge/${slug}`,
  });

  useJsonLd(article ? [
    {
      '@type': 'Article',
      '@id': `${BASE_URL}/#/knowledge/${slug}`,
      'headline': article.question,
      'description': article.metaDescription,
      'datePublished': '2026-07-01',
      'dateModified': '2026-07-01',
      'author': { '@type': 'Organization', 'name': 'NexFrontier' },
      'publisher': { '@type': 'Organization', 'name': 'NexFrontier' },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/#/knowledge/${slug}`,
        'url': `${BASE_URL}/#/knowledge/${slug}`,
      },
      'articleSection': article.section,
      'inLanguage': 'en',
      'keywords': ['NexFrontier', 'Operational Readiness', 'AI-Mediated Markets', article.section],
    },
    {
      '@type': 'FAQPage',
      'mainEntity': [{
        '@type': 'Question',
        'name': article.question,
        'acceptedAnswer': { '@type': 'Answer', 'text': article.shortAnswerText },
      }],
    },
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Knowledge Centre', 'item': `${BASE_URL}/#/faq` },
        { '@type': 'ListItem', 'position': 3, 'name': article.question, 'item': `${BASE_URL}/#/knowledge/${slug}` },
      ],
    },
  ] : {
    '@type': 'WebPage',
    'name': 'Article Not Found',
    'url': `${BASE_URL}/#/knowledge/${slug}`,
  });

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker">
        <ReadingProgress />
        <Header />
        <main className="pt-32 container-wide max-w-2xl mx-auto text-center">
          <h1 id="page-heading" className="font-urbanist text-2xl text-nex-cyan font-bold mb-4">Article not found</h1>
          <p className="font-inter text-nex-grey text-sm mb-8">The article you are looking for does not exist or has been moved.</p>
          <a href="#/faq" className="font-inter text-nex-cyan text-sm hover:text-white transition-colors inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Knowledge Centre
          </a>
        </main>
      </div>
    );
  }

  const relatedArticles = article.related
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <ReadingProgress />
      <Header />

      <main className="pt-20">
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 font-inter text-nex-grey hover:text-nex-cyan transition-colors text-sm mb-8"
            >
              <ArrowLeft size={14} />
              Back to Knowledge Centre
            </button>

            <Breadcrumbs question={article.question} />

            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-xs font-bold uppercase tracking-widest">
                {article.section}
              </span>
            </div>

            <h1 id="page-heading" className="font-urbanist text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              {article.question}
            </h1>

            <p className="font-inter text-nex-grey text-base leading-relaxed mb-5">
              {article.summary}
            </p>

            <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-nex-cyan/10">
              <div className="flex items-center gap-4 font-inter text-nex-grey/50 text-xs">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} /> Jul 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} /> {article.readTime}
                </span>
              </div>
              <ShareButtons slug={slug} />
            </div>

            <div className="prose-blog font-inter text-nex-grey text-base leading-relaxed space-y-5">
              {article.body}
            </div>

            {/* Key Takeaways */}
            <div className="mt-10 rounded-2xl border border-nex-cyan/20 bg-nex-navy/30 p-6 md:p-7">
              <h3 className="font-urbanist text-sm font-bold uppercase tracking-widest text-nex-cyan mb-4">
                Key Takeaways
              </h3>
              <ul className="space-y-3">
                {article.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={16} className="flex-shrink-0 text-nex-cyan mt-0.5" />
                    <span className="font-inter text-nex-text text-sm leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Reading */}
            {relatedArticles.length > 0 && (
              <div className="mt-12 pt-8 border-t border-nex-cyan/10">
                <p className="font-inter text-nex-grey/60 text-xs uppercase tracking-widest mb-4">Related Reading</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-10">
                  {relatedArticles.map((rel) => (
                    <a
                      key={rel.slug}
                      href={`#/knowledge/${rel.slug}`}
                      className="px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group"
                    >
                      <p className="font-inter text-nex-text text-xs font-medium group-hover:text-nex-cyan transition-colors duration-300 leading-snug">
                        {rel.question}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 rounded-2xl border border-nex-cyan/25 bg-gradient-to-br from-nex-navy/80 to-nex-darker/80 p-6 md:p-8 text-center">
              <p className="font-inter text-nex-grey text-sm mb-4">
                Interested in how this applies to your business?
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
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
