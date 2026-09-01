import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckSquare, Square, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const SEND_EMAIL_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ApplicationFormProps {
  qlEmailConsent?: boolean;
}

const participationItems = [
  'My business generates a minimum of $5M annual revenue (local currency).',
  'BETA participation is complimentary during the agreed BETA period.',
  'There is no disruption, interruption, or operational risk to existing business activities during deployment.',
  'Customer data remains fully owned and controlled by the customer at all times.',
  'NexFrontier works alongside existing systems and communication channels without requiring disruptive rebuilds, deep technical discovery, or operational interruption to begin validating value.',
  'Sovereignty Guarantee: Customer data remains owned and controlled by the customer. NexFrontier uses appropriate data protection, redaction, and controlled processing methods to ensure sensitive information is handled safely and independently.',
  'Participation does not create lock-in or remove the customer\'s operational independence.',
  'The purpose of BETA is to jointly validate measurable operational improvements and revenue recovery opportunities in live conditions.',
  'If the outcomes demonstrated during BETA materially align with the value proposition presented by NexFrontier, my business agrees to enter good-faith discussions regarding a potential ongoing commercial engagement.',
  'NexFrontier reserves the right to selectively onboard BETA participants based on operational suitability, readiness, and strategic alignment.',
];

const futureEngagementItems = ['Operational fit', 'Deployment readiness', 'Agreed commercial terms', 'Mutual alignment'];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
  viewport: { once: true },
});

