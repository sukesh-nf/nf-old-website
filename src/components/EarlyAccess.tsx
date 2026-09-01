import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
  viewport: { once: true },
});

export default function EarlyAccess() {
  return (
    <section className="section-divider relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nex-blue/5 to-transparent" />
      <div className="container-wide relative">
        <motion.div {...fadeUp()}>
          <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Operational Trust Infrastructure for<br /><span className="text-nex-cyan">AI-Mediated Markets</span></span>
          </h2>
          <div className="font-inter text-nex-grey text-lg max-w-3xl mb-8 leading-relaxed space-y-4">
            <p>Most businesses do not realise how much value they quietly lose when customer intent slows down, fragments, gets handed around, or fails to become a clear outcome.</p>
            <p>For years, those gaps were treated as the cost of doing business.</p>
            <p>But as customers, partners, platforms and <span className="text-nex-cyan">AI-mediated pathways</span> increasingly shape how businesses are discovered, compared and chosen, hidden operational friction becomes commercially dangerous.</p>
            <p className="text-nex-cyan">NexFrontier helps organisations reveal Quiet Loss, recover value where possible, and build the evidence-backed operational readiness needed to be trusted, carried forward and chosen in AI-mediated markets.</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <a href="#market-change" className="font-inter inline-block px-8 py-3 bg-nex-cyan text-nex-dark font-semibold rounded-full hover:shadow-glow-cyan-lg hover:scale-105 transition-all duration-300">
              Markets Have Shifted
            </a>
            <a href="#/true-case" className="font-inter inline-flex items-center gap-2 px-8 py-3 border border-nex-cyan/50 text-nex-cyan font-semibold rounded-full hover:bg-nex-cyan/10 hover:border-nex-cyan hover:shadow-glow-cyan hover:scale-105 transition-all duration-300">
              A True Case
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </motion.div>

        {/* Recover Hidden Revenue Card */}
        <motion.div
          {...fadeUp(0.08)}
          className="mt-12 md:mt-20 p-5 sm:p-8 md:p-12 bg-gradient-to-br from-nex-navy/50 to-nex-darker/50 border border-nex-cyan/20 rounded-xl backdrop-blur-sm hover:border-nex-cyan/40 transition-all duration-300"
        >
          <h3 className="font-urbanist text-2xl md:text-3xl font-bold text-nex-cyan mb-4">
            Recover Hidden Revenue/Quiet Loss
          </h3>
          <p className="font-inter text-nex-grey text-base leading-relaxed">
            The 70/30 Rule is NexFrontier's working diagnostic model for examining how much customer intent may disappear before becoming visible in conventional systems, and how much of the resulting commercial loss may be recoverable.
            <br /><br />
            Every failed transaction, every abandoned handoff, every missed signal represents revenue walking out the door. Businesses quietly lose revenue through delay, broken follow-up, and operational friction.
            <br /><br />
            <span className="text-nex-cyan">NexFrontier helps recover the revenue and opportunities most businesses never realise they are losing.</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#calculate-quiet-loss" className="px-8 py-3 bg-nex-cyan text-nex-dark font-inter font-semibold rounded-full hover:shadow-glow-cyan-lg hover:scale-105 transition-all duration-300 inline-block">
              Calculate My Quiet Loss
            </a>
            <a href="#/case-example" className="px-8 py-3 bg-transparent text-nex-cyan font-inter font-semibold rounded-full border border-nex-cyan/50 hover:bg-nex-cyan/10 hover:border-nex-cyan hover:shadow-glow-cyan hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
              Example Calculation
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
