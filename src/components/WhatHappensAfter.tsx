import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
  viewport: { once: true },
});

const steps = [
  {
    label: 'Step 01',
    title: 'Initial Qualification Review',
    desc: 'We assess operational fit and deployment readiness.',
  },
  {
    label: 'Step 02',
    title: 'Quiet Loss Discovery Session',
    desc: 'We review customer response flow and operational friction points.',
  },
  {
    label: 'Step 03',
    title: 'Govern & Assure Scope Review',
    desc: 'We agree data access, review boundaries, operational permissions.',
  },
  {
    label: 'Step 04',
    title: 'BETA Onboarding',
    desc: 'Selected businesses enter complimentary live deployment and validation.',
  },
];

export default function WhatHappensAfter() {
  return (
    <section className="section-divider">
      <div className="container-wide">
        <motion.h2 {...fadeUp()} className="font-urbanist text-4xl md:text-5xl font-bold mb-14">
          <span className="text-white">What Happens After You Apply</span>
        </motion.h2>

        {/* Steps — horizontal timeline on desktop, vertical on mobile */}
        <div className="relative mb-12 md:mb-16">

          {/* ── Desktop layout ── */}
          <div className="hidden md:block">
            {/* Track */}
            <div className="relative flex items-start">
              {/* Continuous connector line sitting behind the nodes */}
              <div className="absolute top-7 left-0 right-0 h-px">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-nex-cyan/40 to-transparent" />
              </div>

              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.07)}
                  className="relative flex-1 flex flex-col items-center text-center px-4"
                >
                  {/* Step number badge */}
                  <div className="relative z-10 mb-6 flex items-center justify-center w-14 h-14 rounded-full bg-nex-darker border border-nex-cyan/50 shadow-[0_0_24px_rgba(0,212,255,0.18)]">
                    <span className="font-urbanist text-nex-cyan font-bold text-base tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="w-full bg-nex-navy/40 border border-nex-cyan/15 rounded-xl px-5 py-5 hover:border-nex-cyan/35 hover:bg-nex-navy/60 transition-all duration-300">
                    <span className="font-inter text-nex-cyan/50 text-[10px] tracking-[0.2em] uppercase font-medium block mb-2">
                      {step.label}
                    </span>
                    <h3 className="font-urbanist text-white font-bold text-base leading-snug mb-2">
                      {step.title}
                    </h3>
                    <p className="font-inter text-nex-grey text-xs leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Sequence arrow between cards (except last) */}
                  {i < steps.length - 1 && (
                    <div className="absolute top-7 -right-1 z-20 flex items-center justify-center w-2 h-2 rounded-full bg-nex-cyan/60" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Mobile layout — vertical stepper ── */}
          <div className="md:hidden relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-[13px] top-0 bottom-0 w-px bg-gradient-to-b from-nex-cyan/60 via-nex-cyan/30 to-transparent" />

            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <motion.div key={i} {...fadeUp(i * 0.07)} className="relative">
                  {/* Node */}
                  <div className="absolute -left-8 top-0 z-10 flex items-center justify-center w-[26px] h-[26px] rounded-full bg-nex-darker border border-nex-cyan/60 shadow-[0_0_12px_rgba(0,212,255,0.2)]">
                    <span className="font-urbanist text-nex-cyan font-bold text-[10px] tabular-nums leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="bg-nex-navy/40 border border-nex-cyan/15 rounded-xl px-4 py-4">
                    <span className="font-inter text-nex-cyan/50 text-[10px] tracking-[0.18em] uppercase font-medium block mb-1">
                      {step.label}
                    </span>
                    <h3 className="font-urbanist text-white font-bold text-base leading-snug mb-1.5">
                      {step.title}
                    </h3>
                    <p className="font-inter text-nex-grey text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing statement */}
        <motion.div
          {...fadeUp(0.1)}
          className="relative overflow-hidden px-7 py-6 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/8 border border-nex-cyan/50 rounded-2xl shadow-glow-cyan text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12)_0%,transparent_70%)] pointer-events-none" />
          <p className="relative font-urbanist text-nex-text text-lg md:text-xl font-semibold leading-relaxed">
            The businesses that thrive in AI-mediated markets will not necessarily be the loudest.{' '}
            <span className="text-nex-cyan">They will be the most operationally reliable.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
