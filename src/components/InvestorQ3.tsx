import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useMeta } from '../lib/useMeta';

export default function InvestorQ3() {
  useMeta({
    title: 'What Is Being Validated Through the Foundation Customer Programme? | NexFrontier',
    description: 'The Foundation Customer programme validates whether NexFrontier can turn a strategic thesis into customer-recognised, commercially meaningful proof.',
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
            Investor Brief - Execution
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-10"
          >
            3. What is being validated through the Foundation Customer programme?
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
              The Foundation Customer programme validates whether NexFrontier can turn a strategic thesis into customer-recognised, commercially meaningful proof.
            </p>

            <p>Specifically, it tests whether FOCL can:</p>

            <ul className="space-y-3 pl-5 border-l border-nex-cyan/20">
              {[
                'capture real or near-real customer signals;',
                'identify missed intent, delay, friction and Quiet Loss;',
                'support findings with traceable evidence;',
                'produce customer-trusted reports;',
                'show a credible value opportunity;',
                'create enough confidence for paid Beta discussions.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-nex-cyan flex-shrink-0 mt-1 text-xs">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-white font-medium">
              The programme is not designed to collect logos.
            </p>

            <p>
              It is designed to prove whether customers recognise the loss, trust the evidence, value the insight, and are willing to pay for continued readiness support.
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
