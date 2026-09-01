import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, DollarSign } from 'lucide-react';

const rows = [
  {
    Icon: Users,
    label: 'NexFrontier infrastructure:',
    content: (
      <>
        {' '}NexFrontier's operational intelligence layer, including "The Brain", is currently in BETA.
        {' '}We are inviting a limited number of businesses to participate as{' '}
        <span className="text-white font-bold">Foundation Customers</span> and help shape the next
        operating standard for AI-mediated business environments.
      </>
    ),
  },
  {
    Icon: DollarSign,
    label: 'Foundation Customer BETA access',
    content: (
      <>
        {' '}is currently limited to businesses generating a minimum of{' '}
        <span className="text-white font-semibold">$5 Million</span> annual revenue. BETA onboarding is
        intentionally limited to ensure close operational collaboration with each Foundation Customer.
      </>
    ),
  },
  {
    Icon: Zap,
    label: null,
    content: (
      <>
        <span className="text-nex-cyan font-semibold">NexFrontier is not another AI tool.</span>{' '}
        It is <span className="text-white font-semibold">operational infrastructure</span> designed to help
        businesses remain responsive, reliable, and commercially effective in AI-mediated markets.{' '}
        The next operating standard is not just intelligent. It is governed, traceable and commercially trusted.
      </>
    ),
  },
];

export default function FoundationOverview() {
  return (
    <section className="section-divider relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nex-cyan/5 to-transparent" />
      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Our <span className="text-nex-cyan">Invitation</span> To You</span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-nex-navy/50 to-nex-darker/50 border border-nex-cyan/20 rounded-xl overflow-hidden"
          >
            {rows.map(({ Icon, label, content }, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 px-5 py-4 ${i < rows.length - 1 ? 'border-b border-nex-cyan/10' : ''}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-nex-cyan/10 flex items-center justify-center mt-0.5">
                  <Icon size={15} className="text-nex-cyan" />
                </div>
                <p className="font-inter text-nex-grey text-base leading-relaxed">
                  {label && <span className="text-nex-cyan font-semibold">{label}</span>}
                  {label && ' '}
                  {content}
                </p>
              </div>
            ))}

            <div className="px-5 py-4 border-t border-nex-cyan/10 flex justify-center">
              <a
                href="#beta-programme"
                className="font-inter group inline-flex items-center gap-2.5 px-7 py-2.5 bg-nex-cyan/10 border border-nex-cyan/50 text-nex-cyan text-sm font-semibold rounded-lg hover:bg-nex-cyan/20 hover:border-nex-cyan transition-all duration-300"
              >
                Apply for BETA
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
