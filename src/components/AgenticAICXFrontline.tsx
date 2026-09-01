import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Download, TrendingUp, Users } from 'lucide-react';
import { useMeta } from '../lib/useMeta';
import { useJsonLd } from '../lib/useJsonLd';


function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  };
}


const investorTableData = [
  {
    signal: 'Enterprise AI spend accelerating but ROI remains elusive',
    implication: 'Budgets exist; the layer translating spend into operational performance does not',
    opportunity: 'NexFrontier occupies the critical gap between AI investment and execution value',
  },
  {
    signal: 'NiCE validates fragmented systems as the primary CX bottleneck',
    implication: 'The problem is structural and pervasive, not niche or departmental',
    opportunity: 'Large addressable market across every enterprise vertical with operational workflows',
  },
  {
    signal: 'Agentic AI shifting from pilot to production across enterprise CX',
    implication: 'The window to become foundational infrastructure is opening now',
    opportunity: 'First-mover positioning in operational reliability layer before market consolidates',
  },
  {
    signal: 'Human Latency identified as a commercial risk, not just an efficiency issue',
    implication: 'Enterprises will pay to close this gap as AI-mediated competition intensifies',
    opportunity: 'NexFrontier monetises the urgency of operational responsiveness at scale',
  },
  {
    signal: 'Transformation timelines incompatible with market speed',
    implication: 'Businesses cannot wait years for readiness; they need a bridge layer now',
    opportunity: 'NexFrontier\'s above-the-stack architecture removes the dependency on transformation completion',
  },
];

function Sidebar() {
  return (
    <motion.aside {...fade(0.15)} className="lg:sticky lg:top-8 space-y-5">
      <a
        href="https://wufxwblizgnizssdejhn.supabase.co/storage/v1/object/public/reports/the-agentic-ai-cx-frontline-report.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col p-6 bg-gradient-to-br from-nex-navy/60 to-nex-darker/60 border border-nex-cyan/10 rounded-lg hover:border-nex-cyan/30 transition-all duration-300"
      >
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-xs font-bold uppercase tracking-widest mb-4">
          Research
        </span>
        <h2 className="font-urbanist text-white font-bold text-lg leading-snug mb-3 group-hover:text-nex-cyan transition-colors duration-300">
          The Agentic AI CX Frontline
        </h2>
        <p className="font-inter text-nex-grey text-sm leading-relaxed flex-1 mb-3">
          NiCE's enterprise research documenting the structural shift to agentic AI and the operational gaps that define the new competitive landscape.
        </p>
        <p className="font-inter text-nex-grey/40 text-xs mb-5">
          NiCE · 2026
        </p>
        <span className="inline-flex items-center gap-2 font-inter text-nex-cyan text-sm font-medium">
          <Download size={13} />
          Download report <ExternalLink size={11} className="opacity-60" />
        </span>
      </a>

      <div className="p-5 bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border border-nex-cyan/20 rounded-lg">
        <p className="font-urbanist text-nex-cyan font-bold text-xs uppercase tracking-widest mb-3">
          Core Thesis
        </p>
        <p className="font-inter text-nex-text text-sm leading-relaxed italic">
          "The infrastructure layer beneath AI-mediated commerce does not yet have a clear winner."
        </p>
      </div>

      <div className="p-5 bg-nex-navy/40 border border-nex-cyan/10 rounded-lg space-y-3">
        <p className="font-urbanist text-nex-grey/80 font-bold text-xs uppercase tracking-widest">
          Key Signals
        </p>
        {[
          { label: 'Operational reinvention', sub: 'Not a software upgrade - a structural shift' },
          { label: 'Quiet Loss', sub: 'Revenue lost to Human Latency between intent and action' },
          { label: 'Agentic AI', sub: 'Moving from isolated steps to orchestrating outcomes' },
        ].map(({ label, sub }) => (
          <div key={label} className="border-t border-nex-cyan/10 pt-3 first:border-0 first:pt-0">
            <p className="font-urbanist text-nex-cyan font-bold text-sm mb-0.5">{label}</p>
            <p className="font-inter text-nex-grey text-xs leading-relaxed">{sub}</p>
          </div>
        ))}
      </div>

      <a
        href="/#calculate-quiet-loss"
        className="inline-flex items-center justify-center gap-2 w-full px-7 py-3.5 bg-nex-cyan text-nex-dark font-inter font-semibold rounded-full hover:shadow-glow-cyan-lg transition-all duration-300 text-sm"
      >
        Calculate Your Quiet Loss
        <ArrowRight size={14} />
      </a>
    </motion.aside>
  );
}

