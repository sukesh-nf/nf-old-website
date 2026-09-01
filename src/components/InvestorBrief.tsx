import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-application`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const REFERRAL_OPTIONS = [
  'Word of Mouth',
  'Email from Us',
  'Social Media',
  'News / Press / Interview',
  'Events',
  'Other',
] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
  viewport: { once: true },
});

const fieldClass =
  'w-full px-4 py-2.5 bg-nex-navy/60 border border-white/10 rounded-lg text-nex-text text-sm placeholder-nex-grey/60 focus:border-nex-cyan/50 focus:bg-nex-navy/80 focus:outline-none transition-all duration-200 appearance-none';

const labelClass = 'block font-inter text-nex-grey text-[11px] uppercase tracking-widest mb-1.5';

export default function InvestorBrief() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [phone, setPhone] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [referralOther, setReferralOther] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const effectiveReferral = referralSource === 'Other' ? referralOther.trim() || 'Other' : referralSource;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: dbError } = await supabase
      .from('investor_brief_requests')
      .insert({
        name: name.trim(),
        email: email.trim(),
        organisation: organisation.trim() || null,
        phone: phone.trim(),
        referral_source: effectiveReferral || null,
      });

    setLoading(false);

    if (dbError) {
      setError('Something went wrong. Please try again.');
      return;
    }

    fetch(EDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'Apikey': ANON_KEY,
      },
      body: JSON.stringify({
        action: 'investor-brief',
        companyName: organisation.trim(),
        industry: '',
        name: name.trim(),
        role: '',
        email: email.trim(),
        phone: phone.trim(),
        revenue: '',
        referralSource: effectiveReferral,
      }),
    }).catch(() => { /* silent */ });

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setOrganisation('');
      setPhone('');
      setReferralSource('');
      setReferralOther('');
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section className="section-divider relative pb-2 md:pb-4 lg:pb-6" id="investor-brief">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nex-cyan/5 to-transparent" />
      <div className="container-wide relative">
        <motion.div {...fadeUp()}>
          <div className="flex flex-col md:flex-row md:items-start md:gap-12">
            {/* Left: heading + deck items */}
            <div className="md:flex-1">
              <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest mb-3">Investment</p>
              <h2 className="font-urbanist text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                <span className="text-white">Investor Brief</span>
              </h2>
              <p className="font-inter text-nex-grey text-sm max-w-lg mb-5 leading-relaxed">
                For investors, strategic partners, and board members seeking deep insight into the operational infrastructure opportunity.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {[
                  {
                    number: '1',
                    title: 'Opportunity',
                    question: 'Why does this category need to exist now?',
                    items: ['TAM/SAM/SOM analysis', 'Industry timing & tailwinds', 'AI-era and market shift'],
                  },
                  {
                    number: '2',
                    title: 'Competitive Advantage',
                    question: 'Why existing monitoring, CRM, RevOps and automation platforms not solve it?',
                    items: ['Competitive positioning', 'Technology differentiators', 'Defensibility & moat analysis'],
                  },
                  {
                    number: '3',
                    title: 'Execution',
                    question: 'What is being validated through the Foundation Customer programme?',
                    items: ['Go-to-market strategy', 'Execution leadership capability', 'Product roadmap & milestones'],
                  },
                  {
                    number: '4',
                    title: 'Investment',
                    question: 'What becomes proprietary and more valuable with each deployment?',
                    items: ['Financial projections', 'Funding & use of capital', 'Return scenarios & exit paths'],
                  },
                ].map((cat) => (
                  <div key={cat.number} className="space-y-1">
                    <div className="mb-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-urbanist text-nex-cyan text-sm font-bold shrink-0">{cat.number}.</span>
                        <span className="font-urbanist text-white text-base font-semibold leading-tight">{cat.title}</span>
                      </div>
                      {cat.number === '1' ? (
                        <a
                          href="#/investor-q1"
                          className="font-inter text-nex-grey/70 text-sm italic pl-3.5 leading-tight hover:text-nex-cyan transition-colors duration-200 underline underline-offset-2 decoration-nex-cyan/30 hover:decoration-nex-cyan block"
                        >
                          {cat.question}
                        </a>
                      ) : cat.number === '2' ? (
                        <a
                          href="#/investor-q2"
                          className="font-inter text-nex-grey/70 text-sm italic pl-3.5 leading-tight hover:text-nex-cyan transition-colors duration-200 underline underline-offset-2 decoration-nex-cyan/30 hover:decoration-nex-cyan block"
                        >
                          {cat.question}
                        </a>
                      ) : cat.number === '3' ? (
                        <a
                          href="#/investor-q3"
                          className="font-inter text-nex-grey/70 text-sm italic pl-3.5 leading-tight hover:text-nex-cyan transition-colors duration-200 underline underline-offset-2 decoration-nex-cyan/30 hover:decoration-nex-cyan block"
                        >
                          {cat.question}
                        </a>
                      ) : (
                        <a
                          href="#/investor-q4"
                          className="font-inter text-nex-grey/70 text-sm italic pl-3.5 leading-tight hover:text-nex-cyan transition-colors duration-200 underline underline-offset-2 decoration-nex-cyan/30 hover:decoration-nex-cyan block"
                        >
                          {cat.question}
                        </a>
                      )}
                    </div>
                    <ul className="space-y-0.5 pl-3 border-l border-nex-cyan/20">
                      {cat.items.map((item, i) => (
                        <li key={i} className="flex gap-1.5 font-inter text-nex-grey text-sm leading-snug">
                          <span className="text-nex-cyan flex-shrink-0 text-sm mt-0.5">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form card — top-aligned with left content */}
            <motion.div {...fadeUp(0.15)} className="md:w-[340px] mt-8 md:mt-0 shrink-0">
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent shadow-xl overflow-hidden">
                {/* Cyan top accent */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nex-cyan/40 to-transparent" />

                {/* Card header */}
                <div className="px-6 pt-5 pb-4 border-b border-white/6">
                  <h3 className="font-urbanist text-white text-[15px] font-bold tracking-tight">Request the Investor Brief</h3>
                  <p className="font-inter text-nex-grey/90 text-xs mt-0.5">Delivered to your inbox within 24 hours.</p>
                </div>

                {/* Card body */}
                <div className="px-6 pb-6 pt-4">
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSubmit}
                        className="space-y-3"
                      >
                        {/* Full name */}
                        <div>
                          <label className={labelClass}>
                            Full Name <span className="text-nex-cyan">*</span>
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Salim Ismail"
                            className={fieldClass}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className={labelClass}>
                            Email Address <span className="text-nex-cyan">*</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@fund.com"
                            className={fieldClass}
                          />
                        </div>

                        {/* Organisation + Phone */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className={labelClass}>
                              Organisation
                            </label>
                            <input
                              type="text"
                              value={organisation}
                              onChange={(e) => setOrganisation(e.target.value)}
                              placeholder="Fund / Firm"
                              className={fieldClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              Phone <span className="text-nex-cyan">*</span>
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                              placeholder="+64 ..."
                              className={fieldClass}
                            />
                          </div>
                        </div>

                        {/* How do you know us */}
                        <div>
                          <label className={labelClass}>
                            How Do You Know Us? <span className="text-nex-cyan">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={referralSource}
                              onChange={(e) => { setReferralSource(e.target.value); setReferralOther(''); }}
                              required
                              className={`${fieldClass} pr-9 cursor-pointer ${!referralSource ? 'text-nex-grey/35' : 'text-nex-text'}`}
                            >
                              <option value="" disabled className="bg-nex-darker text-nex-grey/60">Select a source…</option>
                              {REFERRAL_OPTIONS.map((opt) => (
                                <option key={opt} value={opt} className="bg-nex-darker text-nex-text">{opt}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-nex-grey/40" />
                          </div>

                          {/* "Other" expansion */}
                          <AnimatePresence>
                            {referralSource === 'Other' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <input
                                  type="text"
                                  value={referralOther}
                                  onChange={(e) => setReferralOther(e.target.value)}
                                  placeholder="Please tell us how…"
                                  className={fieldClass}
                                  autoFocus
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="pt-1">
                          {error && <p className="font-inter text-red-400 text-xs mb-2">{error}</p>}
                          <motion.button
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            type="submit"
                            disabled={loading}
                            className="font-inter w-full px-6 py-2.5 bg-nex-cyan text-nex-dark font-bold text-sm rounded-xl hover:shadow-glow-cyan-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending…
                              </>
                            ) : 'Request Investor Brief'}
                          </motion.button>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="py-8 text-center space-y-3"
                      >
                        <div className="w-12 h-12 rounded-full bg-nex-cyan/15 border border-nex-cyan/30 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6 text-nex-cyan" />
                        </div>
                        <div>
                          <h4 className="font-urbanist text-white font-semibold text-base mb-1">Brief Requested</h4>
                          <p className="font-inter text-nex-grey text-sm">Thanks, {name}.</p>
                          <p className="font-inter text-nex-grey/55 text-xs mt-1">Check {email} — we'll be in touch shortly.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
