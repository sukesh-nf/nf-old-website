import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Download, Users, TrendingUp } from 'lucide-react';
import { useMeta } from '../lib/useMeta';
import { useJsonLd } from '../lib/useJsonLd';

const REPORT_URL = 'https://wufxwblizgnizssdejhn.supabase.co/storage/v1/object/public/reports/the-data-readiness-index-understanding-the-foundations-for-successful-ai.pdf';

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  };
}

const tableData = [
  {
    finding: '79% cannot access all the data their AI needs',
    reveals: 'Enterprises still operate with fragmented visibility',
    position: 'Businesses are losing more from disconnected execution than lack of data',
  },
  {
    finding: 'Only 18% say data is fully governed',
    reveals: 'Confidence often exceeds operational reality',
    position: 'AI readiness without operational reliability creates commercial risk',
  },
  {
    finding: 'Data quality is the #1 reason AI ROI falls short',
    reveals: 'Better models cannot compensate for weak execution',
    position: 'Responsiveness matters more than perfect databases',
  },
  {
    finding: '73% say infrastructure performance hinders operations',
    reveals: 'Legacy systems slow responsiveness',
    position: 'Businesses cannot wait years for transformation before improving execution',
  },
  {
    finding: 'Weak workflow integration blocks value',
    reveals: 'The issue is operational flow',
    position: 'NexFrontier strengthens the operational layer without forcing system replacement',
  },
];

