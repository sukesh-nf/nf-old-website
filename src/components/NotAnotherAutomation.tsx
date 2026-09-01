import { motion } from 'framer-motion';

export default function NotAnotherAutomation() {
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
          <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            This Is <span className="text-nex-cyan">Not Another Automation Platform</span>
          </h2>
          <p className="font-inter text-nex-grey text-base max-w-3xl mb-12 leading-relaxed">
            Automation platforms automate the same problems your systems already have. NexFrontier builds entirely different infrastructure.
          </p>

          <div className="space-y-6">
            {[
              {
                label: 'Automation Platforms',
                items: ['Speed up existing workflows', 'Apply rules to existing data', 'Automate human processes', 'Typical ROI: 20-30%'],
              },
              {
                label: 'NexFrontier Infrastructure',
                items: ['Detect problems that are invisible today', 'Create new data where blindness existed', 'Operate systems humans can\'t manage at this scale', 'Typical ROI: 100-300%+'],
              },
            ].map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`p-5 sm:p-8 md:p-10 rounded-lg border ${
                  i === 0
                    ? 'bg-gradient-to-br from-nex-navy/30 to-nex-darker/50 border-nex-cyan/10'
                    : 'bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border-nex-cyan/40'
                }`}
              >
                <h3 className="font-urbanist text-nex-cyan font-bold text-lg md:text-xl mb-4">{group.label}</h3>
                <ul className="space-y-3">
                  {group.items.map((item, j) => (
                    <li key={j} className="flex gap-3 font-inter text-nex-grey text-sm">
                      <span className={`flex-shrink-0 w-5 h-5 rounded ${i === 0 ? 'bg-nex-cyan/20' : 'bg-nex-cyan/40'}`}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Key Difference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            viewport={{ once: true }}
            className="relative overflow-hidden mt-12 px-7 py-6 bg-gradient-to-r from-nex-cyan/10 to-nex-blue/8 border border-nex-cyan/50 rounded-2xl shadow-glow-cyan text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12)_0%,transparent_70%)] pointer-events-none" />
            <p className="relative font-urbanist text-nex-text text-lg md:text-xl font-semibold leading-relaxed">
              <span className="text-nex-cyan">Revenue infrastructure isn't about doing more of what you already do.</span> It's about seeing and acting on the revenue opportunities you're currently missing.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