export default function ApplicationFormContent({ qlEmailConsent = false }: ApplicationFormProps) {
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    revenue: '',
    yearsInOperation: '',
  });
  const [submitAction, setSubmitAction] = useState<'beta' | 'email' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [betaError, setBetaError] = useState(false);
  const [qlError, setQlError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormComplete = Object.values(formData).every((v) => v.trim() !== '');

  const handleSubmit = async (action: 'beta' | 'email') => {
    if (!isFormComplete) return;
    if (action === 'beta' && !agreed) return;
    if (action === 'email' && !qlEmailConsent) return;
    setBetaError(false);
    setQlError(false);
    setSubmitting(true);
    setSubmitAction(action);
    try {
      const { companyName: company, name, email, role, phone, revenue, yearsInOperation } = formData;
      const formSource = action === 'beta' ? 'beta-programme' : 'ql-report';
      const message =
        action === 'beta'
          ? `Company: ${company}\nRole: ${role}\nPhone: ${phone}\nRevenue: ${revenue}\nYears in Operation: ${yearsInOperation}`
          : `Role: ${role}\nPhone: ${phone}\nRevenue: ${revenue}\nYears in Operation: ${yearsInOperation}`;
      const res = await fetch(SEND_EMAIL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`,
          'Apikey': ANON_KEY,
        },
        body: JSON.stringify({ name, email, company, message, formSource }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      if (action === 'beta') setBetaError(true);
      else setQlError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'font-inter w-full px-4 py-3 bg-nex-navy/50 border border-nex-cyan/20 rounded-lg text-white placeholder-nex-grey/70 focus:border-nex-cyan focus:outline-none transition-colors text-sm';
  const labelClass = 'font-inter block text-white text-sm font-semibold mb-2';

  return (
    <div id="beta-access" className="max-w-4xl">

      {/* Subsection 4: Beta Application — Conditional Participation Understanding */}
      <motion.div {...fadeUp()} className="mb-10">
        <h3 className="font-urbanist text-2xl md:text-3xl font-bold text-white mb-1">
          <span className="text-white">Conditional Participation </span><span className="text-nex-cyan">Understanding</span>
        </h3>
        <p className="font-inter text-white font-bold text-sm leading-relaxed">
          Built to reduce risk and prove value first.
        </p>
      </motion.div>

      {/* Understanding summary banner */}
      <motion.div {...fadeUp(0.05)} className="mb-10 grid sm:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-nex-cyan/20 shadow-lg">
        {/* Left card */}
        <div className="relative p-7 bg-gradient-to-br from-nex-darker/80 to-nex-navy/60 flex flex-col gap-5">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-nex-cyan/60 via-nex-cyan/30 to-transparent rounded-l-2xl" />
          <div className="space-y-3">
            <p className="font-inter text-white font-semibold text-sm leading-relaxed">
              The principle is straightforward:
            </p>
            <p className="font-inter text-nex-grey text-sm leading-relaxed">
              If NexFrontier demonstrates measurable operational and revenue value during BETA, both parties acknowledge a good-faith intention to explore a longer-term commercial relationship after BETA completion.
            </p>
          </div>
          <div className="mt-auto pt-4 border-t border-white/8">
            <p className="font-inter text-nex-cyan/80 text-xs leading-relaxed">
              BETA onboarding is intentionally limited to ensure close operational collaboration with each Foundation Customer.
            </p>
          </div>
        </div>

        {/* Right card */}
        <div className="relative p-7 bg-gradient-to-br from-nex-cyan/8 to-nex-navy/40 flex flex-col gap-5 border-t sm:border-t-0 sm:border-l border-nex-cyan/15">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-px bg-nex-cyan/50" />
            <p className="font-inter text-nex-cyan/70 text-xs uppercase tracking-widest font-medium">This structure exists to</p>
          </div>
          <ul className="space-y-3 flex-1">
            {['Remove adoption risk', 'Prove value first', 'Avoid upfront commercial burden', 'Preserve customer sovereignty and flexibility'].map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-inter text-nex-grey text-sm">
                <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md bg-nex-cyan/15 border border-nex-cyan/25 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-nex-cyan" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.08)} className="mb-4">
        <p className="font-inter text-white font-bold text-sm leading-relaxed">
          By applying, participating businesses acknowledge and agree that:
        </p>
      </motion.div>

      {/* Participation items */}
      <motion.div {...fadeUp(0.05)} className="mb-6">
        <div className="grid sm:grid-cols-2 gap-1.5">
          {participationItems.map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.05 + i * 0.03)}
              className="flex items-start gap-3 px-4 py-2.5 bg-nex-navy/40 border border-nex-cyan/10 rounded-xl"
            >
              <span className="text-nex-cyan text-sm font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
              <p className="font-inter text-nex-grey text-sm leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>

        {/* Future engagement sub-list */}
        <motion.div
          {...fadeUp(0.05 + participationItems.length * 0.03)}
          className="p-4 bg-nex-navy/40 border border-nex-cyan/10 rounded-xl ml-3 sm:ml-6"
        >
          <p className="font-inter text-nex-grey text-sm leading-relaxed mb-3">
            <span className="text-white font-semibold">Any future commercial engagement remains subject to:</span>
          </p>
          <ul className="space-y-2">
            {futureEngagementItems.map((item, i) => (
              <li key={i} className="flex items-center gap-2 font-inter text-nex-grey text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-nex-cyan/60 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Acknowledgement checkbox */}
      <motion.div {...fadeUp(0.4)} className="mb-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={agreed}
          onClick={() => setAgreed((v) => !v)}
          className="flex items-start gap-3 group text-left w-full"
        >
          <span className="flex-shrink-0 mt-0.5 transition-colors duration-200" aria-hidden="true">
            {agreed
              ? <CheckSquare size={22} className="text-nex-cyan" />
              : <Square size={22} className="text-nex-grey/80 group-hover:text-nex-cyan/60 transition-colors" />}
          </span>
          <span className="font-inter text-sm leading-relaxed font-bold text-white">
            I acknowledge and agree to the Participation Understanding above.
          </span>
        </button>
        <p className="font-inter text-nex-grey/80 text-xs mt-2 pl-8">
          Foundation Customer placements are limited and subject to operational fit, readiness, and alignment.
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div {...fadeUp(0.45)} className="border-t border-white/8 my-12" />

      {/* Subsection 5: Let's Connect */}
      <motion.div {...fadeUp(0.5)} className="mb-10" id="lets-connect">
        <h3 className="font-urbanist text-2xl md:text-3xl font-bold text-white mb-1">
          Apply for BETA / <span className="text-nex-cyan">Email QL Report</span>
        </h3>
        <p className="font-inter text-nex-grey text-base leading-relaxed">
          Complete your details below to explore fit and next steps for BETA, or to receive QL Report by email.
        </p>
      </motion.div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-10 bg-gradient-to-br from-nex-cyan/10 to-nex-blue/5 border border-nex-cyan/40 rounded-2xl text-center"
        >
          <CheckCircle size={40} className="text-nex-cyan mx-auto mb-4" />
          <h3 className="font-urbanist text-nex-cyan text-2xl font-bold mb-3">
            {submitAction === 'email' ? 'Report On Its Way' : 'Application Received'}
          </h3>
          <p className="font-inter text-white text-base mb-2">
            {submitAction === 'email'
              ? 'Your Quiet Loss report will be emailed to you shortly.'
              : 'Thank you for applying to NexFrontier Foundation Customer BETA.'}
          </p>
          <p className="font-inter text-nex-grey text-sm">
            {submitAction === 'email'
              ? 'Our team will also follow up to discuss your results.'
              : "We'll review your application and be in touch shortly."}
          </p>
        </motion.div>
      ) : (
        <motion.div {...fadeUp(0.55)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your company"
              />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Real Estate, SaaS, Finance"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="First Lastname"
              />
            </div>
            <div>
              <label className={labelClass}>Role in Company</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputClass}
                placeholder="Founder, CEO, CTO, etc."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className={labelClass}>Direct Line / Mobile</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+64 21 000 0000"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Average Company Revenue</label>
              <select
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select annual revenue range</option>
                <option value="5m-10m">$5M – $10M</option>
                <option value="10m-20m">$10M – $20M</option>
                <option value="20m-50m">$20M – $50M</option>
                <option value="50m-100m">$50M – $100M</option>
                <option value="100m+">$100M+</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Years in Operation</label>
              <select
                name="yearsInOperation"
                value={formData.yearsInOperation}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select years in operation</option>
                <option value="1-3">1 – 3 years</option>
                <option value="4-10">4 – 10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-4 grid md:grid-cols-2 gap-4">
            {/* Apply for Beta */}
            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={agreed && isFormComplete && !submitting ? { scale: 1.02 } : {}}
                whileTap={agreed && isFormComplete && !submitting ? { scale: 0.98 } : {}}
                type="button"
                onClick={() => handleSubmit('beta')}
                disabled={!agreed || !isFormComplete || submitting}
                className={`font-inter w-full inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full transition-all duration-300 ${
                  agreed && isFormComplete && !submitting
                    ? 'bg-nex-cyan text-nex-dark hover:shadow-glow-cyan-lg cursor-pointer'
                    : 'bg-nex-cyan/20 text-nex-grey/70 cursor-not-allowed'
                }`}
              >
                {submitting && submitAction === 'beta'
                  ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                  : 'Submit Application for BETA Access'}
              </motion.button>
              {betaError && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <p className="font-inter text-red-400 text-xs">Something went wrong. Please try again.</p>
                </div>
              )}
              {!agreed && !betaError && (
                <p className="font-inter text-nex-grey text-xs text-center">
                  Acknowledge the{' '}
                  <a href="#beta-access" className="text-nex-cyan hover:underline">Participation Understanding</a>
                  {' '}above to unlock
                </p>
              )}
            </div>

            {/* Email QL Report */}
            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={qlEmailConsent && isFormComplete && !submitting ? { scale: 1.02 } : {}}
                whileTap={qlEmailConsent && isFormComplete && !submitting ? { scale: 0.98 } : {}}
                type="button"
                onClick={() => handleSubmit('email')}
                disabled={!qlEmailConsent || !isFormComplete || submitting}
                className={`font-inter w-full inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full border transition-all duration-300 ${
                  qlEmailConsent && isFormComplete && !submitting
                    ? 'border-nex-cyan/60 text-nex-cyan hover:bg-nex-cyan/10 cursor-pointer'
                    : 'border-white/10 text-nex-grey/70 cursor-not-allowed'
                }`}
              >
                {submitting && submitAction === 'email'
                  ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                  : 'Email Me My QL Report'}
              </motion.button>
              {qlError && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <p className="font-inter text-red-400 text-xs">Something went wrong. Please try again.</p>
                </div>
              )}
              {!qlEmailConsent && !qlError && (
                <p className="font-inter text-nex-grey text-xs text-center">
                  Tick{' '}
                  <a href="#calculate-quiet-loss" className="text-nex-cyan hover:underline">"Email me a copy of my QL Report"</a>
                  {' '}above to unlock
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