function MarketTab() {
  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-12 xl:gap-16 items-start">
      <div className="space-y-7 max-w-2xl">

        {/* Intro */}
        <motion.p {...fade(0.1)} className="font-inter text-nex-text text-base leading-relaxed">
          NiCE's Agentic AI CX Frontline Report reveals something much bigger than the next evolution of customer service automation.
        </motion.p>

        <motion.p {...fade(0.11)} className="font-inter text-nex-grey text-base leading-relaxed">
          It points toward a broader market shift already underway: AI is moving from supporting workflows to orchestrating outcomes.
        </motion.p>

        <motion.p {...fade(0.12)} className="font-inter text-nex-cyan text-base leading-relaxed font-semibold">
          That distinction matters enormously.
        </motion.p>

        <motion.div {...fade(0.13)} className="space-y-3">
          <p className="font-inter text-nex-grey text-base leading-relaxed">
            Because most enterprises are still treating AI as:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2">
            {['tools', 'assistants', 'copilots', 'or productivity layers'].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade(0.14)} className="space-y-3">
          <p className="font-inter text-nex-grey text-base leading-relaxed">
            But the report repeatedly points toward something deeper.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed">
            The businesses pulling ahead are redesigning operations around machine-speed responsiveness, continuity, and orchestration.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed">That is not a software upgrade.</p>
          <p className="font-inter text-nex-cyan text-base font-semibold leading-relaxed">It is an operational shift.</p>
        </motion.div>

        {/* The Real Signal */}
        <motion.div {...fade(0.16)} className="pt-2">
          <p className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            The Real Signal Inside the Report
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            One of the strongest insights in the report is this:
          </p>
          <div className="px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/5 border-l-4 border-nex-cyan rounded-r-xl mb-5">
            <p className="font-inter text-nex-text text-sm leading-relaxed italic">
              "The first wave of AI only added intelligence to isolated steps. It created visible wins but left underlying systems unchanged."
            </p>
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            That observation aligns closely with what many enterprises are now experiencing.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Most organisations already possess:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'CRMs',
              'automation platforms',
              'AI pilots',
              'workflow systems',
              'and growing digital infrastructure',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Yet operational friction remains widespread:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'delayed response',
              'fragmented workflows',
              'broken handovers',
              'duplicated effort',
              'disconnected systems',
              'and Human Latency between customer intent and business action',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-3">
            The issue is no longer access to AI.
          </p>
          <p className="font-inter text-nex-cyan text-base font-semibold leading-relaxed">
            The issue is whether businesses can operate reliably at AI speed.
          </p>
        </motion.div>

        {/* AI Is Changing Competitive Advantage */}
        <motion.div {...fade(0.19)} className="pt-6 border-t border-nex-cyan/10">
          <p className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            AI Is Changing What Competitive Advantage Looks Like
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            The report repeatedly emphasises:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {['orchestration', 'continuity', 'redesign', 'and execution flow'].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-5">
            Not simply intelligence.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">That is a very important shift.</p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Historically, businesses optimised:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {['departments', 'labour efficiency', 'process ownership', 'and system deployment'].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            AI-mediated markets increasingly reward:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {['responsiveness', 'continuity', 'coordination', 'and outcome velocity'].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Customers no longer experience businesses through organisational charts.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">They experience:</p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {['speed', 'reliability', 'continuity', 'and resolution quality'].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            This changes what operational competitiveness actually means.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Because businesses with fragmented workflows, slow escalation, disconnected execution, and operational drag increasingly lose trust and momentum much faster than before.
          </p>
          <div className="px-6 py-5 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl">
            <p className="font-inter text-nex-text text-sm leading-relaxed">
              This is where NexFrontier's positioning becomes highly relevant. We focus on helping businesses reduce Human Latency, strengthen continuity, and recover{' '}
              <span className="text-nex-cyan font-semibold">Quiet Loss</span>: revenue and opportunity silently lost through operational friction beneath customer journeys.
            </p>
          </div>
        </motion.div>

        {/* Contact Centre */}
        <motion.div {...fade(0.22)} className="pt-6 border-t border-nex-cyan/10">
          <p className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            The Contact Centre Is Becoming an Operational Signal
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            NiCE frames the contact centre as "the front line of trust in the AI era."
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            But the report's implications extend far beyond CX. What it is really describing is the emergence of operational trust infrastructure.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            The businesses pulling ahead in AI-mediated markets are increasingly the ones capable of:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'responding faster',
              'coordinating better',
              'reducing friction',
              'preserving continuity',
              'and reliably turning intent into outcomes',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            This applies not only to customer service, but increasingly across:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'sales',
              'logistics',
              'healthcare',
              'financial services',
              'education',
              'energy',
              'and enterprise operations more broadly',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed">
            Because operational reliability is becoming commercially visible.
          </p>
        </motion.div>

        {/* Bigger Shift */}
        <motion.div {...fade(0.25)} className="pt-6 border-t border-nex-cyan/10">
          <p className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            The Bigger Shift Happening Beneath Enterprise AI
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            The report repeatedly returns to the same hidden tension: AI capability is accelerating faster than organisational structures can adapt.
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'Legacy architectures',
              'fragmented workflows',
              'rigid operational structures',
              'and disconnected execution layers',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            increasingly slow businesses down precisely when markets are speeding up.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            This is why the AI era is not simply exposing technology gaps. It is exposing operational fragility.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            The organisations most likely to succeed will not necessarily be the ones with:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'the largest AI budgets',
              'the most pilots',
              'or the most software layers',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            They will increasingly be the organisations operationally capable of:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'responding faster',
              'coordinating reliably',
              'reducing friction',
              'strengthening continuity',
              'and operating effectively under machine-speed conditions',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-urbanist text-white font-bold text-xl md:text-2xl leading-snug">
            That is the frontier NexFrontier is built for.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div {...fade(0.32)} className="pt-4 pb-2 border-t border-nex-cyan/10">
          <p className="font-inter text-nex-grey/60 text-xs uppercase tracking-widest mb-3">Also in this series</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#/reading-the-shift" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
              <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">First</p>
              <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">AI Adoption Is Splitting Into Two Different Market Economies</p>
            </a>
            <a href="#/data-readiness-index" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
              <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Previous</p>
              <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">Data Readiness Will Not Save Slow Operations</p>
            </a>
          </div>
        </motion.div>

        <motion.div {...fade(0.36)} className="flex flex-col sm:flex-row gap-4 pt-2">
          <a
            href="/#calculate-quiet-loss"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-nex-cyan text-nex-dark font-inter font-semibold rounded-full hover:shadow-glow-cyan-lg transition-all duration-300 text-sm"
          >
            Calculate Your Quiet Loss
            <ArrowRight size={14} />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-nex-cyan/60 text-nex-cyan font-inter font-semibold rounded-full hover:bg-nex-cyan/10 transition-all duration-300 text-sm"
          >
            Back to NexFrontier
          </a>
        </motion.div>
      </div>

      <Sidebar />
    </div>
  );
}

function InvestorTab() {
  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-12 xl:gap-16 items-start">
      <div className="space-y-7 max-w-2xl">

        {/* Intro */}
        <motion.p {...fade(0.1)} className="font-inter text-nex-text text-base leading-relaxed">
          NiCE's Agentic AI CX Frontline Report points toward a significant shift now emerging beneath enterprise AI adoption:
        </motion.p>

        <motion.p {...fade(0.11)} className="font-inter text-nex-grey text-base leading-relaxed">
          The next major AI infrastructure opportunity may not sit in models, copilots, or AI assistants.
        </motion.p>

        <motion.p {...fade(0.12)} className="font-inter text-nex-cyan text-base leading-relaxed font-semibold">
          It may sit in the operational layer beneath them.
        </motion.p>

        <motion.div {...fade(0.13)} className="space-y-3">
          <p className="font-inter text-nex-grey text-base leading-relaxed">
            That distinction matters for investors because most enterprises have already spent heavily on:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2">
            {[
              'cloud infrastructure',
              'workflow platforms',
              'CRM ecosystems',
              'automation tooling',
              'and AI experimentation',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade(0.14)} className="space-y-3">
          <p className="font-inter text-nex-grey text-base leading-relaxed">
            Yet operational friction remains deeply unresolved across enterprise environments:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2">
            {[
              'fragmented workflows',
              'disconnected systems',
              'delayed response',
              'duplicated effort',
              'broken escalation',
              'and slow coordination between customer intent and operational execution',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p {...fade(0.15)} className="font-inter text-nex-grey text-base leading-relaxed">
          The NiCE report repeatedly points toward orchestration, continuity, and execution flow as the real constraint emerging inside enterprise AI environments.
        </motion.p>

        <motion.p {...fade(0.16)} className="font-inter text-nex-cyan text-base font-semibold leading-relaxed">
          That is an important market signal.
        </motion.p>

        {/* The Market Is Moving */}
        <motion.div {...fade(0.18)} className="pt-2">
          <p className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            The Market Is Moving Beyond AI Tooling
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            One of the strongest observations in the report is this:
          </p>
          <div className="px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/5 border-l-4 border-nex-cyan rounded-r-xl mb-5">
            <p className="font-inter text-nex-text text-sm leading-relaxed italic">
              "The first wave of AI only added intelligence to isolated steps. It created visible wins but left underlying systems unchanged."
            </p>
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            This has major commercial implications.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            The first wave of AI investment largely rewarded:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'model development',
              'copilots',
              'productivity tooling',
              'and enterprise experimentation',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            The next phase increasingly shifts toward:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'operational orchestration',
              'workflow continuity',
              'execution reliability',
              'governance-aware automation',
              'Human Latency reduction',
              'and operational trust infrastructure',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">Why?</p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Because AI-mediated markets compress:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'customer patience',
              'comparison cycles',
              'response expectations',
              'and trust formation dramatically',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            That means operational responsiveness increasingly becomes commercially visible.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Businesses with slow execution, fragmented coordination, disconnected systems, and operational drag increasingly lose momentum faster than traditional enterprise cycles were designed to handle.
          </p>
          <div className="px-6 py-5 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl">
            <p className="font-inter text-nex-text text-sm leading-relaxed">
              This is not simply a CX problem. It is becoming an <span className="text-nex-cyan font-semibold">enterprise competitiveness problem.</span>
            </p>
          </div>
        </motion.div>

        {/* Where Value Accumulates */}
        <motion.div {...fade(0.22)} className="pt-6 border-t border-nex-cyan/10">
          <p className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            Where Infrastructure Value May Accumulate Next
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Historically, enterprises optimised:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {['departments', 'labour efficiency', 'process ownership', 'and software deployment'].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            AI-mediated markets increasingly reward:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {['responsiveness', 'continuity', 'execution flow', 'and operational coordination'].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            That changes where value may accumulate across the enterprise AI stack.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            The next durable infrastructure layer may increasingly sit between:
          </p>
          <div className="px-6 py-5 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl mb-4">
            <p className="font-inter text-nex-grey text-sm leading-relaxed mb-2">systems of record,</p>
            <p className="font-inter text-nex-grey/50 text-xs uppercase tracking-widest mb-2">and</p>
            <p className="font-inter text-nex-cyan font-semibold text-sm leading-relaxed">systems of execution.</p>
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            This is where operational trust, continuity, and orchestration become economically important.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Not because businesses lack AI capability.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            But because most enterprises still cannot operationally function at AI speed.
          </p>
          <p className="font-inter text-nex-cyan text-base font-semibold leading-relaxed">
            That creates a potentially large and under-recognised infrastructure opportunity.
          </p>
        </motion.div>

        {/* Why NexFrontier */}
        <motion.div {...fade(0.26)} className="pt-6 border-t border-nex-cyan/10">
          <p className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-4">
            Why NexFrontier Sits Inside This Gap
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            NexFrontier focuses on the operational layer beneath AI-mediated customer and enterprise workflows.
          </p>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Rather than functioning as another isolated AI application layer, NexFrontier strengthens:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'responsiveness',
              'continuity',
              'execution reliability',
              'and operational coordination across fragmented environments',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            The focus is reducing:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'Human Latency',
              'operational friction',
              'and Quiet Loss: revenue and opportunity silently lost between customer intent and business execution',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            This positioning becomes increasingly relevant as enterprises discover that:
          </p>
          <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2 mb-6">
            {[
              'AI capability alone does not create operational readiness',
              'and technology ownership alone does not create operational competitiveness',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
                <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
            Because in the AI era, businesses are unlikely to lose because they lacked AI tools.
          </p>
          <p className="font-urbanist text-white font-bold text-xl md:text-2xl leading-snug">
            They are far more likely to lose because their operations could not respond, coordinate, and adapt fast enough to the markets AI is creating.
          </p>
        </motion.div>

        <motion.div {...fade(0.38)} className="pt-4 pb-2 border-t border-nex-cyan/10">
          <p className="font-inter text-nex-grey/60 text-xs uppercase tracking-widest mb-3">Also in this series</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#/reading-the-shift" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
              <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">First</p>
              <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">AI Adoption Is Splitting Into Two Different Market Economies</p>
            </a>
            <a href="#/data-readiness-index" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
              <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Previous</p>
              <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">Data Readiness Will Not Save Slow Operations</p>
            </a>
          </div>
        </motion.div>

        <motion.div {...fade(0.42)} className="flex flex-col sm:flex-row gap-4 pt-2">
          <a
            href="/#investor-brief"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-nex-cyan text-nex-dark font-inter font-semibold rounded-full hover:shadow-glow-cyan-lg transition-all duration-300 text-sm"
          >
            View Investor Brief
            <ArrowRight size={14} />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-nex-cyan/60 text-nex-cyan font-inter font-semibold rounded-full hover:bg-nex-cyan/10 transition-all duration-300 text-sm"
          >
            Back to NexFrontier
          </a>
        </motion.div>
      </div>

      {/* Investor sidebar */}
      <motion.aside {...fade(0.15)} className="lg:sticky lg:top-8 space-y-5">
        <a
          href="https://wufxwblizgnizssdejhn.supabase.co/storage/v1/object/public/reports/the-agentic-ai-cx-frontline-report.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col p-6 bg-gradient-to-br from-nex-navy/60 to-nex-darker/60 border border-nex-cyan/10 rounded-lg hover:border-nex-cyan/30 transition-all duration-300"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-xs font-bold uppercase tracking-widest mb-4">
            Research
          </span>
          <h2 className="font-urbanist text-white font-bold text-lg leading-snug mb-3 group-hover:text-nex-cyan transition-colors duration-300">
            The Agentic AI CX Frontline
          </h2>
          <p className="font-inter text-nex-grey text-sm leading-relaxed flex-1 mb-3">
            NiCE's enterprise research documenting the structural shift to agentic AI and the operational gaps that define the new competitive landscape.
          </p>
          <p className="font-inter text-nex-grey/40 text-xs mb-5">
            NiCE · 2026
          </p>
          <span className="inline-flex items-center gap-2 font-inter text-nex-cyan text-sm font-medium">
            <Download size={13} />
            Download report <ExternalLink size={11} className="opacity-60" />
          </span>
        </a>

        <div className="p-5 bg-nex-navy/40 border border-nex-cyan/10 rounded-lg space-y-4">
          <p className="font-urbanist text-nex-grey/80 font-bold text-xs uppercase tracking-widest">
            Why Now
          </p>
          {[
            { stat: 'Agentic AI', sub: 'moving from pilot to production at enterprise scale' },
            { stat: 'Operational friction', sub: 'now quantifiably linked to revenue loss' },
            { stat: 'Market window', sub: 'open before infrastructure layer consolidates' },
          ].map(({ stat, sub }) => (
            <div key={stat} className="border-t border-nex-cyan/10 pt-3 first:border-0 first:pt-0">
              <p className="font-urbanist text-nex-cyan font-bold text-sm mb-0.5">{stat}</p>
              <p className="font-inter text-nex-grey text-xs leading-relaxed">{sub}</p>
            </div>
          ))}
        </div>

        <div className="p-5 bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border border-nex-cyan/20 rounded-lg">
          <p className="font-urbanist text-nex-cyan font-bold text-xs uppercase tracking-widest mb-3">
            Core Thesis
          </p>
          <p className="font-inter text-nex-text text-sm leading-relaxed italic">
            "The infrastructure layer beneath AI-mediated commerce does not yet have a clear winner."
          </p>
        </div>

        <a
          href="/#investor-brief"
          className="inline-flex items-center justify-center gap-2 w-full px-7 py-3.5 bg-nex-cyan text-nex-dark font-inter font-semibold rounded-full hover:shadow-glow-cyan-lg transition-all duration-300 text-sm"
        >
          View Investor Brief
          <ArrowRight size={14} />
        </a>
      </motion.aside>
    </div>
  );
}

type Tab = 'market' | 'investor';

export default function AgenticAICXFrontline() {
  useMeta({
    title: 'The Agentic AI CX Frontline - NexFrontier',
    description: "NexFrontier's investor-grade analysis of agentic AI in customer experience: why enterprise CX is shifting from automation to autonomous agents, and what that means for operational infrastructure.",
    ogUrl: '/#/agentic-ai-cx-frontline',
  });
  useJsonLd([
    {
      '@type': 'WebPage',
      '@id': 'https://nexfrontier.my/#/agentic-ai-cx-frontline',
      'url': 'https://nexfrontier.my/#/agentic-ai-cx-frontline',
      'name': 'The Agentic AI CX Frontline - NexFrontier',
      'description': "NexFrontier's investor-grade analysis of agentic AI in customer experience: why enterprise CX is shifting from automation to autonomous agents, and what that means for operational infrastructure.",
      'isPartOf': { '@id': 'https://nexfrontier.my/#website' },
      'publisher': { '@id': 'https://nexfrontier.my/#organization' },
      'inLanguage': 'en',
    },
    {
      '@type': 'Report',
      'name': 'NiCE Agentic AI CX Frontline - NexFrontier Investor Response',
      'description': "Investor-grade analysis of the NiCE Agentic AI CX Frontline report. Covers the shift from contact-centre automation to autonomous agentic CX, and NexFrontier's positioning as operational reliability infrastructure above existing systems of record.",
      'about': [
        { '@type': 'Thing', 'name': 'Agentic AI' },
        { '@type': 'Thing', 'name': 'Customer Experience Infrastructure' },
        { '@type': 'Thing', 'name': 'Enterprise AI Deployment' },
      ],
      'publisher': { '@id': 'https://nexfrontier.my/#organization' },
      'inLanguage': 'en',
    },
  ]);
  const [activeTab, setActiveTab] = useState<Tab>('market');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'market', label: 'Market Perspective', icon: Users },
    { id: 'investor', label: 'Investor Signal', icon: TrendingUp },
  ];

  const handleTabKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[next].id);
      tabRefs.current[next]?.focus();
    } else if (e.key === 'Home') { e.preventDefault(); setActiveTab(tabs[0].id); tabRefs.current[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); setActiveTab(tabs[tabs.length - 1].id); tabRefs.current[tabs.length - 1]?.focus(); }
  };

  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-nex-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-nex-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide py-20 md:py-28 relative">
        <motion.a
          href="#"
          {...fade(0)}
          className="inline-flex items-center gap-2 font-inter text-nex-grey hover:text-nex-cyan text-sm font-medium transition-colors duration-300 mb-14"
        >
          <ArrowLeft size={14} />
          Back
        </motion.a>

        {/* Page header */}
        <motion.div {...fade(0.05)} className="max-w-3xl mb-12">
          <div className="mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-xs font-bold uppercase tracking-widest">
              NexFrontier's Response to NiCE's Agentic AI CX Frontline Report
            </span>
          </div>
          <h1 className="font-urbanist text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
            AI Is Making Operational Responsiveness<br />
            <span className="text-nex-cyan">a Competitive Advantage.</span>
          </h1>
          <p className="font-inter text-nex-grey text-lg leading-relaxed">
            NiCE's Agentic AI CX Frontline report confirms something many enterprises are only beginning to realise: the AI era is no longer about adding intelligence to workflows. It is about redesigning how businesses operate altogether.
          </p>
        </motion.div>

        {/* Tab bar */}
        <motion.div {...fade(0.08)} className="mb-12">
          <div role="tablist" aria-label="Report perspectives" className="flex border-b border-nex-cyan/15">
            {tabs.map(({ id, label, icon: Icon }, i) => (
              <button
                key={id}
                ref={el => { tabRefs.current[i] = el; }}
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`tabpanel-acx-${id}`}
                id={`tab-acx-${id}`}
                tabIndex={activeTab === id ? 0 : -1}
                onClick={() => setActiveTab(id)}
                onKeyDown={(e) => handleTabKeyDown(e, i)}
                className={`relative flex items-center gap-2.5 px-1 pb-4 mr-10 text-sm font-inter font-medium transition-colors duration-200 ${
                  activeTab === id
                    ? 'text-white'
                    : 'text-nex-grey/60 hover:text-nex-grey'
                }`}
              >
                <Icon
                  size={14}
                  aria-hidden="true"
                  className={`transition-colors duration-200 ${activeTab === id ? 'text-nex-cyan' : 'text-nex-grey/40'}`}
                />
                {label}
                {activeTab === id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-nex-cyan rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`tabpanel-acx-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-acx-${activeTab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'market' ? <MarketTab /> : <InvestorTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
