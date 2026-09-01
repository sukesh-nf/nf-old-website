import { motion } from 'framer-motion';

const segments = [
  {
    title: 'Organisations Operating Through the Internet',
    desc: 'If revenue flows through digital systems, quiet loss is happening. E-commerce, SaaS, marketplaces, financial platforms.',
  },
  {
    title: 'Founders & Early-Stage Leaders',
    desc: 'Building infrastructure now saves millions in lost revenue later. Embed operational reliability from day one, not as an afterthought.',
  },
  {
    title: 'Private Equity & Portfolio Groups',
    desc: 'Operational infrastructure is the easiest way to multiply portfolio valuations. 15-25% revenue uplift across holdings.',
  },
  {
    title: 'Businesses Where Speed & Reliability Matter',
    desc: "If your market moves fast, if missing an opportunity costs real money, if downtime creates cascading problems, you're our customer.",
  },
  {
    title: 'Governance-Sensitive Operators',
    desc: 'Businesses operating in environments where customer trust, data control, compliance, reputational risk or human oversight matter.',
  },
];

function Card({ item, index }: { item: typeof segments[number]; index: number }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group px-6 py-5 bg-gradient-to-br from-nex-navy/50 to-nex-darker/50 border border-nex-cyan/15 rounded-lg hover:border-nex-cyan/40 hover:from-nex-navy/70 transition-all duration-300"
    >
      <h3 className="font-urbanist text-nex-cyan text-base font-bold mb-2 leading-snug">{item.title}</h3>
      <p className="font-inter text-nex-grey text-sm leading-relaxed">{item.desc}</p>
    </motion.div>
  );
}

export default function WhoWeWorkWith() {
  return (
    <section className="section-divider">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
        >
          <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8">
            <span className="text-white">Nex<span className="text-nex-cyan">Frontier</span>, Who Benefits?</span>
          </h2>

          {/* Row 1 — 3 cards */}
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            {segments.slice(0, 3).map((item, i) => (
              <Card key={i} item={item} index={i} />
            ))}
          </div>

          {/* Row 2 — 2 cards centered under row 1 */}
          <div className="grid sm:grid-cols-2 gap-3 sm:mx-auto sm:max-w-[66.7%] mb-4">
            {segments.slice(3).map((item, i) => (
              <Card key={i + 3} item={item} index={i + 3} />
            ))}
          </div>

          {/* Bottom Statement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden px-6 py-5 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/8 border border-nex-cyan/50 rounded-2xl shadow-glow-cyan text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12)_0%,transparent_70%)] pointer-events-none" />
            <p className="relative font-urbanist text-nex-text text-base md:text-lg font-semibold leading-relaxed">
              Multi-channel service or transaction businesses with meaningful enquiry volume, fragmented handoffs, measurable customer value and sufficient operating data to trace intent through to outcome.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
