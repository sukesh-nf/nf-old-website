import { motion } from 'framer-motion';

export default function TraditionalAIStall() {
  return (
    <section className="section-divider">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
        >
          <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12">
            Why Traditional <span className="text-nex-cyan">AI Projects Stall</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {[
              {
                title: 'Proof Takes Too Long',
                desc: 'Most AI projects need 6-12 months to show value. Revenue can\'t wait that long.',
              },
              {
                title: 'Risk Is Misunderstood',
                desc: 'Teams deploy systems that either prove nothing or break production. No middle ground.',
              },
              {
                title: 'Adoption Fails',
                desc: 'Even when systems work, teams don\'t trust them. Human resistance kills automation.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="p-6 bg-gradient-to-br from-nex-navy/30 to-nex-darker/50 border border-nex-cyan/15 rounded-lg"
              >
                <h3 className="font-urbanist text-nex-cyan font-bold text-lg mb-3">{item.title}</h3>
                <p className="font-inter text-nex-grey text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* NexFrontier Difference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 mb-12"
          >
            <h3 className="font-urbanist text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8">
              <span className="text-white">Nex</span><span className="text-nex-cyan">Frontier</span> Works Differently
            </h3>

            <div className="grid sm:grid-cols-2 gap-5 md:gap-8">
              {[
                {
                  title: 'Fast Proof',
                  desc: 'Operational value within 4 weeks. Revenue impact within 8 weeks. We measure success in delivered revenue, not model accuracy.',
                },
                {
                  title: 'Guardian Mode',
                  desc: 'Systems run alongside your existing operations first. They observe, learn, and prove safety before taking control. Zero production risk.',
                },
                {
                  title: 'Trust Through Transparency',
                  desc: 'Every decision is explainable. Teams see why the system acted, what data it used, and can audit every outcome.',
                },
                {
                  title: 'Revenue Alignment',
                  desc: 'Success metrics are tied to dollars, not metrics. Your team only cares about one thing: did revenue go up?',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="p-8 bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border border-nex-cyan/25 rounded-lg"
                >
                  <h4 className="font-urbanist text-nex-cyan font-bold text-lg mb-3">{item.title}</h4>
                  <p className="font-inter text-nex-grey text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* The Result */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden px-7 py-6 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/8 border border-nex-cyan/50 rounded-2xl shadow-glow-cyan text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12)_0%,transparent_70%)] pointer-events-none" />
            <p className="relative font-urbanist text-sm font-semibold uppercase tracking-widest text-nex-cyan/70 mb-3">The Result</p>
            <p className="relative font-urbanist text-nex-text text-lg md:text-xl font-semibold leading-relaxed">
              <span className="text-nex-cyan">Teams adopt systems they trust.</span> Revenue starts flowing. Competitive advantages compound. That's how operational intelligence actually works.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
