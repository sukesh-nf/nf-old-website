import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, TrendingDown, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { useMeta } from '../lib/useMeta';
import { useJsonLd } from '../lib/useJsonLd';

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 md:p-8 bg-gradient-to-br from-nex-navy/50 to-nex-darker/50 border border-nex-cyan/20 rounded-xl backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

function FormulaBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 px-5 py-4 bg-nex-dark/60 border-l-2 border-nex-cyan rounded-r-lg font-mono text-white text-sm md:text-base leading-relaxed">
      {children}
    </div>
  );
}

function InputParam({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-nex-cyan/10 last:border-0">
      <span className="font-inter text-nex-grey text-sm">{label}</span>
      <span className="font-urbanist font-bold text-nex-cyan text-sm">{value}</span>
    </div>
  );
}

export default function CaseExample() {
  useMeta({
    title: 'Quiet Loss Calculator - NexFrontier',
    description: 'See how NexFrontier quantifies quiet loss for a mid-market financial services firm - and how operational reliability infrastructure recovers the hidden revenue.',
    ogUrl: '/#/case-example',
  });
  useJsonLd([
    {
      '@type': 'WebPage',
      '@id': 'https://nexfrontier.my/#/case-example',
      'url': 'https://nexfrontier.my/#/case-example',
      'name': 'Quiet Loss Calculator - NexFrontier',
      'description': 'See how NexFrontier quantifies quiet loss for a mid-market financial services firm and how operational reliability infrastructure recovers the hidden revenue.',
      'isPartOf': { '@id': 'https://nexfrontier.my/#website' },
      'publisher': { '@id': 'https://nexfrontier.my/#organization' },
      'inLanguage': 'en',
    },
    {
      '@type': 'SoftwareApplication',
      'name': 'Quiet Loss Calculator',
      'applicationCategory': 'BusinessApplication',
      'description': 'An interactive calculator that quantifies hidden revenue loss caused by operational reliability gaps in AI-mediated customer experience environments.',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'operatingSystem': 'Web Browser',
      'provider': { '@id': 'https://nexfrontier.my/#organization' },
    },
  ]);
  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-nex-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-nex-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide py-16 md:py-24 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-nex-cyan text-sm font-medium mb-12 hover:text-nex-cyan/80 transition-colors duration-300"
          >
            <ArrowLeft size={16} />
            Back to NexFrontier
          </a>

          {/* Header */}
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 border border-nex-cyan/30 rounded-full text-nex-cyan/80 text-sm font-medium">
              <Calculator size={14} />
              Case Example
            </div>
            <h1 className="font-urbanist text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Calculate Your <span className="text-nex-cyan">Quiet Loss</span>
            </h1>
            <p className="font-inter text-nex-grey text-lg leading-relaxed">
              How much existing value is already leaking through operational instability? This walkthrough shows exactly how the Quiet Loss calculator works, what each number means, and how results are derived.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
            {/* Main content */}
            <div className="md:col-span-2 space-y-8">

              {/* Inputs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <SectionCard>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-nex-cyan/10 border border-nex-cyan/30 flex items-center justify-center">
                      <span className="font-urbanist font-bold text-nex-cyan text-sm">1</span>
                    </div>
                    <h2 className="font-urbanist text-xl font-bold text-white">5 Core Input Parameters</h2>
                  </div>
                  <InputParam label="Monthly Leads" value="5,000" />
                  <InputParam label="Conversion Rate" value="5%" />
                  <InputParam label="Customer Value" value="$5,000" />
                  <InputParam label="Recoverable Leakage Estimate" value="15%" />
                  <InputParam label="Monthly Ad Spend" value="$50,000" />
                </SectionCard>
              </motion.div>

              {/* Immediate Leak */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <SectionCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-nex-cyan/10 border border-nex-cyan/30 flex items-center justify-center">
                      <TrendingDown size={14} className="text-nex-cyan" />
                    </div>
                    <h2 className="font-urbanist text-xl font-bold text-white">Immediate Leak</h2>
                  </div>
                  <p className="font-inter text-nex-grey text-sm leading-relaxed mb-3">
                    Industry research indicates that approximately <span className="text-nex-text font-medium">73% of leads are lost to operational friction</span> before a conversion decision is ever made: slow response, inconsistent follow-up, fragmented handoffs. Applying that to the inputs:
                  </p>
                  <FormulaBlock>
                    <span className="text-nex-grey text-xs md:text-sm block mb-2">(Monthly Leads × 73% Theoretical Neglect Rate) × Conversion Rate × Average Customer Value</span>
                    (5,000 × 73%) × 5% × $5,000<br />
                    = 3,650 × 5% × $5,000<br />
                    = <span className="text-nex-cyan font-bold">$912,500 / month</span>
                  </FormulaBlock>
                  <p className="font-inter text-nex-grey text-sm leading-relaxed">
                    This is the theoretical revenue leaking through your current operational state. This is not a lead generation shortfall, but a lead <span className="text-nex-cyan font-medium">preservation</span> failure.
                  </p>
                </SectionCard>
              </motion.div>

              {/* Recovery Potential */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <SectionCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-nex-cyan/10 border border-nex-cyan/30 flex items-center justify-center">
                      <TrendingUp size={14} className="text-nex-cyan" />
                    </div>
                    <h2 className="font-urbanist text-xl font-bold text-white">Quiet Loss Recovery Potential</h2>
                  </div>
                  <p className="font-inter text-nex-grey text-sm leading-relaxed mb-3">
                    A <span className="text-nex-text font-medium">15% recoverable leakage</span> represents a conservative, realistic estimate of what can be preserved through operational improvement, not optimistic projections.
                  </p>
                  <FormulaBlock>
                    (5,000 × 15%) × 5% × $5,000<br />
                    = 750 × 5% × $5,000<br />
                    = <span className="text-nex-cyan font-bold">$187,500 / month</span>
                  </FormulaBlock>
                  <p className="font-inter text-sm leading-relaxed px-4 py-3 rounded-lg bg-nex-cyan/10 border border-nex-cyan/30 text-nex-text">
                    The gap between what is currently leaking (73%) and what is realistically recoverable (15%) is the <span className="text-nex-cyan font-semibold">core Quiet Loss figure</span>.
                  </p>
                </SectionCard>
              </motion.div>

              {/* Eligibility Tax Reduction */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                <SectionCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-nex-cyan/10 border border-nex-cyan/30 flex items-center justify-center">
                      <DollarSign size={14} className="text-nex-cyan" />
                    </div>
                    <h2 className="font-urbanist text-xl font-bold text-white">Eligibility Tax Reduction</h2>
                  </div>
                  <p className="font-inter text-nex-grey text-sm leading-relaxed mb-3">
                    When customer handling improves, a portion of acquisition spend becomes unnecessary. Right now, part of your ad budget is compensating for downstream operational inefficiency, not actually generating new demand.
                  </p>
                  <p className="font-inter text-nex-grey text-sm leading-relaxed mb-3">
                    The <span className="text-nex-text font-medium">CAC Inflation Analysis</span> identifies this:
                  </p>
                  <FormulaBlock>
                    Current CAC = $1,000 &nbsp;|&nbsp; Efficient CAC = $800<br />
                    ($1,000 − $800) ÷ $1,000 = <span className="text-nex-cyan font-bold">20%</span> avoidable inefficiency
                  </FormulaBlock>
                  <p className="font-inter text-nex-grey text-sm leading-relaxed mb-3">
                    Applying that 20% to monthly ad spend:
                  </p>
                  <FormulaBlock>
                    $50,000 × 20% = <span className="text-nex-cyan font-bold">$10,000 saved / month</span>
                  </FormulaBlock>
                  <p className="font-inter text-sm leading-relaxed px-4 py-3 rounded-lg bg-nex-cyan/10 border border-nex-cyan/30 text-nex-text">
                    This is not a marketing optimisation. It is the removal of acquisition spend that exists only because operations are inefficient downstream.
                  </p>
                </SectionCard>
              </motion.div>

              {/* Total Delta */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                <div className="p-6 md:p-8 bg-gradient-to-br from-nex-cyan/15 to-nex-blue/10 border-2 border-nex-cyan/60 rounded-xl backdrop-blur-sm shadow-glow-cyan-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-nex-cyan/30 border border-nex-cyan/60 flex items-center justify-center">
                      <Zap size={16} className="text-nex-cyan" />
                    </div>
                    <h2 className="font-urbanist text-xl font-bold text-white">Total Quiet Loss (Delta)</h2>
                  </div>
                  <div className="my-4 px-5 py-5 bg-nex-dark/70 border-l-2 border-nex-cyan rounded-r-lg font-mono text-white text-sm md:text-base leading-relaxed">
                    $187,500 + $10,000 = <span className="text-nex-cyan font-bold text-xl md:text-2xl"> $197,500 / month</span>
                  </div>
                  <p className="font-inter text-nex-text text-sm leading-relaxed">
                    Small operational improvements across large interaction volumes create material financial recovery. The inputs are conservative by design, and the actual number is often higher once internal workflows are mapped.
                  </p>
                </div>
              </motion.div>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <SectionCard>
                  <h3 className="font-urbanist text-nex-cyan font-semibold text-sm mb-4 uppercase tracking-wider">Example Summary</h3>
                  <dl className="space-y-4 font-inter text-sm">
                    <div>
                      <dt className="text-nex-grey text-xs mb-1">Immediate Leak</dt>
                      <dd className="font-urbanist font-bold text-white text-lg">$912,500<span className="text-nex-grey text-xs font-normal font-inter">/mo</span></dd>
                    </div>
                    <div>
                      <dt className="text-nex-grey text-xs mb-1">Recovery Potential</dt>
                      <dd className="font-urbanist font-bold text-white text-lg">$187,500<span className="text-nex-grey text-xs font-normal font-inter">/mo</span></dd>
                    </div>
                    <div>
                      <dt className="text-nex-grey text-xs mb-1">Eligibility Tax Reduction</dt>
                      <dd className="font-urbanist font-bold text-white text-lg">$10,000<span className="text-nex-grey text-xs font-normal font-inter">/mo</span></dd>
                    </div>
                    <div className="pt-3 border-t border-nex-cyan/20">
                      <dt className="text-nex-grey text-xs mb-1">Total Quiet Loss</dt>
                      <dd className="font-urbanist font-bold text-nex-cyan text-2xl">$197,500<span className="text-nex-grey text-xs font-normal font-inter">/mo</span></dd>
                    </div>
                  </dl>
                </SectionCard>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <SectionCard className="border-nex-cyan/30 bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5">
                  <p className="font-inter text-nex-text text-sm leading-relaxed italic mb-0">
                    "Businesses often think they have a <span className="text-white font-bold not-italic">lead generation</span> problem. When they actually have a <span className="text-nex-cyan not-italic">lead preservation</span> problem."
                  </p>
                </SectionCard>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                <a
                  href="/#calculate-quiet-loss"
                  className="block w-full text-center px-6 py-3 bg-nex-cyan text-nex-dark font-inter font-bold rounded-full hover:shadow-glow-cyan-lg hover:scale-105 transition-all duration-300 text-sm"
                >
                  Calculate Your Quiet Loss
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
