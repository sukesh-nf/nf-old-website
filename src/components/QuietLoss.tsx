import { motion } from 'framer-motion';

export default function QuietLoss() {
  return (
    <section className="section-divider relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nex-cyan/5 to-transparent"></div>
      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-nex-cyan">AI-Era Revenue Infrastructure</span>
          </h2>
          <h3 className="font-urbanist text-xl md:text-2xl font-semibold text-nex-text mb-8">
            Recover Hidden Revenue (Quiet Loss)
          </h3>

          {/* Stats block */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            viewport={{ once: true }}
            className="mb-8 space-y-2"
          >
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              Most businesses lose{' '}
              <span className="text-nex-cyan font-semibold">73% of lead intent</span> before it ever reaches a CRM.
            </p>
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              This is the{' '}
              <span className="text-nex-text font-semibold">73/30 Rule</span>: Technical friction and human latency create a{' '}
              <span className="text-nex-cyan font-semibold">30% hole</span> in your realised revenue.
            </p>
          </motion.div>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-inter text-nex-grey text-base leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            NexFrontier helps businesses reduce lost enquiries, broken follow-up, and operational gaps that silently erode
            growth. We help <span className="underline decoration-nex-cyan/50">stabilise</span> the operational layer beneath AI-mediated customer demand.
          </motion.p>

          {/* What is Quiet Loss CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <button className="font-inter px-6 py-2.5 border border-nex-cyan/60 text-nex-cyan font-semibold rounded-md hover:bg-nex-cyan/10 transition-all duration-300 text-sm">
              What is Quiet Loss?
            </button>
          </motion.div>

          {/* Operational infrastructure paragraph */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-inter text-nex-grey text-base leading-relaxed mb-6 max-w-2xl mx-auto"
          >
            NexFrontier is not another AI tool. It is operational infrastructure designed to help businesses remain
            responsive, reliable, and commercially effective in AI-mediated markets.
          </motion.p>

          {/* Beta announcement */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-inter text-nex-cyan font-semibold text-base mb-8"
          >
            NexFrontier's operational intelligence layer, including The Brain, is currently in BETA.
          </motion.p>

          {/* Foundation Customers */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-inter text-nex-grey text-base leading-relaxed mb-6 max-w-2xl mx-auto"
          >
            We are inviting a limited number of businesses to participate as{' '}
            <span className="text-white font-bold">Foundation Customers</span> and help shape the next
            operating standard for AI-mediated business environments.
          </motion.p>

          {/* Beta eligibility */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-inter text-nex-grey/90 text-sm italic leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            <span className="text-nex-cyan/70 font-semibold not-italic">Foundation Customer BETA access</span> is currently limited to businesses generating a minimum of{' '}
            <span className="text-nex-cyan/70 font-semibold not-italic">$5 Million</span> annual
            revenue. BETA onboarding is intentionally limited to ensure close operational
            collaboration with each Foundation Customer.
          </motion.p>

          {/* Foundation Customer BETA Access CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <button className="font-inter px-8 py-3 border border-nex-cyan/60 text-nex-cyan font-semibold rounded-md hover:bg-nex-cyan/10 transition-all duration-300">
              Foundation Customer (BETA Access)
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
