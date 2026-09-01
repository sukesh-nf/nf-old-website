import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, AlertCircle, Eye, Zap, TrendingDown, Target } from 'lucide-react';
import { useMeta } from '../lib/useMeta';

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-white/6" />;
}

function BulletList({ items, accent = false }: { items: string[]; accent?: boolean }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className={`mt-[7px] block w-1 h-1 rounded-full shrink-0 ${accent ? 'bg-nex-cyan' : 'bg-nex-grey/40'}`} />
          <span className={`font-inter text-sm leading-relaxed ${accent ? 'text-nex-cyan font-medium' : 'text-nex-grey'}`}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const STAGES = [
  {
    number: '01',
    icon: Zap,
    color: 'text-nex-cyan',
    border: 'border-nex-cyan/20',
    bg: 'bg-nex-cyan/5',
    label: 'AI Creates the Opportunity',
    body: `Rather than searching endlessly online, the customer consulted an AI assistant for recommendations. The AI assessed publicly available signals including service offering, apparent capability, customer reputation, geographic proximity, and publicly available information. One provider emerged as the preferred recommendation. The customer had never previously heard of the business. Without AI, this organisation would almost certainly never have entered the customer's consideration set.`,
    insight: 'The AI had effectively generated a completely new, high-intent customer. Marketing had already succeeded.',
  },
  {
    number: '02',
    icon: Target,
    color: 'text-blue-400',
    border: 'border-blue-400/20',
    bg: 'bg-blue-400/5',
    label: 'Demand Arrives',
    body: `The customer visited the company's website. Two enquiry forms appeared relevant. Uncertain which pathway was appropriate, the customer completed both. This was not indecision. It was a genuine attempt to ensure the enquiry reached the right person. The customer expected acknowledgement, clarification if required, an inspection quotation, and a discussion to understand the problem.`,
    insight: null,
  },
  {
    number: '03',
    icon: AlertCircle,
    color: 'text-amber-400',
    border: 'border-amber-400/20',
    bg: 'bg-amber-400/5',
    label: 'The Operating System Breaks Down',
    body: `An automated acknowledgement was received. Nothing else happened. Eight days passed. The customer eventually contacted the company again. Instead of receiving a telephone call, diagnostic discussion or inspection proposal, they received a generic written response. The email suggested possible causes and recommended purchasing traps before considering a broad treatment.`,
    insight: 'No one attempted to understand the context. No one recognised this was no longer a routine enquiry. No one took ownership.',
  },
  {
    number: '04',
    icon: TrendingDown,
    color: 'text-red-400',
    border: 'border-red-400/20',
    bg: 'bg-red-400/5',
    label: 'The Outcome',
    body: `The customer abandoned the provider immediately and sought another business. From the organisation's perspective, this probably appeared insignificant. An enquiry was acknowledged. No sale occurred. The customer moved on. Internally, this may have been recorded as nothing more than an unconverted lead.`,
    insight: 'In reality, something far more valuable had been lost.',
  },
];

export default function TrueCase() {
  useMeta({
    title: 'A True Case | NexFrontier',
    description: 'A true customer journey showing how AI-mediated demand was created, lost, and why traditional metrics never reveal the real cost.',
  });

  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.04),transparent_60%)] pointer-events-none" />

      <div className="container-wide relative py-16 md:py-24">
        {/* Back nav */}
        <motion.div {...fade(0)} className="mb-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-nex-grey hover:text-nex-cyan transition-colors duration-200 text-sm font-inter"
          >
            <ArrowLeft size={14} />
            Back to NexFrontier
          </a>
        </motion.div>

        <div className="max-w-2xl">

          {/* Lede */}
          <motion.div {...fade(0.05)} className="mb-10 space-y-4">
            <p className="font-inter text-nex-cyan text-sm font-semibold uppercase tracking-widest">A True Case Study</p>
            <h1 className="font-urbanist text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              The Customer Was Already Won.<br />
              <span className="text-nex-cyan">The Business Just Didn't Know It.</span>
            </h1>
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              Millions of businesses lose customers exactly like this every day. This case shows, step by step, where the opportunity was created, where it was lost, and why traditional business metrics never reveal the true cost.
            </p>
          </motion.div>

          <Divider />

          {/* Disclaimer */}
          <motion.div {...fade(0.08)} className="my-8 px-5 py-4 bg-nex-navy/50 border border-white/8 rounded-xl">
            <p className="font-inter text-nex-grey/80 text-sm leading-relaxed">
              The names of the organisations involved have been deliberately omitted. The purpose of this case is not to criticise an individual business, but to demonstrate how operational readiness is becoming a strategic capability in an AI-mediated economy. Every interaction described below occurred exactly as experienced.
            </p>
          </motion.div>

          <Divider />

          {/* Background */}
          <motion.div {...fade(0.1)} className="my-10 space-y-4">
            <SectionLabel>Background</SectionLabel>
            <h2 className="font-urbanist text-white font-bold text-xl md:text-2xl leading-snug">
              A customer was experiencing a persistent pest problem.
            </h2>
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              Over several weeks they had already completed DIY treatment, purchased and used insect control products, vacuumed extensively, hot-washed bedding, encased the mattress, and researched possible causes. The obvious solutions had failed.
            </p>
            <p className="font-inter text-nex-text text-base leading-relaxed">
              The customer was no longer looking for generic advice. They were looking for an expert capable of diagnosing an unusual problem. This was not a price-shopping exercise. The customer had already decided to engage a professional.
            </p>
            <div className="px-5 py-4 bg-nex-cyan/5 border border-nex-cyan/20 rounded-xl">
              <p className="font-urbanist text-white font-bold text-base leading-snug">
                The only remaining question was: who appears most capable of solving this problem?
              </p>
            </div>
          </motion.div>

          <Divider />

          {/* Stages */}
          <div className="my-10 space-y-6">
            <SectionLabel>The Journey, Stage by Stage</SectionLabel>
            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <motion.div key={stage.number} {...fade(0.12 + i * 0.05)}>
                  <div className={`rounded-xl border ${stage.border} ${stage.bg} p-5 space-y-3`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-nex-dark/60 border ${stage.border}`}>
                        <Icon size={16} className={stage.color} />
                      </div>
                      <div>
                        <p className={`font-inter text-[10px] font-semibold uppercase tracking-widest ${stage.color} mb-0.5`}>Stage {stage.number}</p>
                        <p className="font-urbanist text-white font-bold text-base leading-snug">{stage.label}</p>
                      </div>
                    </div>
                    <p className="font-inter text-nex-grey text-sm leading-relaxed">{stage.body}</p>
                    {stage.insight && (
                      <p className={`font-inter text-sm font-semibold leading-relaxed ${stage.color}`}>{stage.insight}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Divider />

          {/* What was lost */}
          <motion.div {...fade(0.35)} className="my-10 space-y-5">
            <SectionLabel>What Was Actually Lost</SectionLabel>
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              The organisation did not simply lose an inspection fee. It lost:
            </p>
            <BulletList items={[
              'a completely new customer',
              'immediate revenue',
              'future repeat business',
              'referrals',
              'positive reviews',
              'long-term trust',
              'future AI recommendation confidence',
            ]} accent />
            <div className="px-5 py-4 bg-nex-navy/50 border border-white/8 rounded-xl">
              <p className="font-inter text-nex-grey/85 text-sm leading-relaxed">
                The customer subsequently discussed the experience with AI, reducing confidence that the organisation would be recommended again for similar situations. The loss therefore extended well beyond today's opportunity. It reduced tomorrow's eligibility.
              </p>
            </div>
          </motion.div>

          <Divider />

          {/* Invisible opportunity */}
          <motion.div {...fade(0.38)} className="my-10 space-y-4">
            <SectionLabel>The Invisible Opportunity</SectionLabel>
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              The business never saw the majority of the customer's decision journey. It never knew:
            </p>
            <BulletList items={[
              'AI had shortlisted it.',
              'AI had recommended it above competitors.',
              'The customer had already committed to engaging a professional.',
              'The customer was highly motivated to purchase.',
              'The customer was not comparing prices.',
              'The customer simply wanted confidence that someone would solve the problem.',
            ]} />
            <p className="font-urbanist text-white font-bold text-lg leading-snug">
              The organisation saw only the enquiry. It never saw the decision that had already been made before the enquiry arrived.
            </p>
          </motion.div>

          <Divider />

          {/* Where it failed */}
          <motion.div {...fade(0.4)} className="my-10 space-y-5">
            <SectionLabel>Where Operational Readiness Failed</SectionLabel>
            <div className="space-y-3">
              {[
                { title: 'Signal Recognition', body: 'The enquiry clearly demonstrated that the customer had progressed beyond routine advice. The organisation processed it as a standard treatment request.' },
                { title: 'Journey Recognition', body: 'Submitting two enquiry forms should have increased confidence that this was a serious customer seeking help. Instead, the duplication added no value and no escalation.' },
                { title: 'Pipeline Continuity', body: 'Automation acknowledged demand. Operations failed to continue the journey. The customer effectively disappeared inside the operating system.' },
                { title: 'Human Escalation', body: 'After eight days, the appropriate response was a conversation. Instead, the customer received another generic response.' },
                { title: 'Resolution Orientation', body: 'The organisation answered the stated question. It did not solve the customer\'s underlying problem. There is a profound difference.' },
              ].map((item) => (
                <div key={item.title} className="px-5 py-4 bg-nex-navy/40 border border-white/6 rounded-xl">
                  <p className="font-inter text-nex-cyan text-xs font-semibold uppercase tracking-wide mb-1.5">{item.title}</p>
                  <p className="font-inter text-nex-grey text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <Divider />

          {/* Strategic insight */}
          <motion.div {...fade(0.42)} className="my-10 space-y-4">
            <SectionLabel>The Strategic Insight</SectionLabel>
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              Many businesses believe growth problems begin with marketing. This case demonstrates something very different.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Already succeeded', item: 'Marketing' },
                { label: 'Already occurred', item: 'Discovery' },
                { label: 'Already established', item: 'Trust' },
                { label: 'Already arrived', item: 'Demand' },
              ].map(({ label, item }) => (
                <div key={item} className="px-5 py-4 bg-nex-navy/50 border border-nex-cyan/10 rounded-xl flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-nex-cyan flex-shrink-0" />
                  <div>
                    <p className="font-inter text-nex-cyan text-sm font-semibold">{item}</p>
                    <p className="font-inter text-nex-grey/70 text-sm">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-5 bg-nex-cyan/5 border border-nex-cyan/25 rounded-xl">
              <p className="font-urbanist text-white font-bold text-lg leading-snug">
                The failure occurred after discovery.
              </p>
              <p className="font-inter text-nex-grey text-sm leading-relaxed mt-2">
                The constraint to growth was no longer marketing. The constraint was the operating system responsible for receiving, interpreting and progressing demand.
              </p>
            </div>
          </motion.div>

          <Divider />

          {/* NexFrontier perspective */}
          <motion.div {...fade(0.44)} className="my-10 space-y-4">
            <SectionLabel>The NexFrontier Perspective</SectionLabel>
            <div className="space-y-3">
              <div className="px-5 py-4 bg-nex-navy/40 border border-white/6 rounded-xl">
                <p className="font-inter text-nex-grey/70 text-xs uppercase tracking-widest mb-2">Traditional thinking asks</p>
                <p className="font-inter text-nex-text text-sm italic">"How do we improve customer service?"</p>
              </div>
              <div className="px-5 py-4 bg-nex-cyan/5 border border-nex-cyan/25 rounded-xl">
                <p className="font-inter text-nex-cyan text-xs uppercase tracking-widest mb-2">NexFrontier asks</p>
                <p className="font-inter text-white text-sm font-semibold">"How do we ensure that high-intent demand survives every operational handoff?"</p>
              </div>
            </div>
            <p className="font-inter text-nex-grey text-sm leading-relaxed">
              The opportunity was not lost because the business lacked visibility. It was not lost because of price. It was not lost because of capability. It was lost because operational readiness failed to convert opportunity into confidence. This is precisely the problem NexFrontier exists to solve.
            </p>
          </motion.div>

          <Divider />

          {/* AI-mediated demand */}
          <motion.div {...fade(0.46)} className="my-10 space-y-4">
            <SectionLabel>AI-Mediated Demand Changes Everything</SectionLabel>
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              In the emerging economy, customers will increasingly rely on AI agents to identify, compare and recommend businesses. Businesses will increasingly be evaluated long before a human contacts them.
            </p>
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              Equally important, AI systems will learn from outcomes. When organisations consistently demonstrate responsiveness, clarity, ownership and resolution, confidence increases. When demand repeatedly disappears into operational gaps, confidence declines.
            </p>
            <p className="font-urbanist text-white font-bold text-xl leading-snug">
              Visibility alone will no longer determine growth.<br />
              <span className="text-nex-cyan">Eligibility will.</span>
            </p>
          </motion.div>

          <Divider />

          {/* Closing */}
          <motion.div {...fade(0.48)} className="my-10 space-y-4">
            <SectionLabel>The New Competitive Advantage</SectionLabel>
            <p className="font-inter text-nex-grey text-base leading-relaxed">
              Marketing generated the opportunity. Operations determined whether the opportunity survived. Operational readiness is therefore no longer simply an internal efficiency initiative. It becomes a competitive advantage.
            </p>
            <p className="font-inter text-nex-grey text-sm leading-relaxed">
              Being recommended is only the first hurdle. Remaining worthy of recommendation is the ongoing challenge. Businesses will increasingly compete not only for human trust, but also for machine confidence.
            </p>
            <div className="px-5 py-5 bg-nex-navy/50 border border-white/8 rounded-xl">
              <p className="font-inter text-nex-grey/85 text-sm leading-relaxed italic">
                The organisations that consistently receive, understand, prioritise and resolve demand will become increasingly eligible to both humans and AI. Those that do not may never know what they lost, because the greatest opportunities often disappear before they are ever measured.
              </p>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div {...fade(0.5)} className="pt-4 flex flex-col sm:flex-row gap-4">
            <a
              href="/#calculate-quiet-loss"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-nex-cyan text-nex-dark font-inter font-semibold rounded-full hover:shadow-glow-cyan-lg hover:scale-105 transition-all duration-300 text-sm"
            >
              Calculate Your Quiet Loss
              <ArrowRight size={14} />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-nex-cyan/40 text-nex-cyan font-inter font-semibold rounded-full hover:bg-nex-cyan/10 transition-all duration-300 text-sm"
            >
              <ArrowLeft size={14} />
              Back to NexFrontier
            </a>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