function Sidebar() {
  return (
    <motion.aside {...fade(0.15)} className="lg:sticky lg:top-8 space-y-5">
      <a
        href={REPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="group relative flex flex-col p-6 bg-gradient-to-br from-nex-navy/60 to-nex-darker/60 border border-nex-cyan/10 rounded-lg hover:border-nex-cyan/30 transition-all duration-300"
      >
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-xs font-bold uppercase tracking-widest mb-4">
          Research
        </span>
        <h2 className="font-urbanist text-white font-bold text-lg leading-snug mb-3 group-hover:text-nex-cyan transition-colors duration-300">
          The Data Readiness Index 2026
        </h2>
        <p className="font-inter text-nex-grey text-sm leading-relaxed flex-1 mb-3">
          Cloudera, in partnership with Researchscape, surveyed 1,270 IT leaders across AMER, EMEA, and APAC to understand the foundational barriers to successful AI deployment.
        </p>
        <p className="font-inter text-nex-grey/40 text-xs mb-5">
          Cloudera &amp; Researchscape · Jan–Mar 2026 · 1,270 IT leaders
        </p>
        <span className="inline-flex items-center gap-2 font-inter text-nex-cyan text-sm font-medium">
          <Download size={13} />
          Download report <ExternalLink size={11} className="opacity-60" />
        </span>
      </a>

      <div className="p-5 bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border border-nex-cyan/20 rounded-lg">
        <p className="font-urbanist text-nex-cyan font-bold text-sm uppercase tracking-widest mb-3">
          Human Latency
        </p>
        <p className="font-inter text-nex-text text-sm leading-relaxed italic">
          "The widening gap between customer intent and business action."
        </p>
      </div>

      <div className="p-5 bg-nex-navy/40 border border-nex-cyan/10 rounded-lg">
        <p className="font-urbanist text-nex-grey/80 font-bold text-sm uppercase tracking-widest mb-3">
          Key finding
        </p>
        <p className="font-urbanist text-white font-bold text-3xl mb-1">73%</p>
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          say infrastructure performance hinders their operational initiatives.
        </p>
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
    <div className="space-y-7 max-w-2xl">
      <motion.p {...fade(0.1)} className="font-inter text-nex-text text-base leading-relaxed">
        Cloudera's Data Readiness Index 2026 confirms something many enterprises are already feeling: the infrastructure beneath their AI ambitions was never designed for the speed of the markets now forming around them.
      </motion.p>

      <motion.p {...fade(0.12)} className="font-inter text-nex-grey text-base leading-relaxed">
        Most organisations still operate through fragmented systems, siloed data, disconnected workflows, delayed execution, and operational layers built for a much slower era.
      </motion.p>

      <motion.p {...fade(0.13)} className="font-inter text-nex-text text-base leading-relaxed font-semibold">
        But the deeper issue is not data. It is operational readiness.
      </motion.p>

      <motion.div {...fade(0.14)} className="pt-2">
        <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest mb-4">
          Businesses Are Preparing Data While Markets Move Ahead Without Them
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
          The report assumes enterprises must first become data ready, fully governed, and structurally modernised before operational AI value can be realised. That means years of database restructuring, cloud migration, governance programmes, and transformation spending before responsiveness improves.
        </p>
        <motion.p {...fade(0.16)} className="font-inter text-nex-cyan text-base leading-relaxed font-semibold">
          NexFrontier believes that sequence is increasingly backwards.
        </motion.p>
      </motion.div>

      <motion.div {...fade(0.18)} className="space-y-3">
        <p className="font-inter text-nex-grey text-base leading-relaxed">Most businesses already have CRMs, dashboards, workflow systems, cloud platforms, and growing AI ecosystems. Yet operational friction remains everywhere:</p>
        <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2">
          {[
            'slow response',
            'broken follow-up',
            'fragmented workflows',
            'delayed decisions',
            'and Human Latency between customer intent and business action',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
              <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          That is where businesses quietly lose momentum, trust, and revenue.
        </p>
      </motion.div>

      <motion.div {...fade(0.2)} className="pt-2">
        <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest mb-4">
          The Real Bottleneck Is Execution
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
          The Cloudera report repeatedly points toward weak workflow integration, fragmented operational visibility, inaccessible data, and infrastructure limitations. These are not just technology problems. They are operational problems.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
          Because customers increasingly judge businesses through responsiveness, continuity, coordination, and speed of execution, not through architecture diagrams. And AI-mediated markets expose operational weakness much faster than businesses expect.
        </p>
      </motion.div>

      <motion.div {...fade(0.22)} className="px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/5 border-l-4 border-nex-cyan rounded-r-xl">
        <p className="font-urbanist text-nex-cyan font-bold text-sm uppercase tracking-widest mb-2">
          Why NexFrontier Sits Differently
        </p>
        <p className="font-inter text-nex-text text-sm leading-relaxed mb-3">
          Most transformation strategies still focus heavily on rebuilding systems, restructuring databases, and preparing for future AI capability. NexFrontier focuses on helping businesses operate more reliably now.
        </p>
        <p className="font-inter text-nex-text text-sm leading-relaxed">
          Rather than forcing disruptive replacement of existing systems, NexFrontier strengthens the operational layer above them: improving responsiveness, reducing operational friction, strengthening continuity, and recovering Quiet Loss.
        </p>
      </motion.div>

      <motion.div {...fade(0.24)} className="px-6 py-5 bg-nex-navy/40 border border-nex-cyan/10 rounded-xl space-y-3">
        <p className="font-inter text-nex-grey text-sm leading-relaxed font-semibold">
          Because in the AI era, operational readiness matters more than perfect data readiness.
        </p>
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          Businesses are unlikely to fail because their databases were imperfect. They are far more likely to struggle because their operations could not respond, execute, and adapt fast enough.
        </p>
      </motion.div>

      <motion.div {...fade(0.28)} className="pt-2">
        <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest mb-4">
          What the Report Really Reveals
        </p>
      </motion.div>

      <motion.div {...fade(0.32)} className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-sm font-inter border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b border-nex-cyan/15">
              {[
                { label: 'Cloudera Finding', color: 'text-nex-grey' },
                { label: 'What It Really Reveals', color: 'text-nex-blue' },
                { label: 'NexFrontier Perspective', color: 'text-nex-cyan' },
              ].map(({ label, color }) => (
                <th key={label} className={`text-left py-3 px-3 font-urbanist text-xs uppercase tracking-widest font-bold ${color}`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={row.finding} className={i % 2 === 0 ? 'bg-nex-navy/20' : ''}>
                <td className="py-3 px-3 font-inter text-nex-grey/80 text-sm leading-snug align-top">{row.finding}</td>
                <td className="py-3 px-3 font-inter text-nex-text text-sm leading-snug align-top">{row.reveals}</td>
                <td className="py-3 px-3 font-inter text-nex-cyan text-sm leading-snug align-top font-medium">{row.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div {...fade(0.36)} className="space-y-4 pt-2">
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          The AI era will not simply reward businesses with the cleanest databases. It will increasingly reward businesses that can:
        </p>
        <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2">
          {['respond faster', 'coordinate better', 'reduce friction', 'and reliably turn intent into outcomes'].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-nex-cyan mt-2 shrink-0" />
              <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <p className="font-inter text-nex-cyan text-base font-semibold">
          That is the frontier NexFrontier is built for.
        </p>
      </motion.div>

      <motion.div {...fade(0.4)} className="pt-4 pb-2 border-t border-nex-cyan/10">
        <p className="font-inter text-nex-grey/60 text-xs uppercase tracking-widest mb-3">Also in this series</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="#/reading-the-shift" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
            <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Previous</p>
            <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">AI Adoption Is Splitting Into Two Different Market Economies</p>
          </a>
          <a href="#/agentic-ai-cx-frontline" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
            <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Next</p>
            <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">The Agentic AI CX Frontline</p>
          </a>
        </div>
      </motion.div>

      <motion.div {...fade(0.45)} className="flex flex-col sm:flex-row gap-4 pt-2">
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
  );
}

function InvestorTab() {
  return (
    <div className="space-y-7 max-w-2xl">

      <motion.div {...fade(0.1)} className="space-y-4">
        <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest">Investor Signal</p>
        <h2 className="font-urbanist text-white font-bold text-xl md:text-2xl leading-snug">
          The AI Infrastructure Opportunity May Sit Below the Model Layer
        </h2>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Cloudera's Data Readiness Index 2026 highlights a growing gap between enterprise AI ambition and operational capability. For investors, this is more than a technology problem.
        </p>
        <p className="font-inter text-nex-text text-base leading-relaxed">
          It is a signal that many enterprises remain operationally unprepared for AI-mediated markets despite years of digital transformation spending.
        </p>
      </motion.div>

      <motion.div {...fade(0.12)} className="space-y-5">
        <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest">The Report Found</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { stat: '79%', label: 'cannot access all the data their AI initiatives require' },
            { stat: '18%', label: 'say their data is fully governed' },
            { stat: '73%', label: 'say infrastructure performance is already slowing operations' },
          ].map(({ stat, label }) => (
            <div key={stat} className="px-5 py-4 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl text-center space-y-2">
              <p className="font-urbanist text-nex-cyan font-bold text-3xl">{stat}</p>
              <p className="font-inter text-nex-grey text-xs leading-relaxed">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...fade(0.14)} className="space-y-4">
        <p className="font-inter text-nex-text text-base leading-relaxed font-semibold">
          The important insight is this:
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Most enterprises have already invested heavily in cloud infrastructure, workflow systems, analytics, automation, and AI experimentation. Yet operational friction remains everywhere:
        </p>
        <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2">
          {[
            'delayed response',
            'fragmented workflows',
            'disconnected execution',
            'and slow coordination between systems and teams',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <ArrowRight size={13} className="text-nex-cyan mt-0.5 shrink-0" />
              <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...fade(0.16)} className="px-6 py-5 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl space-y-3">
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          This matters because AI-mediated markets increasingly reward:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: 'Responsiveness', desc: 'Speed of execution at the customer interface' },
            { label: 'Continuity', desc: 'Reliable, unbroken follow-through across workflows' },
            { label: 'Operational trust', desc: 'Consistent, auditable, predictable outcomes' },
            { label: 'Execution reliability', desc: 'Intent converted to action without friction' },
          ].map(({ label, desc }) => (
            <div key={label} className="space-y-1">
              <p className="font-urbanist text-nex-cyan font-bold text-sm">{label}</p>
              <p className="font-inter text-nex-grey text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...fade(0.18)} className="space-y-3">
        <p className="font-inter text-white text-base leading-relaxed font-semibold">
          The bottleneck is no longer simply AI capability.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          It is whether businesses can operate reliably at AI speed. That creates a potentially significant infrastructure opportunity around:
        </p>
        <div className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2">
          {[
            'operational orchestration',
            'workflow continuity',
            'Human Latency reduction',
            'and operational readiness infrastructure',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-nex-cyan mt-2 shrink-0" />
              <p className="font-inter text-nex-text text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...fade(0.2)} className="px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/5 border-l-4 border-nex-cyan rounded-r-xl space-y-3">
        <p className="font-urbanist text-nex-cyan font-bold text-sm uppercase tracking-widest">
          This is where NexFrontier sits
        </p>
        <p className="font-inter text-nex-text text-sm leading-relaxed">
          Rather than requiring enterprises to rebuild their entire architecture first, NexFrontier strengthens the operational layer above existing systems: improving responsiveness, reducing operational friction, strengthening continuity, and recovering Quiet Loss between customer intent and business action.
        </p>
      </motion.div>

      <motion.div {...fade(0.24)} className="space-y-4 pt-2">
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Because in the AI era, operational readiness may become commercially more important than perfect data readiness.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Businesses are unlikely to fail because their databases were imperfect.
        </p>
        <p className="font-urbanist text-white font-bold text-xl md:text-2xl leading-snug">
          They are far more likely to lose ground because their operations could not respond, execute, and adapt fast enough.
        </p>
      </motion.div>

      <motion.div {...fade(0.28)} className="pt-4 pb-2 border-t border-nex-cyan/10">
        <p className="font-inter text-nex-grey/60 text-xs uppercase tracking-widest mb-3">Also in this series</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="#/reading-the-shift" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
            <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Previous</p>
            <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">AI Adoption Is Splitting Into Two Different Market Economies</p>
          </a>
          <a href="#/agentic-ai-cx-frontline" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
            <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Next</p>
            <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">The Agentic AI CX Frontline</p>
          </a>
        </div>
      </motion.div>

      <motion.div {...fade(0.32)} className="flex flex-col sm:flex-row gap-4 pt-2">
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
  );
}

type Tab = 'market' | 'investor';

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'market', label: 'Market Perspective', icon: Users },
  { id: 'investor', label: 'Investor Signal', icon: TrendingUp },
];

export default function DataReadinessIndex() {
  useMeta({
    title: 'The Data Readiness Index - NexFrontier',
    description: "NexFrontier's analysis of the Data Readiness Index: why 79% of enterprises cannot access the data their AI needs, and how operational reliability closes the gap between AI investment and execution value.",
    ogUrl: '/#/data-readiness-index',
  });
  useJsonLd([
    {
      '@type': 'WebPage',
      '@id': 'https://nexfrontier.my/#/data-readiness-index',
      'url': 'https://nexfrontier.my/#/data-readiness-index',
      'name': 'The Data Readiness Index - NexFrontier',
      'description': "NexFrontier's analysis of the Cloudera Data Readiness Index: why 79% of enterprises cannot access the data their AI needs, and how operational reliability closes the gap between AI investment and execution value.",
      'isPartOf': { '@id': 'https://nexfrontier.my/#website' },
      'publisher': { '@id': 'https://nexfrontier.my/#organization' },
      'inLanguage': 'en',
    },
    {
      '@type': 'Report',
      'name': 'Cloudera Data Readiness Index 2026 - NexFrontier Response',
      'description': 'NexFrontier analysis and market positioning in response to the Cloudera Data Readiness Index, covering data accessibility, governance, and AI ROI failures across global enterprises.',
      'about': [
        { '@type': 'Thing', 'name': 'Data Readiness' },
        { '@type': 'Thing', 'name': 'AI Operational Reliability' },
        { '@type': 'Thing', 'name': 'Enterprise AI ROI' },
      ],
      'publisher': { '@id': 'https://nexfrontier.my/#organization' },
      'inLanguage': 'en',
    },
  ]);
  const [activeTab, setActiveTab] = useState<Tab>('market');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
        <motion.div {...fade(0.05)} className="max-w-3xl mb-10">
          <div className="mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-xs font-bold uppercase tracking-widest">
              Cloudera Data Readiness Index
            </span>
          </div>
          <h1 className="font-urbanist text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
            Businesses Are Spending Years Preparing Data<br />
            <span className="text-nex-cyan">While Markets Move Ahead Without Them</span>
          </h1>
          <p className="font-inter text-nex-grey text-lg leading-relaxed">
            Cloudera's Data Readiness Index confirms something many enterprises are already feeling: the infrastructure beneath their AI ambitions was never designed for machine-speed environments.
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
                aria-controls={`tabpanel-dri-${id}`}
                id={`tab-dri-${id}`}
                tabIndex={activeTab === id ? 0 : -1}
                onClick={() => setActiveTab(id)}
                onKeyDown={(e) => handleTabKeyDown(e, i)}
                className={`relative flex items-center gap-2.5 px-1 pb-4 mr-10 text-sm font-inter font-medium transition-colors duration-200 ${
                  activeTab === id ? 'text-white' : 'text-nex-grey/60 hover:text-nex-grey'
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
                    layoutId="tab-underline-dri"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-nex-cyan rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 xl:gap-16 items-start">

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              id={`tabpanel-dri-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-dri-${activeTab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'market' ? <MarketTab /> : <InvestorTab />}
            </motion.div>
          </AnimatePresence>

          <Sidebar />
        </div>
      </div>
    </div>
  );
}
