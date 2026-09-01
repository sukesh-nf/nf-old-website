import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useMeta } from '../lib/useMeta';

export default function InvestorQ4() {
  useMeta({
    title: 'What Becomes Proprietary and More Valuable With Each Deployment? | NexFrontier',
    description: 'Each deployment strengthens NexFrontier\'s readiness intelligence layer, compounding into proprietary assets across taxonomy, benchmarks, methodology and operating models.',
  });

  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-nex-cyan/4 blur-[120px] rounded-full" />
      </div>

      <div className="container-wide relative py-16 md:py-24">
        <motion.a
          href="#/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 font-inter text-nex-grey/70 text-sm hover:text-nex-cyan transition-colors duration-200 mb-14 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back
        </motion.a>

        <div className="max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-4"
          >
            Investor Brief - Investment
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-10"
          >
            4. What becomes proprietary and more valuable with each deployment?
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="origin-left h-px bg-gradient-to-r from-nex-cyan/50 via-nex-cyan/15 to-transparent mb-10"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="space-y-6 font-inter text-nex-grey leading-relaxed text-base md:text-[17px]"
          >
            <p>
              Each deployment strengthens NexFrontier's readiness intelligence layer.
            </p>

            <p>
              With every Foundation Customer, The Brain learns more about where customer intent appears, how businesses respond, where delays occur, what signals predict leakage, which gaps repeat, what value is at risk, and which interventions improve outcomes.
            </p>

            <p>Over time, this compounds into proprietary assets:</p>

            <ul className="space-y-3 pl-5 border-l border-nex-cyan/20">
              {[
                'Quiet Loss taxonomy;',
                'readiness scoring methodology;',
                'sector and channel leakage benchmarks;',
                'evidence-linked operating datasets;',
                'Human-vs-Brain comparison logic;',
                'Verified Yield methodology;',
                'Govern & Assure operating model;',
                'repeatable playbooks for operational readiness.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-nex-cyan flex-shrink-0 mt-1 text-xs">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-white font-medium">
              The long-term asset is not a set of reports.
            </p>

            <p>
              It is a governed intelligence layer trained by real-world operational leakage, response behaviour, recovery patterns and customer trust signals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-16 pt-8 border-t border-white/6"
          >
            <p className="font-inter text-nex-grey/40 text-xs">NexFrontier Investor Brief - Confidential</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
