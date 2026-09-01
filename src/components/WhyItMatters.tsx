import { motion } from 'framer-motion';

export default function WhyItMatters() {
  return (
    <section className="section-divider relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nex-blue/5 to-transparent"></div>
      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
        >
          <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8">
            Why This Matters <span className="text-nex-cyan">Now</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {[
              {
                title: 'AI Is Changing Commerce Speed',
                desc: 'Decisions that took days now happen in seconds. Systems that fail silently lose entire revenue opportunities before humans can intervene.',
              },
              {
                title: 'Legacy Monitoring Is Blind',
                desc: "Traditional monitoring watches for obvious failures. Quiet loss happens in the gaps between systems, where legacy tools can't see.",
              },
              {
                title: 'Scale Amplifies Risk',
                desc: 'A 1% failure rate on 1M daily transactions is 10K revenue events breaking silently. The bigger you scale, the more dangerous silence becomes.',
              },
              {
                title: 'Competition Is Operational Now',
                desc: "Your competitors aren't winning on features anymore. They're winning on reliability. On the ability to operate without dropping revenue.",
              },
              {
                title: 'Intelligence Must Be Governed',
                desc: 'As AI moves closer to customer decisions and operational action, businesses need more than speed. They need traceability, permissioning, human oversight, controlled automation and defensible reporting.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                viewport={{ once: true }}
                className={`flex gap-4 px-5 py-4 bg-gradient-to-br from-nex-navy/50 to-nex-darker/50 border border-nex-cyan/10 rounded-lg${i === 4 ? ' sm:col-span-2' : ''}`}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-nex-cyan/20 text-nex-cyan">
                    <span className="font-bold text-sm">{i + 1}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-urbanist text-nex-cyan font-bold text-base mb-1.5">{item.title}</h3>
                  <p className="font-inter text-nex-grey text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Statement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden mt-4 md:mt-5 px-7 py-6 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/8 border border-nex-cyan/50 rounded-2xl shadow-glow-cyan text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12)_0%,transparent_70%)] pointer-events-none" />
            <p className="relative font-urbanist text-nex-text text-lg md:text-xl font-semibold leading-relaxed">
              In an AI-mediated economy, <span className="text-nex-cyan">operational reliability is the only sustainable moat</span>.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
