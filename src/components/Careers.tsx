import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Briefcase, ExternalLink, ChevronDown, Star, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import Footer from './Footer';
import { useMeta } from '../lib/useMeta';

interface JobListing {
  id: string;
  title: string;
  team: string;
  location: string;
  country: string;
  job_type: string;
  description: string;
  linkedin_url: string | null;
  jobstreet_url: string | null;
  seek_url: string | null;
  indeed_url: string | null;
  is_featured: boolean;
  expires_at: string | null;
  no_expiry: boolean;
  created_at: string;
}

const APPLY_PLATFORM_LABELS: Record<string, string> = {
  linkedin_url: 'Apply on LinkedIn',
  jobstreet_url: 'Apply on JobStreet',
  seek_url: 'Apply on SEEK',
  indeed_url: 'Apply on Indeed',
};

function JobCard({ job, index }: { job: JobListing; index: number }) {
  const [open, setOpen] = useState(false);

  const applyLinks = (
    ['linkedin_url', 'jobstreet_url', 'seek_url', 'indeed_url'] as const
  ).filter((k) => job[k]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`rounded-2xl overflow-hidden transition-shadow duration-300 ${
        open
          ? 'shadow-[0_0_0_1px_rgba(24,213,255,0.3),0_8px_32px_rgba(24,213,255,0.07)]'
          : 'shadow-[0_0_0_1px_rgba(255,255,255,0.07)] hover:shadow-[0_0_0_1px_rgba(24,213,255,0.2)]'
      }`}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full text-left px-6 py-5 flex items-start gap-4 transition-all duration-200 ${
          open
            ? 'bg-gradient-to-r from-nex-cyan/[0.07] to-nex-blue/[0.03]'
            : 'bg-white/[0.025] hover:bg-white/[0.04]'
        }`}
      >
        {/* Featured badge */}
        {job.is_featured && (
          <span className="flex-shrink-0 mt-0.5 inline-flex items-center gap-1 bg-nex-cyan/[0.12] border border-nex-cyan/30 text-nex-cyan text-[10px] font-semibold font-inter uppercase tracking-wider px-2 py-0.5 rounded-full">
            <Star size={9} className="fill-nex-cyan" />
            Featured
          </span>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-urbanist font-bold text-nex-text text-base leading-snug mb-2">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {job.team && (
              <span className="inline-flex items-center gap-1.5 font-inter text-nex-grey text-xs">
                <Briefcase size={11} className="text-nex-cyan/70" />
                {job.team}
              </span>
            )}
            {(job.location || job.country) && (
              <span className="inline-flex items-center gap-1.5 font-inter text-nex-grey text-xs">
                <MapPin size={11} className="text-nex-cyan/70" />
                {[job.location, job.country].filter(Boolean).join(', ')}
              </span>
            )}
            {job.job_type && (
              <span className="inline-flex items-center gap-1.5 font-inter text-nex-grey text-xs">
                <Clock size={11} className="text-nex-cyan/70" />
                {job.job_type}
              </span>
            )}
          </div>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className={`flex-shrink-0 mt-1 transition-colors duration-200 ${open ? 'text-nex-cyan' : 'text-white/60'}`}
        >
          <ChevronDown size={17} />
        </motion.span>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-nex-darker/60 border-t border-nex-cyan/10 px-6 py-6">
              {job.description && (
                <p className="font-inter text-nex-grey text-sm leading-relaxed whitespace-pre-line mb-6">
                  {job.description}
                </p>
              )}

              {applyLinks.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {applyLinks.map((k) => (
                    <a
                      key={k}
                      href={job[k]!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-inter font-semibold text-xs px-4 py-2 rounded-full bg-nex-cyan text-nex-dark hover:shadow-[0_0_14px_rgba(24,213,255,0.45)] transition-all duration-200"
                    >
                      {APPLY_PLATFORM_LABELS[k]}
                      <ExternalLink size={11} />
                    </a>
                  ))}
                </div>
              )}

              {applyLinks.length === 0 && (
                <p className="font-inter text-nex-grey/50 text-xs italic">
                  Application details coming soon. Check back shortly.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Careers() {
  useMeta({
    title: 'Careers | NexFrontier',
    description: 'Join NexFrontier and help build the operational reliability infrastructure for the AI-mediated economy. See open roles across engineering, growth, and operations.',
    og: {
      title: 'Careers at NexFrontier',
      description: 'Open roles at NexFrontier. Building the reliability layer for enterprise AI.',
      url: 'https://nexfrontier.my/#/careers',
    },
  });

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTeam, setActiveTeam] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('job_listings')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setJobs(data ?? []);
        setLoading(false);
      });
  }, []);

  const teams = Array.from(new Set(jobs.map((j) => j.team).filter(Boolean)));

  const visible = activeTeam
    ? jobs.filter((j) => j.team === activeTeam)
    : jobs;

  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-nex-cyan focus:text-nex-dark focus:font-semibold focus:rounded-lg focus:text-sm"
      >
        Skip to main content
      </a>
      <Header />

      <main id="main-content" className="pt-32 pb-24">
        <div className="container-wide max-w-4xl mx-auto px-4">

          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-10"
          >
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}
              className="inline-flex items-center gap-2 font-inter text-nex-grey hover:text-nex-cyan text-sm transition-colors duration-200"
            >
              <ArrowLeft size={14} />
              Back to home
            </a>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-14 text-center"
          >
            <span className="inline-block font-inter text-xs font-semibold tracking-widest uppercase text-nex-cyan mb-4">
              Join the team
            </span>
            <h1
              id="page-heading"
              className="font-urbanist font-bold text-4xl md:text-5xl text-nex-text leading-tight mb-4"
            >
              Build the Future of<br />
              <span className="text-nex-cyan">AI Reliability</span>
            </h1>
            <p className="font-inter text-nex-grey text-base max-w-xl mx-auto leading-relaxed">
              NexFrontier is building the operational reliability layer for the AI-mediated economy.
              We're looking for exceptional people who want to make enterprise AI actually work at scale.
            </p>
          </motion.div>

          {/* Values strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14"
          >
            {[
              { heading: 'Remote-first', body: 'Work from anywhere across Malaysia, New Zealand, and Southeast Asia.' },
              { heading: 'High ownership', body: 'Small team, big scope. You shape the product and the company.' },
              { heading: 'Category-defining', body: 'Operational reliability for AI is a new category. You help write the playbook.' },
            ].map((v, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.025] border border-white/[0.06] px-5 py-5"
              >
                <p className="font-urbanist font-bold text-nex-text text-sm mb-1">{v.heading}</p>
                <p className="font-inter text-nex-grey text-xs leading-relaxed">{v.body}</p>
              </div>
            ))}
          </motion.div>

          {/* Team filter */}
          {teams.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-wrap gap-2 justify-center mb-10"
            >
              {[{ label: 'All Roles', value: null as string | null }, ...teams.map((t) => ({ label: t, value: t }))].map(({ label, value }) => {
                const active = activeTeam === value;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveTeam(value)}
                    className={`font-inter text-xs font-semibold px-5 py-2 rounded-full border transition-all duration-200 whitespace-nowrap ${
                      active
                        ? 'text-nex-dark border-nex-cyan bg-nex-cyan shadow-[0_0_16px_rgba(24,213,255,0.5)]'
                        : 'text-nex-grey border-white/[0.12] bg-white/[0.03] hover:border-nex-cyan/50 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* Job list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-white/[0.025] border border-white/[0.06] h-20 animate-pulse" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-urbanist font-bold text-nex-text text-xl mb-3">No open roles right now</p>
              <p className="font-inter text-nex-grey text-sm max-w-sm mx-auto leading-relaxed">
                We're growing fast. Send your CV to{' '}
                <a href="mailto:hello@nexfrontier.my" className="text-nex-cyan hover:text-nex-cyan/80 transition-colors">
                  hello@nexfrontier.my
                </a>{' '}
                and we'll reach out when something fits.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {visible.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          )}

          {/* Speculative application */}
          {!loading && visible.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="mt-16 rounded-2xl bg-nex-cyan/[0.05] border border-nex-cyan/20 px-8 py-8 text-center"
            >
              <p className="font-urbanist font-bold text-nex-text text-lg mb-2">Don't see your role?</p>
              <p className="font-inter text-nex-grey text-sm mb-5 max-w-md mx-auto leading-relaxed">
                We hire for capability, not just open slots. If you're exceptional and believe in what we're building, reach out.
              </p>
              <a
                href="mailto:hello@nexfrontier.my"
                className="inline-flex items-center gap-2 font-inter font-semibold text-sm px-6 py-2.5 rounded-full border border-nex-cyan/40 text-nex-cyan hover:bg-nex-cyan hover:text-nex-dark transition-all duration-200"
              >
                hello@nexfrontier.my
              </a>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
