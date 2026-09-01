import { motion } from 'framer-motion';
import { Link2, Eye, ShieldCheck, MessageSquare, PlayCircle, RefreshCw } from 'lucide-react';

const controls = [
  {
    Icon: Link2,
    label: 'Traceability',
    desc: 'Every meaningful finding can be linked to source signals, logic or labelled assumptions.',
  },
  {
    Icon: Eye,
    label: 'Human review',
    desc: 'Material outputs remain reviewable where judgement, risk or customer trust matters.',
  },
  {
    Icon: ShieldCheck,
    label: 'Authority boundaries',
    desc: 'AI agents and workflows operate only within approved permissions.',
  },
  {
    Icon: MessageSquare,
    label: 'Claim discipline',
    desc: 'Customer-facing findings distinguish evidence, assumptions and projections.',
  },
  {
    Icon: PlayCircle,
    label: 'Controlled action',
    desc: 'Automation is introduced only where actions are safe, approved and auditable.',
  },
  {
    Icon: RefreshCw,
    label: 'Learning loop',
    desc: 'Corrections and outcomes improve future logic rather than disappear into reports.',
  },
];

export default function GovernAssure() {
  return (
    <section className="section-divider relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nex-blue/5 to-transparent pointer-events-none" />
      <div className="container-wide relative">

        {/* ── Two-column: copy left, cards right ── */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16 mb-8">

          {/* Left — heading + prose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            viewport={{ once: true }}
            className="lg:w-[38%] lg:flex-shrink-0 lg:sticky lg:top-24"
          >
            <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Govern <span className="text-nex-cyan">&amp; Assure</span>
            </h2>

            <p className="font-urbanist text-nex-text text-xl font-semibold mb-4">
              Intelligence without control creates new risk.
            </p>

            <p className="font-inter text-nex-grey text-sm mb-3 leading-relaxed">
              As businesses adopt AI, the question is no longer only whether systems can detect, recommend or act.
            </p>
            <p className="font-inter text-nex-grey text-sm mb-3 leading-relaxed">
              The harder question is:
            </p>
            <p className="font-inter text-nex-cyan text-sm mb-5 leading-relaxed font-medium pl-4 border-l-2 border-nex-cyan/40">
              Can the business trust what the system sees, says and does?
            </p>
            <p className="font-inter text-nex-grey text-sm leading-relaxed">
              NexFrontier's Govern &amp; Assure layer is designed to keep operational intelligence commercially safe, auditable and trusted.
            </p>
          </motion.div>

          {/* Right — 2-column card grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {controls.map((item, i) => {
              const { Icon, label, desc } = item;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className="group flex gap-4 px-5 py-5 bg-gradient-to-br from-nex-navy/60 to-nex-darker/60 border border-nex-cyan/10 rounded-xl hover:border-nex-cyan/35 hover:from-nex-navy/70 transition-all duration-300"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-9 h-9 rounded-lg bg-nex-cyan/10 border border-nex-cyan/20 flex items-center justify-center group-hover:bg-nex-cyan/20 group-hover:border-nex-cyan/40 transition-all duration-300">
                      <Icon size={16} className="text-nex-cyan" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-urbanist text-nex-cyan font-bold text-base mb-1.5">{label}</h3>
                    <p className="font-inter text-nex-grey text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          viewport={{ once: true }}
          className="relative overflow-hidden px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/8 border border-nex-cyan/50 rounded-2xl shadow-glow-cyan text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12)_0%,transparent_70%)] pointer-events-none" />
          <p className="relative font-urbanist text-nex-text text-base md:text-lg font-semibold leading-relaxed">
            NexFrontier does not treat governance as a brake on intelligence.<br />
            <span className="text-nex-cyan">Governance is what allows intelligence to become commercially useful.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
