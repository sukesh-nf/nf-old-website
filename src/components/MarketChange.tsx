import { motion } from 'framer-motion';

export default function MarketChange() {
  return (
    <section className="section-divider" id="market-change">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">The Rules Have Changed, <span className="text-nex-cyan">Quietly</span></span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              viewport={{ once: true }}
              className="p-5 bg-gradient-to-br from-nex-navy/50 to-nex-darker/50 border border-nex-cyan/10 rounded-lg"
            >
              <h3 className="font-urbanist text-nex-cyan text-xl font-bold mb-3">Yesterday's Reality</h3>
              <ul className="space-y-2.5 font-inter text-nex-grey text-sm">
                <li className="flex gap-3">
                  <span className="text-nex-cyan">•</span>
                  <span>Customers spent hours comparing options</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-nex-cyan">•</span>
                  <span>Websites were decisive factors</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-nex-cyan">•</span>
                  <span>Visibility meant competitive advantage</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-nex-cyan">•</span>
                  <span>Operations were mostly human-managed</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-5 bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border border-nex-cyan/30 rounded-lg"
            >
              <h3 className="font-urbanist text-nex-cyan text-xl font-bold mb-3">Today's New Reality</h3>
              <ul className="space-y-2.5 font-inter text-nex-grey text-sm">
                <li className="flex gap-3">
                  <span className="text-nex-cyan">•</span>
                  <span>Decisions happen in seconds, often via AI</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-nex-cyan">•</span>
                  <span>APIs and data infrastructure matter more</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-nex-cyan">•</span>
                  <span>Reliability is the new competitive moat</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-nex-cyan">•</span>
                  <span>Operations run on intelligent systems</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative mb-5 rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-nex-cyan/8 to-nex-blue/5 border border-nex-cyan/20 rounded-lg" />
            <div className="relative px-6 py-5">
              <p className="font-inter text-nex-grey text-base leading-relaxed mb-2.5">
                Increasingly, AI will not only recommend. <span className="text-white">It will act,</span> helping customers compare, book, buy, resolve, and move on with less human effort.
              </p>
              <p className="font-inter text-nex-grey text-base leading-relaxed">
                That means businesses must be ready not only to be <span className="text-white font-medium">found</span>, but to be <span className="text-white font-medium">trusted</span>, <span className="text-white font-medium">selected</span>, and <span className="text-nex-cyan font-medium">acted upon</span>.
              </p>
              <p className="font-inter text-nex-cyan text-base leading-relaxed mt-4">
                But trust in an AI-mediated market is not created by automation alone. It is created by systems that can prove what happened, show why a decision was made, keep humans in control where judgement matters, and prevent unsupported actions from reaching customers.
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            viewport={{ once: true }}
            className="font-inter text-nex-grey text-base leading-relaxed border-l-2 border-nex-cyan/50 pl-5 py-3"
          >
            <span className="text-white font-bold">The winners aren't visible, they're <span className="text-nex-cyan">reliable</span>.</span> They operate infrastructure that captures opportunity at machine speed. When systems fail silently, revenue evaporates. When they succeed, it's invisible to competitors.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
