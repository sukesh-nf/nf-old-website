import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronRight, TrendingDown, AlertTriangle, Zap, Info } from 'lucide-react';

function InfoTooltip({ tip }: { tip: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-center w-4 h-4 rounded-full text-nex-grey/70 hover:text-nex-cyan/70 transition-colors"
        aria-label="Help"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Info size={13} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48 sm:w-56 max-w-[calc(100vw-2rem)] bg-nex-dark border border-nex-cyan/20 rounded-xl px-3.5 py-3 shadow-xl pointer-events-none"
          >
            <p className="font-inter text-nex-grey text-xs leading-relaxed">{tip}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 overflow-hidden">
              <div className="w-2 h-2 bg-nex-dark border-r border-b border-nex-cyan/20 rotate-45 -translate-y-1 mx-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Results {
  immediateLeak: number;
  recoveryPotential: number;
  eligibilityTaxReduction: number;
  totalQuietLoss: number;
  futureVisibilityRisk: number;
}

// Immediate Leak  = leads × 73% × (conv/100) × customerValue
// Recovery        = leads × (leakagePct/100) × (conv/100) × customerValue
// Eligibility Tax = adSpend × 20%
// Total Delta     = Recovery + Eligibility Tax
// Visibility Risk = Immediate Leak × 12
function calcResults(
  leads: number,
  customerValue: number,
  convRate: number,
  leakagePct: number,
  adSpend: number
): Results {
  const conv = convRate / 100;
  const immediateLeak = leads * 0.73 * conv * customerValue;
  const recoveryPotential = leads * (leakagePct / 100) * conv * customerValue;
  const eligibilityTaxReduction = adSpend * 0.20;
  const totalQuietLoss = recoveryPotential + eligibilityTaxReduction;
  const futureVisibilityRisk = immediateLeak * 12;
  return { immediateLeak, recoveryPotential, eligibilityTaxReduction, totalQuietLoss, futureVisibilityRisk };
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${Math.round(n)}`;
}

interface Props {
  onConsentChange?: (checked: boolean) => void;
}

const METRICS = [
  {
    key: 'immediateLeak' as keyof Results,
    label: 'Hidden Revenue Leakage',
    descriptor: 'immediate leak / month',
    color: 'text-red-400',
    bg: 'bg-red-500/5',
    border: 'border-red-500/15',
    legendColor: 'bg-red-400',
    legendLabel: 'Active loss',
    icon: TrendingDown,
    tip: 'Revenue lost each month due to operational gaps. Leads that entered your pipeline but were never properly followed up, routed, or converted due to response failures.',
  },
  {
    key: 'futureVisibilityRisk' as keyof Results,
    label: 'Future Visibility Risk',
    descriptor: 'annual unrecoverable exposure',
    color: 'text-amber-400',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/15',
    legendColor: 'bg-amber-400',
    legendLabel: 'Compounding risk',
    icon: AlertTriangle,
    tip: 'The annualised value of revenue permanently lost if current leakage rates continue. Unlike recoverable gaps, this represents compounding brand and pipeline invisibility that cannot be recaptured.',
  },
  {
    key: 'eligibilityTaxReduction' as keyof Results,
    label: 'Avoidable Acquisition Inefficiency',
    descriptor: 'marketing spend wasted / month',
    color: 'text-amber-400',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/15',
    legendColor: 'bg-amber-400',
    legendLabel: 'Compounding risk',
    icon: AlertTriangle,
    tip: 'The portion of your marketing spend compensating for downstream operational failures rather than generating genuine new demand. Estimated at ~20% of total ad spend based on industry benchmarks.',
  },
  {
    key: 'recoveryPotential' as keyof Results,
    label: 'Operational Response Gaps',
    descriptor: 'recoverable revenue / month',
    color: 'text-nex-cyan',
    bg: 'bg-nex-cyan/5',
    border: 'border-nex-cyan/15',
    legendColor: 'bg-nex-cyan',
    legendLabel: 'Recovery potential',
    icon: Zap,
    tip: 'Revenue that can realistically be reclaimed by improving lead handling, response times, and operational consistency, calculated from your recoverable leakage rate input.',
  },
];

function Narrative({ results, leads, customerValue, convRate, leakagePct, adSpend }: {
  results: Results;
  leads: number;
  customerValue: number;
  convRate: number;
  leakagePct: number;
  adSpend: number;
}) {
  const leakRatio = ((results.immediateLeak / (leads * convRate / 100 * customerValue)) * 100).toFixed(0);
  const recoveryRatio = ((results.totalQuietLoss / results.immediateLeak) * 100).toFixed(0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="max-w-5xl mx-auto mt-8"
    >
      <div className="bg-nex-navy/40 border border-white/8 rounded-2xl p-5 sm:p-8">
        <p className="font-inter text-nex-grey/85 text-xs uppercase tracking-widest mb-6">What this means for your business</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Leakage */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
              <span className="font-inter text-red-400 text-xs font-semibold uppercase tracking-wide">The leak</span>
            </div>
            <p className="font-inter text-nex-text text-sm leading-relaxed">
              Of your <span className="text-white font-semibold">{Number(leads).toLocaleString()} monthly leads</span>, an estimated{' '}
              <span className="text-red-400 font-semibold">{leakRatio}%</span> of your theoretical revenue is leaking through operational instability:{' '}
              <span className="text-white font-semibold">{fmt(results.immediateLeak)}/month</span> that never reaches your pipeline.
            </p>
            <p className="font-inter text-nex-grey/80 text-xs leading-relaxed mt-2">
              Left unaddressed, this compounds to{' '}
              <span className="text-amber-400 font-medium">{fmt(results.futureVisibilityRisk)}</span> in annual visibility you will never recover.
            </p>
          </div>

          {/* Acquisition waste */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="font-inter text-amber-400 text-xs font-semibold uppercase tracking-wide">The inefficiency</span>
            </div>
            <p className="font-inter text-nex-text text-sm leading-relaxed">
              Your <span className="text-white font-semibold">{fmt(adSpend)}/month</span> marketing budget carries an estimated{' '}
              <span className="text-amber-400 font-semibold">20% eligibility tax</span>, totalling{' '}
              <span className="text-white font-semibold">{fmt(results.eligibilityTaxReduction)}/month</span> spent compensating for downstream operational failures, not generating new demand.
            </p>
            <p className="font-inter text-nex-grey/80 text-xs leading-relaxed mt-2">
              This is not a marketing problem. It is a lead preservation problem.
            </p>
          </div>

          {/* Recovery */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-nex-cyan flex-shrink-0" />
              <span className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-wide">The opportunity</span>
            </div>
            <p className="font-inter text-nex-text text-sm leading-relaxed">
              Improving operational response to a conservative{' '}
              <span className="text-white font-semibold">{leakagePct}% recoverable rate</span> unlocks{' '}
              <span className="text-nex-cyan font-semibold">{fmt(results.recoveryPotential)}/month</span> in preserved revenue, plus{' '}
              <span className="text-nex-cyan font-semibold">{fmt(results.eligibilityTaxReduction)}/month</span> in reclaimed acquisition efficiency.
            </p>
            <p className="font-inter text-nex-grey/80 text-xs leading-relaxed mt-2">
              That's <span className="text-nex-cyan font-medium">{recoveryRatio}%</span> of your current leak converted into recoverable value through operational stability alone.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/8 flex items-start gap-3">
          <div className="w-1 h-full min-h-[2rem] bg-nex-cyan/30 rounded-full flex-shrink-0 self-stretch" />
          <p className="font-inter text-nex-grey/85 text-xs leading-relaxed italic">
            Small operational improvements across large interaction volumes create material financial recovery. These are indicative estimates based on industry benchmarks. Your QL Report provides a detailed breakdown specific to your business.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CalculateQuietLoss({ onConsentChange }: Props) {
  const [leadVolume, setLeadVolume] = useState('');
  const [customerValue, setCustomerValue] = useState('');
  const [conversionRate, setConversionRate] = useState('');
  const [leakagePct, setLeakagePct] = useState('');
  const [adSpend, setAdSpend] = useState('');
  const [emailConsent, setEmailConsent] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const canCalculate =
    leadVolume.trim() !== '' &&
    customerValue.trim() !== '' &&
    conversionRate.trim() !== '' &&
    leakagePct.trim() !== '' &&
    adSpend.trim() !== '';

  const handleCalculate = () => {
    if (!canCalculate) return;
    setResults(
      calcResults(
        parseFloat(leadVolume),
        parseFloat(customerValue),
        parseFloat(conversionRate),
        parseFloat(leakagePct),
        parseFloat(adSpend)
      )
    );
  };

  return (
    <section id="calculate-quiet-loss" className="section-divider relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nex-cyan/3 to-transparent pointer-events-none" />
      <div className="container-wide relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="font-inter inline-flex items-center gap-2 mb-4 px-4 py-1.5 border border-nex-cyan/30 rounded-full text-nex-cyan/80 text-sm font-medium">
            <Calculator size={14} />
            INTERACTIVE TOOL
          </div>
          <h2 className="font-urbanist text-4xl md:text-5xl font-bold text-white mb-4">
            Calculate Your Quiet Loss
          </h2>
          <div className="mb-5">
            <a
              href="#/case-example"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-nex-cyan/10 border border-nex-cyan/40 text-nex-cyan text-sm font-semibold hover:bg-nex-cyan/20 hover:border-nex-cyan/70 hover:shadow-glow-cyan transition-all duration-300 tracking-wide"
            >
              Example Calculation
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
          <ul className="font-inter text-nex-grey text-base space-y-1 list-none">
            {[
              'What is leaking now?',
              'What future invisibility costs?',
              'What realistic operational recovery looks like?',
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-center gap-2">
                <span className="text-nex-cyan font-semibold">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            viewport={{ once: true }}
            className="bg-nex-navy/60 border border-white/10 rounded-2xl p-5 sm:p-8"
          >
            <p className="font-inter text-nex-cyan font-bold text-base mb-5">
              5 core parameters.
            </p>
            <div className="space-y-2.5">
              {[
                {
                  label: '1. Monthly Lead Volume',
                  value: leadVolume, set: setLeadVolume, placeholder: 'e.g. 5000', unit: 'leads/mo',
                  tip: 'The total number of new enquiries, inbound contacts, or sales leads your business receives each month across all channels.',
                },
                {
                  label: '2. Average Customer Value',
                  value: customerValue, set: setCustomerValue, placeholder: 'e.g. 5000', unit: '$',
                  tip: 'The average revenue a single customer generates, either annually or over their lifetime. Use annual contract value (ACV) or LTV depending on your model.',
                },
                {
                  label: '3. Lead-to-Sale Conversion Rate',
                  value: conversionRate, set: setConversionRate, placeholder: 'e.g. 5', unit: '%',
                  tip: 'The percentage of your monthly leads that convert into paying customers. If 50 of 1,000 leads become customers, your rate is 5%.',
                },
                {
                  label: '4. Recoverable Leakage Rate',
                  value: leakagePct, set: setLeakagePct, placeholder: 'e.g. 15', unit: '%',
                  tip: 'Your conservative estimate of what % of leads could realistically be saved with better operational response. Industry benchmark for "quiet loss" is 73%; a 15% recovery target is considered conservative.',
                },
                {
                  label: '5. Monthly Marketing / Ad Spend',
                  value: adSpend, set: setAdSpend, placeholder: 'e.g. 50000', unit: '$',
                  tip: 'Total monthly spend on paid acquisition: ads, campaigns, lead generation. An estimated 20% of this is an "eligibility tax" compensating for operational gaps rather than generating genuine demand.',
                },
              ].map(({ label, value, set, placeholder, unit, tip }) => (
                <div key={label}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <label className="font-inter text-nex-text text-sm font-medium">{label}</label>
                    <InfoTooltip tip={tip} />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={value}
                      onChange={e => set(e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-nex-dark/60 border border-white/10 rounded-lg px-4 py-2 pr-14 text-white placeholder-nex-grey/70 text-sm focus:outline-none focus:border-nex-cyan/50 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-nex-grey/70 text-xs font-medium pointer-events-none">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCalculate}
              disabled={!canCalculate}
              className={`font-inter mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-lg transition-all duration-300 ${
                canCalculate
                  ? 'bg-nex-cyan text-nex-dark hover:bg-nex-cyan/90 cursor-pointer'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              Calculate My Quiet Loss
              <ChevronRight size={16} />
            </button>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            viewport={{ once: true }}
            className="bg-nex-navy/60 border border-white/10 rounded-2xl p-5 sm:p-8 flex flex-col"
          >
            {/* Colour legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-400 flex-shrink-0" />
                <span className="font-inter text-nex-grey/80 text-xs">Active loss</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-400 flex-shrink-0" />
                <span className="font-inter text-nex-grey/80 text-xs">Compounding risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-nex-cyan flex-shrink-0" />
                <span className="font-inter text-nex-grey/80 text-xs">Recovery potential</span>
              </div>
            </div>

            {/* Metric rows */}
            <div className="flex-1 space-y-2">
              {METRICS.map(({ key, label, descriptor, color, bg, border, tip }, i) => {
                const value = results ? fmt(results[key]) : null;
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border ${bg} ${border} transition-all duration-500`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className={`font-inter text-sm font-semibold leading-tight ${results ? 'text-nex-text' : 'text-nex-text/50'}`}>{label}</p>
                        <InfoTooltip tip={tip} />
                      </div>
                      <p className="font-inter text-nex-grey/70 text-xs mt-0.5">{descriptor}</p>
                    </div>
                    {value ? (
                      <motion.span
                        key={value}
                        initial={{ opacity: 0, scale: 0.8, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.07 }}
                        className={`font-urbanist ${color} font-bold text-xl tabular-nums ml-4 flex-shrink-0`}
                      >
                        {value}
                      </motion.span>
                    ) : (
                      <span className="font-urbanist text-white/12 font-bold text-xl ml-4 flex-shrink-0">-</span>
                    )}
                  </div>
                );
              })}

              {/* Total  - larger, always last, prominent */}
              {(() => {
                const value = results ? fmt(results.totalQuietLoss) : null;
                return (
                  <div className={`flex items-center justify-between px-5 py-4 rounded-xl border mt-3 transition-all duration-500 ${
                    results
                      ? 'bg-nex-cyan/10 border-nex-cyan/40'
                      : 'bg-nex-cyan/4 border-nex-cyan/15'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className={`font-inter text-base font-bold leading-tight ${results ? 'text-white' : 'text-white/40'}`}>
                          Realistic Recovery Opportunity
                        </p>
                        <InfoTooltip tip="The combined monthly value recoverable through improved operational response and reclaimed marketing efficiency. This is your realistic quiet loss delta: what better operational performance could return each month." />
                      </div>
                      <p className="font-inter text-nex-grey/70 text-xs mt-0.5">total quiet loss delta / month</p>
                    </div>
                    {value ? (
                      <motion.span
                        key={value}
                        initial={{ opacity: 0, scale: 0.75, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.35 }}
                        className="font-urbanist text-nex-cyan font-bold text-3xl tabular-nums ml-4 flex-shrink-0"
                      >
                        {value}
                      </motion.span>
                    ) : (
                      <span className="font-urbanist text-white/10 font-bold text-3xl ml-4 flex-shrink-0">-</span>
                    )}
                  </div>
                );
              })()}
            </div>

            {results && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="font-inter text-nex-grey/70 text-xs mt-4"
              >
                Indicative estimates based on industry benchmarks. Actual results vary.
              </motion.p>
            )}

            {/* Email consent */}
            <div className="mt-5 pt-5 border-t border-white/10">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailConsent}
                  onChange={e => {
                    setEmailConsent(e.target.checked);
                    onConsentChange?.(e.target.checked);
                    if (e.target.checked) {
                      document.getElementById('lets-connect')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="mt-0.5 accent-nex-cyan"
                />
                <span className="font-inter text-nex-grey text-sm leading-relaxed">
                  Email me a copy of my QL Report. Provide your contact details{' '}
                  <a
                    href="#lets-connect"
                    className="text-nex-cyan underline underline-offset-2 hover:text-nex-cyan/80 transition-colors"
                  >
                    below
                  </a>{' '}
                  and click <span className="text-white font-medium">Email Me My QL Report</span>.
                </span>
              </label>
            </div>
          </motion.div>
        </div>

        {/* Narrative  - appears below columns after calculate */}
        <AnimatePresence>
          {results && (
            <Narrative
              results={results}
              leads={parseFloat(leadVolume)}
              customerValue={parseFloat(customerValue)}
              convRate={parseFloat(conversionRate)}
              leakagePct={parseFloat(leakagePct)}
              adSpend={parseFloat(adSpend)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
