import { motion } from 'framer-motion';
import { UserCheck, Sliders, GitBranch, FileText } from 'lucide-react';

const principles = [
  {
    Icon: UserCheck,
    label: 'Purpose and Authority',
    desc: 'People define the purpose, authority limits, and accountability structures before any AI-supported action occurs.',
  },
  {
    Icon: Sliders,
    label: 'Rules and Escalation',
    desc: 'Escalation paths and decision rules are set by humans upfront. The Brain operates within those boundaries, not beyond them.',
  },
  {
    Icon: GitBranch,
    label: 'Observe Broadly, Act Narrowly',
    desc: 'The Brain monitors the full operating loop but acts only within governed, approved parameters, preserving human control over consequential decisions.',
  },
  {
    Icon: FileText,
    label: 'Evidence and Traceability',
    desc: 'Every supported action produces a record: what was observed, what was surfaced, what was decided, and by whom.',
  },
];

export default function GovernedByDesign() {
  return (
    <section className="section-divider relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nex-blue/4 to-transparent pointer-events-none" />
      <div className="container-wide relative">

        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Governed <span className="text-nex-cyan">by Design</span>
          </h2>

          {/* Human in the Lead distinction */}
          <div className="relative mb-6 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-nex-cyan/8 to-transparent pointer-events-none" />
            <div className="relative px-6 py-5 border-l-2 border-nex-cyan/50">
              <p className="font-urbanist text-nex-text text-xl font-semibold mb-3">
                Human in the Lead, not merely Human in the Loop.
              </p>
              <p className="font-inter text-nex-grey text-sm leading-relaxed mb-2">
                <span className="text-white font-medium">Human in the Loop</span> means a person is asked to approve or review an automated step.
              </p>
              <p className="font-inter text-nex-grey text-sm leading-relaxed">
                <span className="text-nex-cyan font-medium">Human in the Lead</span> means people define the purpose, authority, rules, escalation paths and accountability before AI acts. The system operates inside a framework that humans designed, not one it inferred on its own.
              </p>
            </div>
          </div>

          {/* Two-column: prose left, cards right */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16">

            {/* Left prose */}
            <div className="lg:w-[38%] lg:flex-shrink-0 lg:sticky lg:top-24">
              <p className="font-urbanist text-nex-text text-lg font-semibold mb-4">
                The Brain is built to observe broadly, act narrowly and preserve human authority.
              </p>
              <p className="font-inter text-nex-grey text-sm mb-3 leading-relaxed">
                NexFrontier's operating intelligence is not designed to remove human judgement from the business. It is designed to make judgement better informed, better timed and better evidenced.
              </p>
              <p className="font-inter text-nex-grey text-sm mb-3 leading-relaxed">
                The Brain observes the operating loop, surfaces risk, supports governed action and preserves a clear record of what happened, who authorised it, and what outcome followed.
              </p>
              <p className="font-inter text-nex-cyan text-sm leading-relaxed font-medium pl-4 border-l-2 border-nex-cyan/40">
                You are not handing control to AI. You are defining how AI-supported operational readiness should be governed.
              </p>
            </div>

            {/* Right cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {principles.map((item, i) => {
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
        </motion.div>

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
            Decisions that affect customers, trust and commercial outcomes<br />
            <span className="text-nex-cyan">remain under human authority, always.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
