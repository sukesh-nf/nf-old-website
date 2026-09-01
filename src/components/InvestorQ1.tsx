import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useMeta } from '../lib/useMeta';

export default function InvestorQ1() {
  useMeta({
    title: 'Why Does This Category Need to Exist Now? | NexFrontier',
    description: 'The market is becoming AI-mediated before most businesses are operationally ready. NexFrontier explains why a new layer of operational readiness is now essential.',
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
            Investor Brief - Opportunity
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-10"
          >
            1. Why does this category need to exist now?
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
              Because markets are becoming AI-mediated before most businesses are operationally ready for them.
            </p>

            <p>
              Customers are no longer only discovering businesses through search, ads, referrals or direct enquiry. Increasingly, decisions are shaped by AI agents, platforms, automated pathways and compressed response expectations.
            </p>

            <p>
              In that environment, the commercial risk is no longer only being invisible.
            </p>

            <p className="text-white font-medium">
              It is being visible, but not trusted enough to be carried forward.
            </p>

            <p>
              NexFrontier exists because businesses now need a new layer of operational readiness: one that proves whether customer intent is captured, understood, acted on and converted before value quietly leaks.
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
