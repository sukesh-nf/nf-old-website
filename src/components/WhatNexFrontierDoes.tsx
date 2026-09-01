import { motion } from 'framer-motion';
import { Search, TrendingUp, Shield, Brain, Lock, Users } from 'lucide-react';

const cards = [
  {
    Icon: Search,
    title: 'Detect Quiet Loss',
    desc: 'AI-powered monitoring identifies revenue leakage in real-time. Silent failures become visible the moment they occur.',
  },
  {
    Icon: TrendingUp,
    title: 'Recover Revenue',
    desc: 'NexFrontier helps prioritise revenue recovery by showing where leakage is happening, what can be acted on, and which response paths need improvement.',
  },
  {
    Icon: Shield,
    title: 'Maintain Continuity',
    desc: 'Reduce response gaps, improving escalation paths and making operational weak points visible before they damage customer outcomes.',
  },
  {
    Icon: Brain,
    title: 'Build Intelligence',
    desc: 'Every pattern, correction and recovery signal strengthens the intelligence layer, creating better rules, readiness insights and operating benchmarks over time.',
  },
  {
    Icon: Lock,
    title: 'Govern & Assure',
    desc: 'Ensure operational intelligence remains traceable, permissioned, reviewed and controlled, so businesses can move faster without creating new risk.',
  },
];

export default function WhatNexFrontierDoes() {
  return (
    <section id="what-nexfrontier-does" className="section-divider">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold">
              What <span className="text-white">Nex</span><span className="text-nex-cyan">Frontier</span> Does
            </h2>
            <a
              href="#/team"
              className="inline-flex items-center gap-3 mt-1 px-9 py-3.5 bg-nex-cyan/20 border-2 border-nex-cyan rounded-full font-urbanist text-lg font-bold text-nex-cyan shadow-glow-cyan hover:bg-nex-cyan/35 hover:shadow-glow-cyan-lg transition-all duration-200 shrink-0"
            >
              <Users size={17} />
              Meet The Team
            </a>
          </div>
          <p className="font-inter text-nex-grey text-sm max-w-2xl mb-6 leading-relaxed">
            We help businesses recover hidden revenue by deploying intelligent infrastructure that operates with the precision and speed of AI systems, the oversight of human judgment, and the reliability of enterprise operations.
          </p>

          {/* Top row — 3 cards */}
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            {cards.slice(0, 3).map((item, i) => (
              <Card key={i} item={item} index={i} />
            ))}
          </div>

          {/* Bottom row — 2 cards centered */}
          <div className="grid sm:grid-cols-2 gap-3 sm:mx-auto sm:max-w-[66.7%]">
            {cards.slice(3).map((item, i) => (
              <Card key={i + 3} item={item} index={i + 3} />
            ))}
          </div>

          {/* Outcome Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative overflow-hidden mt-4 px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/8 border border-nex-cyan/50 rounded-2xl shadow-glow-cyan text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12)_0%,transparent_70%)] pointer-events-none" />
            <p className="relative font-urbanist text-nex-text text-base md:text-lg font-semibold leading-relaxed">
              The result: businesses can <span className="text-nex-cyan">recover an estimated 10-30% of lost revenue in the first year</span> while building operational resilience that becomes increasingly difficult for competitors to replicate.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Card({ item, index }: { item: typeof cards[number]; index: number }) {
  const { Icon, title, desc } = item;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group relative p-5 bg-gradient-to-br from-nex-navy/60 to-nex-darker/60 border border-nex-cyan/15 rounded-xl hover:border-nex-cyan/45 hover:shadow-glow-cyan transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,255,0.06)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-nex-cyan/10 border border-nex-cyan/20 flex items-center justify-center mb-3 group-hover:bg-nex-cyan/20 group-hover:border-nex-cyan/40 transition-all duration-300">
          <Icon size={15} className="text-nex-cyan" />
        </div>
        <h3 className="font-urbanist text-nex-cyan text-base font-bold mb-1.5">{title}</h3>
        <p className="font-inter text-nex-grey text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
