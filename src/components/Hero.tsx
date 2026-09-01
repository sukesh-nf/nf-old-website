import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h1 className="font-urbanist text-[3.75rem] sm:text-7xl md:text-[6.25rem] font-bold tracking-tight mb-6">
              <span className="text-white">Nex</span>
              <span className="text-nex-cyan">Frontier</span>
            </h1>

            <p className="font-urbanist text-nex-cyan text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-widest uppercase mb-8 px-4 text-center w-full">
              Commercial Reliability Infrastructure for AI-Mediated Economy
            </p>

            <p className="font-inter text-nex-grey text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Protecting Organisational Commitments.
            </p>
            <p className="font-inter text-nex-grey text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
              By evidencing operational friction, human latency, process gaps, and capability leakage that prevent customer intent from becoming business value.
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-nex-cyan"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
