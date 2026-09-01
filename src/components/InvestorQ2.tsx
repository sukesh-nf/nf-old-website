import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useMeta } from '../lib/useMeta';

export default function InvestorQ2() {
  useMeta({
    title: 'Why Can Existing Platforms Not Solve It? | NexFrontier',
    description: 'CRMs, monitoring tools, RevOps and automation platforms manage activity and records. They were not built to prove operational trustworthiness across the customer journey.',
  });

  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-nex-cyan/4 blur-[120px] rounded-full" />
      </div>

      <div className="container-wide relative py-16 md:py-24">
        {/* Back link */}
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
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-widest mb-4"
          >
            Investor Brief - Competitive Advantage
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-10"
          >
            2. Why can existing monitoring, CRM, RevOps and automation platforms not solve it?
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="origin-left h-px bg-gradient-to-r from-nex-cyan/50 via-nex-cyan/15 to-transparent mb-10"
          />

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="space-y-6 font-inter text-nex-grey leading-relaxed text-base md:text-[17px]"
          >
            <p>
              Because they were built to manage activity, workflows, records or automation, not to prove operational trustworthiness across the customer journey.
            </p>

            <div className="space-y-3 pl-5 border-l border-nex-cyan/20">
              <p>CRMs show what was entered.</p>
              <p>Monitoring tools show what happened.</p>
              <p>RevOps tools optimise known funnels.</p>
              <p>Automation platforms execute predefined tasks.</p>
            </div>

            <p>
              But Quiet Loss often happens between systems, teams, channels and moments of hesitation.
            </p>

            <p className="text-white font-medium">
              NexFrontier is different because it connects signal, evidence, interpretation, human review, response quality, value leakage and governance into one readiness layer.
            </p>

            <p>It does not replace the stack.</p>

            <p>
              It shows whether the stack is actually ready to protect and convert customer intent.
            </p>
          </motion.div>

          {/* Bottom rule */}
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
