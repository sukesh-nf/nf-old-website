import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Users, TrendingUp } from 'lucide-react';
import { useMeta } from '../lib/useMeta';
import { useJsonLd } from '../lib/useJsonLd';

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  };
}

function BulletList({ items, accent = false }: { items: string[]; accent?: boolean }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className={`mt-[7px] block w-1 h-1 rounded-full shrink-0 ${accent ? 'bg-nex-cyan' : 'bg-nex-grey/40'}`} />
          <span className={`font-inter text-sm leading-relaxed ${accent ? 'text-nex-cyan font-medium' : 'text-nex-grey'}`}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function MarketPerspective() {
  return (
    <div className="space-y-8 max-w-2xl">

      <motion.div {...fade(0.1)} className="space-y-4">
        <h2 className="font-urbanist text-white font-bold text-xl md:text-2xl leading-snug">
          AI Adoption Is Splitting Into Two Different Market Economies
        </h2>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          EY's Global AI Sentiment Survey 2026 reveals something much bigger than rising AI adoption.
        </p>
        <p className="font-inter text-nex-text text-base leading-relaxed">
          It shows the global market beginning to split into two very different competitive environments.
        </p>
        <div className="space-y-2 pl-1">
          <p className="font-inter text-nex-grey text-sm leading-relaxed">One rewards speed and operational acceleration.</p>
          <p className="font-inter text-nex-grey text-sm leading-relaxed">The other rewards trust and operational reliability.</p>
        </div>
        <p className="font-inter text-nex-text text-base leading-relaxed font-semibold">
          That distinction matters enormously for businesses trying to navigate the AI era.
        </p>
      </motion.div>

      <motion.div {...fade(0.12)} className="border-t border-nex-cyan/10" />

      <motion.div {...fade(0.14)} className="space-y-4">
        <SectionLabel>AI Adoption Is No Longer Theoretical</SectionLabel>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Globally, consumers are increasingly allowing AI to:
        </p>
        <BulletList items={[
          'compare providers',
          'guide purchases',
          'manage financial decisions',
          'automate routine tasks',
          'and influence operational choices',
        ]} />
        <p className="font-inter text-nex-text text-base leading-relaxed font-semibold">
          Delegation is no longer theoretical.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          But the most important insight in the EY study is not simply that AI adoption is accelerating. It is that adoption is unfolding differently across different types of economies.
        </p>
      </motion.div>

      <motion.div {...fade(0.15)} className="flex flex-col sm:flex-row items-stretch gap-0 rounded-xl overflow-hidden border border-nex-cyan/10 shadow-lg">
        <div className="sm:w-48 shrink-0">
          <img
            src="/EY_26.jpeg"
            alt="EY 2026: AI adoption vs sentiment by country"
            className="w-full h-full object-cover block"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between bg-nex-navy/50 px-6 py-5 gap-3">
          <div>
            <p className="font-urbanist text-nex-cyan font-bold text-xs uppercase tracking-widest mb-2">EY Global AI Sentiment Study 2026</p>
            <p className="font-urbanist text-white font-bold text-sm leading-snug mb-2">Who's winning the AI adoption race?</p>
            <p className="font-inter text-nex-grey text-sm leading-relaxed">
              High-adoption, high-sentiment markets (India, UAE, Brazil) contrast sharply with cautious, governance-sensitive economies (Australia, NZ). Two distinct competitive environments are forming.
            </p>
          </div>
          <p className="font-inter text-nex-grey/40 text-xs">Flag size represents proportion of agentic users</p>
        </div>
      </motion.div>

      <motion.div {...fade(0.16)} className="border-t border-nex-cyan/10" />

      {/* Fast-Adoption Markets */}
      <motion.div {...fade(0.18)} className="space-y-5">
        <SectionLabel>Fast-Adoption Markets Reward Responsiveness</SectionLabel>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Markets such as India, United Arab Emirates, Brazil, and increasingly Malaysia are showing rapid behavioural acceptance of AI-mediated convenience and decision-making.
        </p>
        <div className="space-y-2">
          <p className="font-inter text-nex-grey/70 text-sm">These markets often share:</p>
          <BulletList items={[
            'mobile-first consumer behaviour',
            'rapidly digitising populations',
            'higher operational friction',
            'and strong demand for speed and convenience',
          ]} />
        </div>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          In these environments, responsiveness increasingly becomes competitive infrastructure.
        </p>
        <p className="font-inter text-nex-text text-base leading-relaxed">
          The risk for businesses is no longer simply visibility. The risk is operational delay.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          As AI compresses comparison, recommendation, and decision cycles, Human Latency becomes commercially visible much faster.
        </p>
        <div className="space-y-1 pl-1">
          {['Slow response.', 'Broken follow-up.', 'Fragmented workflows.', 'Operational drag.'].map((item) => (
            <p key={item} className="font-inter text-nex-grey/80 text-sm leading-relaxed">{item}</p>
          ))}
        </div>
        <p className="font-inter text-white text-sm font-semibold leading-relaxed">
          These are no longer internal inefficiencies. They increasingly become market disadvantages.
        </p>
      </motion.div>

      <motion.div {...fade(0.2)} className="px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/5 border-l-4 border-nex-cyan rounded-r-xl space-y-3">
        <p className="font-urbanist text-nex-cyan font-bold text-sm uppercase tracking-widest">
          This is where NexFrontier's positioning becomes highly relevant
        </p>
        <p className="font-inter text-nex-text text-sm leading-relaxed">
          We help businesses reduce Human Latency and recover Quiet Loss: revenue and opportunity silently lost through operational friction between customer intent and business action.
        </p>
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          In fast-adoption markets, the businesses that win will not necessarily be the ones with the most AI tools. They will be the ones that operationalise faster than competitors.
        </p>
      </motion.div>

      <motion.div {...fade(0.22)} className="border-t border-nex-cyan/10" />

      {/* Governance Markets */}
      <motion.div {...fade(0.24)} className="space-y-5">
        <SectionLabel>Governance Markets Reward Operational Trust</SectionLabel>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          By contrast, markets such as Australia, New Zealand, and increasingly Singapore are adopting AI more cautiously.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          EY found that only around 37% of Australians and 28% of New Zealanders believe AI's benefits outweigh its risks.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          This is not because these economies are technologically behind. It is because they are <span className="text-white font-semibold">trust-sensitive markets.</span>
        </p>
        <div className="space-y-2">
          <p className="font-inter text-nex-grey/70 text-sm">Customers and enterprises increasingly ask:</p>
          <BulletList items={[
            'Can this system be trusted?',
            'Who remains accountable?',
            'Can decisions be audited?',
            'What happens when systems fail?',
            'Is escalation available when it matters?',
          ]} />
        </div>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          This creates a completely different competitive environment. Businesses are increasingly judged not only on digital capability, but on:
        </p>
        <BulletList items={[
          'reliability',
          'operational continuity',
          'accountability',
          'governance',
          'and execution consistency',
        ]} accent />
      </motion.div>

      <motion.div {...fade(0.26)} className="px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/5 border-l-4 border-nex-cyan rounded-r-xl space-y-3">
        <p className="font-urbanist text-nex-cyan font-bold text-sm uppercase tracking-widest">
          NexFrontier's role in governance markets
        </p>
        <p className="font-inter text-nex-text text-sm leading-relaxed">
          Here, our positioning shifts from acceleration to operational trust infrastructure. We help organisations strengthen the operational layer beneath customer demand: reducing fragmentation, improving continuity, strengthening responsiveness, and helping businesses become reliable enough for AI-mediated markets.
        </p>
        <div className="pt-1 space-y-1">
          <p className="font-inter text-nex-grey/70 text-xs">Because increasingly, the next competitive divide is not simply:</p>
          <p className="font-inter text-white text-sm font-semibold">who uses AI.</p>
          <p className="font-inter text-nex-grey/70 text-xs mt-2">It is:</p>
          <p className="font-inter text-nex-cyan text-sm font-semibold">who can be trusted to operate through it.</p>
        </div>
      </motion.div>

      <motion.div {...fade(0.28)} className="border-t border-nex-cyan/10" />

      {/* Why This Matters */}
      <motion.div {...fade(0.3)} className="space-y-5">
        <SectionLabel>Why This Matters Strategically</SectionLabel>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          The EY findings suggest the AI era is not creating one global market transition. It is creating two.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="px-5 py-4 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl space-y-3">
            <p className="font-urbanist text-nex-grey/70 font-bold text-xs uppercase tracking-widest">Fast-adoption markets reward</p>
            <BulletList items={['speed', 'responsiveness', 'convenience', 'and operational acceleration']} />
          </div>
          <div className="px-5 py-4 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl space-y-3">
            <p className="font-urbanist text-nex-cyan/80 font-bold text-xs uppercase tracking-widest">Governance-sensitive markets reward</p>
            <BulletList items={['continuity', 'trust', 'reliability', 'accountability', 'and operational resilience']} accent />
          </div>
        </div>
        <p className="font-inter text-nex-text text-base leading-relaxed font-semibold">
          This is strategically important for NexFrontier.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Because both environments ultimately point toward the same underlying shift:
        </p>
        <p className="font-urbanist text-white font-bold text-lg leading-snug">
          Operational readiness is becoming commercially visible. Not eventually. Now.
        </p>
      </motion.div>

      <motion.div {...fade(0.32)} className="px-6 py-5 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl space-y-4">
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          The businesses most likely to succeed in AI-mediated markets will not simply be the ones with the most AI tools, the biggest transformation budgets, or the cleanest dashboards.
        </p>
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          They will increasingly be the organisations that can:
        </p>
        <BulletList items={[
          'reduce friction',
          'respond reliably',
          'maintain continuity',
          'and turn intent into outcomes at machine speed',
        ]} accent />
      </motion.div>

      <motion.div {...fade(0.34)} className="pt-4 border-t border-nex-cyan/10">
        <p className="font-urbanist text-white font-bold text-2xl md:text-3xl leading-snug">
          That is the frontier<br /><span className="text-nex-cyan">NexFrontier is built for.</span>
        </p>
      </motion.div>

      <motion.div {...fade(0.36)} className="pt-4 pb-2 border-t border-nex-cyan/10">
        <p className="font-inter text-nex-grey/60 text-xs uppercase tracking-widest mb-3">Also in this series</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="#/data-readiness-index" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
            <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Next</p>
            <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">Data Readiness Will Not Save Slow Operations</p>
          </a>
          <a href="#/agentic-ai-cx-frontline" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
            <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Also</p>
            <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">The Agentic AI CX Frontline</p>
          </a>
        </div>
      </motion.div>

      <motion.div {...fade(0.4)} className="flex flex-col sm:flex-row gap-4 pt-2">
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

function InvestorSignal() {
  return (
    <div className="space-y-8 max-w-2xl">

      {/* Header */}
      <motion.div {...fade(0.05)} className="space-y-4">
        <SectionLabel>Investor Signal</SectionLabel>
        <h2 className="font-urbanist text-white font-bold text-xl md:text-2xl leading-snug">
          The AI Investment Shift Is Moving Beyond Models and Into Operational Infrastructure
        </h2>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Much of the AI market is still focused on intelligence: larger models, faster agents, more automation, and new productivity tools.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          But EY's Global AI Sentiment Study points to a deeper shift emerging underneath the hype.
        </p>
        <p className="font-inter text-white text-base leading-relaxed font-semibold">
          The next competitive divide may not be determined by who has the smartest AI. It may be determined by which businesses are operationally capable of keeping up with AI-mediated markets.
        </p>
        <p className="font-inter text-nex-cyan text-base leading-relaxed font-semibold">
          That distinction matters enormously for investors.
        </p>
      </motion.div>

      <motion.div {...fade(0.08)} className="border-t border-nex-cyan/10" />

      {/* AI Adoption */}
      <motion.div {...fade(0.1)} className="space-y-5">
        <div>
          <SectionLabel>AI Adoption Is Becoming Behavioural Infrastructure</SectionLabel>
        </div>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          The EY study shows consumers are already allowing AI to:
        </p>
        <BulletList items={[
          'guide purchases',
          'influence financial decisions',
          'compare providers',
          'and automate everyday tasks',
        ]} />
        <p className="font-inter text-nex-text text-base leading-relaxed font-semibold">
          Delegation is no longer theoretical.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          At the same time, users continue expressing concerns around:
        </p>
        <BulletList items={['security', 'hallucinations', 'accountability', 'and loss of control']} />
      </motion.div>

      <motion.div {...fade(0.12)} className="border-l-2 border-nex-cyan/40 pl-6 py-1 space-y-2">
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          This creates what NexFrontier believes is one of the defining economic tensions of the AI era:
        </p>
        <p className="font-inter text-white text-base leading-relaxed font-semibold">
          People increasingly distrust AI conceptually, while simultaneously delegating to it behaviourally.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          That contradiction changes what creates enterprise value. The market is beginning to shift away from pure AI capability toward <span className="text-nex-cyan font-semibold">operational trustworthiness.</span>
        </p>
      </motion.div>

      <motion.div {...fade(0.14)} className="border-t border-nex-cyan/10" />

      {/* Bottleneck */}
      <motion.div {...fade(0.16)} className="space-y-5">
        <div>
          <SectionLabel>The Next Bottleneck Is Not Intelligence. It Is Execution.</SectionLabel>
        </div>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Most enterprises already possess:
        </p>
        <BulletList items={[
          'software',
          'data',
          'dashboards',
          'CRMs',
          'automation layers',
          'and AI experimentation initiatives',
        ]} />
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Yet operational friction remains everywhere:
        </p>
        <BulletList items={[
          'slow response',
          'fragmented workflows',
          'broken follow-up',
          'coordination fatigue',
          'inconsistent escalation',
          'and delayed execution',
        ]} />
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Historically, these issues were tolerated as operational inefficiencies. In AI-mediated markets, they increasingly become commercially visible liabilities.
        </p>
      </motion.div>

      <motion.div {...fade(0.18)} className="px-6 py-5 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl space-y-4">
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          As AI compresses search, comparison, recommendation, and decision cycles, Human Latency becomes economically exposed much faster.
        </p>
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          Businesses are no longer competing only to be seen. They are increasingly competing to be:
        </p>
        <BulletList items={[
          'trusted',
          'recommended',
          'operationally reliable',
          'and eventually acted upon by AI-mediated systems',
        ]} accent />
        <p className="font-inter text-white text-sm font-semibold leading-relaxed">
          That changes where enterprise value accumulates.
        </p>
      </motion.div>

      <motion.div {...fade(0.2)} className="border-t border-nex-cyan/10" />

      {/* Why NexFrontier */}
      <motion.div {...fade(0.22)} className="space-y-5">
        <div>
          <SectionLabel>Why NexFrontier Matters</SectionLabel>
        </div>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          NexFrontier is not positioning as another AI application layer. We are building operational infrastructure for AI-mediated markets.
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Our focus is not simply model intelligence or task automation. It is operational readiness:
        </p>
        <BulletList items={[
          'reducing Human Latency',
          'strengthening execution continuity',
          'recovering Quiet Loss',
          'and improving responsiveness between customer intent and business action',
        ]} accent />
      </motion.div>

      <motion.div {...fade(0.24)} className="px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/5 border-l-4 border-nex-cyan rounded-r-xl space-y-3">
        <p className="font-urbanist text-nex-cyan font-bold text-sm uppercase tracking-widest">
          A fundamentally different thesis
        </p>
        <p className="font-inter text-nex-text text-sm leading-relaxed font-semibold">
          In the AI era, operational readiness matters more than perfect data readiness.
        </p>
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          Businesses will not fail because their databases were imperfect. They will fail because their operations could not respond, execute, and adapt fast enough.
        </p>
        <p className="font-inter text-nex-grey text-sm leading-relaxed">
          Much of the enterprise market is still approaching AI through multi-year transformation programmes, data restructuring, governance projects, and additional software layers. Meanwhile, markets and customer expectations are already moving faster than those roadmaps.
        </p>
      </motion.div>

      <motion.div {...fade(0.26)} className="border-t border-nex-cyan/10" />

      {/* Geography */}
      <motion.div {...fade(0.28)} className="space-y-5">
        <div>
          <SectionLabel>Why Geography Matters</SectionLabel>
        </div>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          The EY study also reveals that AI adoption is fragmenting into different behavioural economies.
        </p>
        <div className="flex gap-4 items-stretch">
          <div className="shrink-0 w-44 rounded-xl overflow-hidden border border-nex-cyan/15 shadow-lg">
            <img
              src="/EY_26.jpeg"
              alt="EY 2026: Who's winning the AI adoption race?"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="flex-1 p-5 bg-nex-navy/40 border border-nex-cyan/10 rounded-xl space-y-4">
            <p className="font-urbanist text-nex-grey/80 font-bold text-sm uppercase tracking-widest">
              Market Split
            </p>
            {[
              { label: 'Fast-Adoption', sub: 'India, UAE, Brazil, Malaysia: speed and operationalisation wins' },
              { label: 'Governance-Sensitive', sub: 'Australia, New Zealand: trust and reliability wins' },
            ].map(({ label, sub }) => (
              <div key={label} className="border-t border-nex-cyan/10 pt-3 first:border-0 first:pt-0">
                <p className="font-urbanist text-nex-cyan font-bold text-sm mb-0.5">{label}</p>
                <p className="font-inter text-nex-grey text-xs leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="px-5 py-4 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl space-y-2">
            <p className="font-urbanist text-nex-cyan font-bold text-sm">Operational Pressure Markets</p>
            <p className="font-inter text-nex-grey/70 text-xs mb-2">India, UAE, Brazil, Malaysia</p>
            <p className="font-inter text-nex-grey text-sm leading-relaxed">Businesses win by operationalising faster than competitors.</p>
            <p className="font-inter text-nex-cyan/80 text-xs font-semibold uppercase tracking-wider mt-2">Malaysia: launch corridor into Southeast Asia</p>
          </div>
          <div className="px-5 py-4 bg-nex-navy/50 border border-nex-cyan/15 rounded-xl space-y-2">
            <p className="font-urbanist text-nex-cyan font-bold text-sm">Operational Trust Markets</p>
            <p className="font-inter text-nex-grey/70 text-xs mb-2">Australia, New Zealand</p>
            <p className="font-inter text-nex-grey text-sm leading-relaxed">Businesses win by becoming reliable enough to operate safely through AI-mediated systems.</p>
            <p className="font-inter text-nex-cyan/80 text-xs font-semibold uppercase tracking-wider mt-2">New Zealand: proving ground for trust-centric infrastructure</p>
          </div>
        </div>
        <p className="font-inter text-nex-grey text-sm leading-relaxed italic">
          Together, they create two highly complementary validation environments for NexFrontier's operating model.
        </p>
      </motion.div>

      <motion.div {...fade(0.3)} className="border-t border-nex-cyan/10" />

      {/* Investment Thesis */}
      <motion.div {...fade(0.32)} className="space-y-5">
        <div>
          <SectionLabel>The Emerging Investment Thesis</SectionLabel>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="font-inter text-nex-grey/80 text-xs uppercase tracking-widest font-semibold">First phase rewarded</p>
            <BulletList items={['model builders', 'copilots', 'and experimentation']} />
          </div>
          <div className="space-y-2">
            <p className="font-inter text-nex-cyan/80 text-xs uppercase tracking-widest font-semibold">Next phase may reward</p>
            <BulletList items={[
              'orchestration',
              'operational continuity',
              'governance-aware execution',
              'and infrastructure that reduces the gap between intent and outcome',
            ]} accent />
          </div>
        </div>
      </motion.div>

      {/* Closing */}
      <motion.div {...fade(0.34)} className="pt-6 border-t border-nex-cyan/10 space-y-4">
        <p className="font-urbanist text-white font-bold text-2xl md:text-3xl leading-snug">
          That is the frontier<br /><span className="text-nex-cyan">NexFrontier is built for.</span>
        </p>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Not simply helping businesses use AI.
        </p>
        <p className="font-inter text-nex-text text-base leading-relaxed font-semibold">
          Helping businesses become operationally capable of surviving the markets AI is creating.
        </p>
      </motion.div>

      <motion.div {...fade(0.36)} className="pt-4 pb-2 border-t border-nex-cyan/10">
        <p className="font-inter text-nex-grey/60 text-xs uppercase tracking-widest mb-3">Also in this series</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="#/data-readiness-index" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
            <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Next</p>
            <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">Data Readiness Will Not Save Slow Operations</p>
          </a>
          <a href="#/agentic-ai-cx-frontline" className="flex-1 px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group">
            <p className="font-inter text-nex-grey/60 text-[10px] uppercase tracking-widest mb-1">Also</p>
            <p className="font-inter text-nex-text text-sm font-medium group-hover:text-nex-cyan transition-colors duration-300">The Agentic AI CX Frontline</p>
          </a>
        </div>
      </motion.div>

      <motion.div {...fade(0.4)} className="flex flex-col sm:flex-row gap-4 pt-2">
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

export default function ReadingTheShift() {
  useMeta({
    title: 'Reading the Shift in 2026 - NexFrontier',
    description: 'EY Global AI Sentiment, The Data Readiness Index, and The Agentic AI CX Frontline: three landmark reports that reveal why operational reliability is now the defining enterprise AI challenge.',
    ogUrl: '/#/reading-the-shift',
  });
  useJsonLd([
    {
      '@type': 'WebPage',
      '@id': 'https://nexfrontier.my/#/reading-the-shift',
      'url': 'https://nexfrontier.my/#/reading-the-shift',
      'name': 'Reading the Shift in 2026 - NexFrontier',
      'description': 'EY Global AI Sentiment, The Data Readiness Index, and The Agentic AI CX Frontline: three landmark reports that reveal why operational reliability is now the defining enterprise AI challenge.',
      'isPartOf': { '@id': 'https://nexfrontier.my/#website' },
      'publisher': { '@id': 'https://nexfrontier.my/#organization' },
      'inLanguage': 'en',
    },
    {
      '@type': 'ItemList',
      'name': 'Reading the Shift in 2026: Key Reports',
      'description': 'Three landmark third-party research reports that validate the NexFrontier thesis on operational reliability in the AI-mediated economy.',
      'numberOfItems': 3,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': "EY Global AI Sentiment Study 2026",
          'description': "EY's global benchmark on enterprise AI adoption, trust gaps, and the divide between AI ambition and operational execution.",
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Cloudera Data Readiness Index 2026',
          'description': 'Research revealing that 79% of enterprises cannot access all the data their AI needs, exposing systemic operational readiness gaps.',
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': "NiCE Agentic AI CX Frontline Report",
          'description': 'Analysis of how agentic AI is reshaping customer experience frontlines and why operational reliability is the defining enterprise differentiator.',
        },
      ],
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
          className="inline-flex items-center gap-2 text-nex-grey hover:text-nex-cyan text-sm font-inter font-medium transition-colors duration-300 mb-14"
        >
          <ArrowLeft size={14} />
          Back
        </motion.a>

        {/* Page header */}
        <motion.div {...fade(0.05)} className="max-w-3xl mb-10">
          <div className="mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-xs font-bold uppercase tracking-widest">
              NexFrontier's Response to EY's 2026 Global AI Sentiment Study
            </span>
          </div>
          <h1 className="font-urbanist text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
            AI Adoption Is Splitting Into<br />
            <span className="text-nex-cyan">Two Different Market Economies</span>
          </h1>
          <p className="font-inter text-nex-grey text-lg leading-relaxed">
            EY's Global AI Sentiment Survey 2026 reveals something much bigger than rising AI adoption: the global market is beginning to split into two very different competitive environments.
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
                aria-controls={`tabpanel-rts-${id}`}
                id={`tab-rts-${id}`}
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
                    layoutId="tab-underline-rts"
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
              id={`tabpanel-rts-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-rts-${activeTab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'market' ? <MarketPerspective /> : <InvestorSignal />}
            </motion.div>
          </AnimatePresence>

          {/* Sidebar */}
          <motion.aside {...fade(0.15)} className="lg:sticky lg:top-8 space-y-5">

            <a
              href="https://www.ey.com/content/dam/ey-unified-site/ey-com/en-gl/insights/ai/documents/ey-gl-ai-sentiment-study-wave-04-2026.pdf#toolbar=0&navpanes=0"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col p-6 bg-gradient-to-br from-nex-navy/60 to-nex-darker/60 border border-nex-cyan/10 rounded-lg hover:border-nex-cyan/30 transition-all duration-300"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-xs font-bold uppercase tracking-widest mb-4">
                Research
              </span>
              <h2 className="font-urbanist text-white font-bold text-lg leading-snug mb-3 group-hover:text-nex-cyan transition-colors duration-300">
                EY Global AI Sentiment Study 2026
              </h2>
              <p className="font-inter text-nex-grey text-sm leading-relaxed flex-1 mb-3">
                EY's annual survey on how businesses and consumers are responding to AI adoption, trust, and transformation across markets.
              </p>
              <p className="font-inter text-nex-grey/40 text-xs mb-5">EY · 2026</p>
              <span className="inline-flex items-center gap-2 font-inter text-nex-cyan text-sm font-medium">
                Read report <ExternalLink size={13} />
              </span>
            </a>

            <div className="p-5 bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border border-nex-cyan/20 rounded-lg">
              <p className="font-urbanist text-nex-cyan font-bold text-sm uppercase tracking-widest mb-3">
                Quiet Loss
              </p>
              <p className="font-inter text-nex-text text-sm leading-relaxed italic">
                "When customer intent exists, but the business fails to hold it."
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

        </div>
      </div>
    </div>
  );
}
