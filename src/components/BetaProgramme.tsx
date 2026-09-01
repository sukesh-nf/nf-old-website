import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, ArrowRight } from 'lucide-react';
import ApplicationFormContent from './ApplicationForm';

interface Props {
  qlEmailConsent?: boolean;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
  viewport: { once: true },
});

function SubsectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-6 h-px bg-nex-cyan/50" />
      <span className="font-inter text-nex-cyan/70 text-xs uppercase tracking-widest font-medium">{children}</span>
    </div>
  );
}

function CtaButton() {
  return (
    <motion.a
      href="#beta-access"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-nex-cyan text-nex-dark font-semibold rounded-full hover:shadow-glow-cyan-lg transition-all duration-300 text-sm"
    >
      Apply for BETA Access
      <ArrowRight size={15} />
    </motion.a>
  );
}

export default function BetaProgramme({ qlEmailConsent }: Props) {
  return (
    <section className="section-divider relative" id="beta-programme">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nex-cyan/4 to-transparent pointer-events-none" />
      <div className="container-wide relative">

        {/* ── 1. Help Build The Future Operating Standard ── */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 mb-20">
          <motion.div {...fadeUp()} className="flex-1 min-w-0">
            <div className="font-inter inline-flex items-center gap-2 mb-5 px-4 py-1.5 border border-nex-cyan/30 rounded-full text-nex-cyan/80 text-sm font-medium tracking-wide uppercase">
              Foundation Customer BETA Programme
            </div>
            <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Help Build The Future<br />
              <span className="text-nex-cyan">Operating Standard</span>
            </h2>
            <p className="font-inter text-nex-cyan font-semibold text-base mb-4">"The Brain" is currently in BETA.</p>
            <p className="font-inter text-nex-grey text-base leading-relaxed mb-4">
              We are inviting a small number of businesses to participate as real-world deployment partners and{' '}
              <span className="text-white font-bold">Foundation Customers</span>.
            </p>
            <p className="font-inter text-white font-semibold text-base mb-2">This is not a demo environment.</p>
            <p className="font-inter text-nex-grey text-base leading-relaxed mb-8">
              It is a live operational BETA where NexFrontier works directly with participating businesses to:
            </p>
            <CtaButton />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex-shrink-0 flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-full bg-nex-cyan/10 blur-2xl scale-110" />
              <div className="absolute inset-0 rounded-full ring-1 ring-nex-cyan/20 animate-pulse" />
              <img
                src="/Untitled_design_copy.png"
                alt="The Brain, NexFrontier AI"
                className="relative w-full h-full object-cover rounded-full drop-shadow-[0_0_40px_rgba(0,212,255,0.25)]"
              />
            </div>
          </motion.div>
        </div>

        {/* What we do together */}
        <motion.div {...fadeUp(0.05)} className="grid md:grid-cols-2 gap-6 md:gap-8 mb-20">
          <div className="bg-nex-navy/50 border border-nex-cyan/20 rounded-2xl p-5 sm:p-8">
            <h3 className="font-urbanist text-nex-cyan font-bold text-lg mb-6 uppercase tracking-wide">During BETA We Will</h3>
            <ul className="space-y-3">
              {[
                'Identify Quiet Loss',
                'Stabilise operational gaps',
                'Improve customer continuity',
                'Test infrastructure performance under real conditions',
                'Validate measurable business outcomes together',
                'Establish Govern & Assure controls around operational intelligence',
                'Define where AI assistance can recommend, support or act',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-inter text-nex-grey text-sm">
                  <ChevronRight size={16} className="text-nex-cyan flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-nex-cyan/10">
              <p className="font-inter text-nex-grey/80 text-sm leading-relaxed">
                <span className="text-white font-semibold">The purpose is simple:</span>{' '}
                <span className="text-nex-cyan">
                  To prove real operational and revenue value inside real businesses before broader market rollout.
                </span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border border-nex-cyan/30 rounded-2xl p-5 sm:p-6 flex flex-col gap-3">
            <h3 className="font-urbanist text-nex-cyan font-bold text-lg uppercase tracking-wide mb-1">Participation Terms</h3>
            {[
              'Complimentary, no fees payable during the BETA period.',
              'Designed to minimise disruption, interruption, or operational risk to your existing business activities.',
              'Participation is structured as a performance-based engagement.',
              'Any future scope, pricing, and terms will be presented clearly and in advance.',
              'Each business can make a fully informed decision before entering any paid phase.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle size={14} className="text-nex-cyan flex-shrink-0 mt-0.5" />
                <p className="font-inter text-nex-grey text-sm leading-snug">{item}</p>
              </div>
            ))}
            <div className="mt-auto pt-3 border-t border-nex-cyan/10">
              <p className="font-inter text-nex-grey text-sm leading-relaxed">
                We are inviting a limited number of businesses to participate as{' '}
                <span className="text-white font-bold">Foundation Customers</span>{' '}
                and help shape the next operating standard for AI-mediated business environments.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.08)} className="mb-12 px-8 py-6 bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border border-nex-cyan/30 rounded-2xl shadow-glow-cyan">
          <p className="font-inter text-nex-grey text-base leading-relaxed">
            <span className="text-nex-cyan font-semibold">Foundation Customers</span> gain an evidence-based view of where revenue, customer intent and operating momentum are being lost, before committing further money to automation, marketing or transformation.
          </p>
        </motion.div>

        <div className="border-t border-nex-cyan/10 mb-20" />

        {/* ── 2. BETA Eligibility Criteria ── */}
        <motion.div {...fadeUp(0.1)} className="mb-20">
          <SubsectionLabel>BETA Eligibility Criteria</SubsectionLabel>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h3 className="font-urbanist text-2xl md:text-3xl font-bold text-white mb-1">
                BETA <span className="text-nex-cyan">Eligibility Criteria</span>
              </h3>
              <p className="font-inter text-white font-bold text-sm">Foundation Customer participation is limited to businesses that qualify on all five criteria.</p>
            </div>
            <CtaButton />
          </div>

          <div className="space-y-[1px] rounded-2xl overflow-hidden border border-nex-cyan/15">
            {[
              { num: '01', text: 'Generate a minimum of $5M annual revenue' },
              { num: '02', text: 'Operate with active inbound customer or enquiry flow' },
              { num: '03', text: 'Rely on the Internet or digital channels as part of normal business operations' },
              { num: '04', text: 'Are experiencing operational pressure, growth friction, or customer response complexity' },
              { num: '05', text: 'Are open to collaborative operational testing and improvement during BETA' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.04)}
                className="group flex items-center gap-4 md:gap-6 px-4 md:px-6 py-1.5 bg-nex-navy/40 hover:bg-nex-cyan/5 transition-colors duration-200"
              >
                <span className="font-urbanist text-nex-cyan/40 text-xs font-bold tracking-widest flex-shrink-0 group-hover:text-nex-cyan/70 transition-colors duration-200">{item.num}</span>
                <p className="font-inter text-nex-grey text-sm leading-relaxed flex-1">{item.text}</p>
                <CheckCircle size={15} className="text-nex-cyan/40 flex-shrink-0 group-hover:text-nex-cyan transition-colors duration-200" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="border-t border-nex-cyan/10 mb-20" />

        {/* ── 3. Why Businesses Are Joining Early ── */}
        <motion.div {...fadeUp(0.15)} className="mb-20">
          <SubsectionLabel>Why Businesses Are Joining Early</SubsectionLabel>
          <h3 className="font-urbanist text-2xl md:text-3xl font-bold text-white mb-1">
            Why Businesses Are <span className="text-nex-cyan">Joining Early</span>
          </h3>
          <p className="font-inter text-white font-bold text-sm mb-8">Foundation participants receive:</p>

          <div className="grid sm:grid-cols-2 gap-1.5">
            {[
              { icon: '◆', text: 'Complimentary onboarding and deployment' },
              { icon: '◆', text: 'Direct collaboration with the NexFrontier team' },
              { icon: '◆', text: 'Early access to "The Brain"' },
              { icon: '◆', text: 'Operational readiness insights' },
              { icon: '◆', text: 'Quiet Loss diagnostics and reporting' },
              { icon: '◆', text: 'Priority roadmap influence during platform development' },
              { icon: '◆', text: 'Preferential positioning for future deployment phases' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.03)}
                className="group flex items-center gap-4 px-5 py-1.5 rounded-xl bg-gradient-to-r from-nex-cyan/8 to-transparent border border-nex-cyan/20 hover:border-nex-cyan/50 hover:from-nex-cyan/12 transition-all duration-300"
              >
                <span className="text-nex-cyan text-[8px] flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300">{item.icon}</span>
                <p className="font-inter text-nex-grey text-sm leading-snug">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="border-t border-nex-cyan/10 mb-20" />

        {/* ── 4 & 5. Beta Application — Conditional Participation Understanding + Let's Connect ── */}
        <motion.div {...fadeUp(0.2)}>
          <SubsectionLabel>BETA Application</SubsectionLabel>
          <ApplicationFormContent qlEmailConsent={qlEmailConsent} />
        </motion.div>

      </div>
    </section>
  );
}
