import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Calendar, Download, FileText, ExternalLink } from 'lucide-react';
import { useMeta } from '../lib/useMeta';
import { useJsonLd } from '../lib/useJsonLd';

const GARTNER_REPORT_URL = 'https://wufxwblizgnizssdejhn.supabase.co/storage/v1/object/public/reports/gartner-business-quarterly-q2-2026-monetising-ai-autonomous-business.pdf';
const MCKINSEY_REPORT_URL = 'https://www.mckinsey.com/about-us/social-responsibility/2025-sustainable-inclusive-growth-report?cid=sig26-soc-lkn-mbm-b-sig26-glb-ip-mbm';

function ReportDownloadCard() {
  return (
    <div className="my-8 rounded-2xl border border-nex-cyan/25 bg-gradient-to-br from-nex-navy/80 to-nex-darker/80 overflow-hidden shadow-[0_0_0_1px_rgba(0,212,255,0.06),0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="px-6 py-5 flex items-start gap-4">
        <div className="shrink-0 mt-0.5 w-12 h-12 rounded-xl bg-nex-cyan/10 border border-nex-cyan/20 flex items-center justify-center">
          <FileText size={20} className="text-nex-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-nex-cyan/10 border border-nex-cyan/20 font-inter text-nex-cyan text-[10px] font-bold uppercase tracking-widest mb-2">
            Gartner Report
          </span>
          <h4 className="font-urbanist text-white font-bold text-base leading-snug mb-1">
            Gartner Business Quarterly Q2-2026
          </h4>
          <p className="font-inter text-nex-grey text-sm leading-relaxed mb-4">
            Monetising AI with Autonomous Business. Gartner's analysis of how organisations increase machine and human autonomy to create measurable commercial value.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={GARTNER_REPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-nex-cyan text-nex-dark font-inter font-bold text-sm rounded-full hover:shadow-[0_0_18px_rgba(0,212,255,0.45)] active:scale-95 transition-all duration-200"
            >
              <Download size={14} />
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function McKinseyReportCard() {
  return (
    <div className="my-8 rounded-2xl border border-nex-cyan/25 bg-gradient-to-br from-nex-navy/80 to-nex-darker/80 overflow-hidden shadow-[0_0_0_1px_rgba(0,212,255,0.06),0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="px-6 py-5 flex items-start gap-4">
        <div className="shrink-0 mt-0.5 w-12 h-12 rounded-xl bg-nex-cyan/10 border border-nex-cyan/20 flex items-center justify-center">
          <FileText size={20} className="text-nex-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-nex-cyan/10 border border-nex-cyan/20 font-inter text-nex-cyan text-[10px] font-bold uppercase tracking-widest mb-2">
            McKinsey Report
          </span>
          <h4 className="font-urbanist text-white font-bold text-base leading-snug mb-1">
            McKinsey 2025 Sustainable &amp; Inclusive Growth Impact Report
          </h4>
          <p className="font-inter text-nex-grey text-sm leading-relaxed mb-4">
            McKinsey's exploration of jobs, skills, inclusion, adaptability, and workforce participation in a rapidly changing economy.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={MCKINSEY_REPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-nex-cyan text-nex-dark font-inter font-bold text-sm rounded-full hover:shadow-[0_0_18px_rgba(0,212,255,0.45)] active:scale-95 transition-all duration-200"
            >
              <ExternalLink size={14} />
              Read Report
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function HbrLinkCard() {
  return (
    <div className="my-8 rounded-2xl border border-nex-cyan/25 bg-gradient-to-br from-nex-navy/80 to-nex-darker/80 overflow-hidden shadow-[0_0_0_1px_rgba(0,212,255,0.06),0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="px-6 py-5 flex items-start gap-4">
        <div className="shrink-0 mt-0.5 w-12 h-12 rounded-xl bg-nex-cyan/10 border border-nex-cyan/20 flex items-center justify-center">
          <FileText size={20} className="text-nex-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-nex-cyan/10 border border-nex-cyan/20 font-inter text-nex-cyan text-[10px] font-bold uppercase tracking-widest mb-2">
            Harvard Business Review
          </span>
          <h4 className="font-urbanist text-white font-bold text-base leading-snug mb-1">
            Ensure Feedback Leads to Learning
          </h4>
          <p className="font-inter text-nex-grey text-sm leading-relaxed mb-4">
            Harvard Business Review's guidance on making feedback specific, grounded in observable behaviour, and focused on improvement rather than defensiveness.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://hbr.org/tip/2026/07/ensure-feedback-leads-to-learning"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-nex-cyan text-nex-dark font-inter font-bold text-sm rounded-full hover:shadow-[0_0_18px_rgba(0,212,255,0.45)] active:scale-95 transition-all duration-200"
            >
              <ExternalLink size={14} />
              Read Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagementBottleneckDiagram() {
  return (
    <figure className="my-12 overflow-hidden rounded-3xl border border-nex-cyan/65 bg-[#0b2032] shadow-[0_0_0_1px_rgba(0,212,255,0.18),0_0_30px_rgba(0,212,255,0.12),0_24px_70px_rgba(0,0,0,0.4)]">
      <div className="relative px-5 pb-7 pt-6 sm:px-8 sm:pb-9 sm:pt-8">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-nex-cyan/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-inter text-[10px] font-bold uppercase tracking-[0.24em] text-nex-cyan">The operating model changes</p>
            <figcaption className="font-urbanist text-2xl font-bold leading-tight text-white sm:text-3xl">The New Management Bottleneck</figcaption>
          </div>
          <span className="rounded-full border border-amber-300/55 bg-amber-300/16 px-3 py-1.5 font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100">Attention becomes scarce</span>
        </div>
        <div className="relative mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="rounded-2xl border border-white/25 bg-white/[0.09] p-5">
            <div className="mb-5 flex items-center justify-between"><span className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-nex-grey">Before AI</span><span className="font-urbanist text-2xl font-bold text-white">1×</span></div>
            <div className="space-y-2">
              {['People produce', 'Managers review', 'Decisions move'].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/[0.08] px-3 py-2.5 font-inter text-sm text-nex-text"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-nex-grey">{index + 1}</span>{step}</div>)}
            </div>
          </div>
          <div className="flex items-center justify-center py-1 text-3xl font-light text-nex-cyan md:py-0" aria-hidden="true">→</div>
          <div className="relative rounded-2xl border border-nex-cyan/75 bg-nex-cyan/[0.16] p-5 shadow-[0_0_34px_rgba(0,212,255,0.22)]">
            <div className="mb-5 flex items-center justify-between"><span className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-nex-cyan">After AI</span><span className="font-urbanist text-2xl font-bold text-nex-cyan">∞</span></div>
            <div className="space-y-2">
              {['AI-assisted people', 'Exponentially more output', 'Same manager attention'].map((step, index) => <div key={step} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 font-inter text-sm ${index === 2 ? 'border-amber-300/40 bg-amber-300/10 text-amber-100' : 'border-nex-cyan/45 bg-nex-cyan/[0.14] text-white'}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${index === 2 ? 'bg-amber-300/20 text-amber-100' : 'bg-nex-cyan/20 text-nex-cyan'}`}>{index + 1}</span>{step}</div>)}
            </div>
          </div>
        </div>
        <div className="relative mt-5 flex items-center gap-3 rounded-xl border border-amber-300/55 bg-gradient-to-r from-amber-300/[0.10] to-amber-300/[0.20] px-4 py-3"><span className="h-2 w-2 shrink-0 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]" /><p className="font-inter text-sm font-semibold text-amber-100">AI scales output. Human judgement does not.</p></div>
      </div>
    </figure>
  );
}

function AttentionBottleneckDiagram() {
  const steps = ['AI', 'More output', 'More decisions'];
  return (
    <figure className="my-12 overflow-hidden rounded-3xl border border-nex-cyan/65 bg-[#0b2032] shadow-[0_0_0_1px_rgba(0,212,255,0.18),0_0_30px_rgba(0,212,255,0.12),0_24px_70px_rgba(0,0,0,0.4)]">
      <div className="relative px-5 pb-7 pt-6 sm:px-8 sm:pb-9 sm:pt-8">
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
        <p className="relative mb-2 font-inter text-[10px] font-bold uppercase tracking-[0.24em] text-nex-cyan">Where the constraint moves</p>
        <figcaption className="relative max-w-xl font-urbanist text-2xl font-bold leading-tight text-white sm:text-3xl">AI Does Not Create the Bottleneck</figcaption>
        <div className="relative mt-9 grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1.35fr] md:items-center">
          {steps.map((step, index) => <div key={step} className="contents"><div className="rounded-2xl border border-nex-cyan/55 bg-nex-cyan/[0.16] px-4 py-5 text-center font-urbanist text-lg font-bold text-white">{step}</div>{index < steps.length - 1 && <span className="hidden text-center text-2xl text-nex-cyan md:block" aria-hidden="true">→</span>}{index === steps.length - 1 && <span className="hidden text-center text-2xl text-nex-cyan md:block" aria-hidden="true">→</span>}</div>)}
          <div className="rounded-2xl border border-amber-300/50 bg-amber-300/10 px-4 py-5 text-center font-urbanist text-lg font-bold text-amber-100 shadow-[0_0_24px_rgba(252,211,77,0.12)]">Limited human attention</div>
        </div>
        <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/22 bg-white/[0.08] p-3"><p className="font-inter text-[10px] uppercase tracking-[0.16em] text-nex-grey">What grows</p><p className="mt-1 font-inter text-sm font-semibold text-white">Production capacity</p></div>
          <div className="rounded-xl border border-white/22 bg-white/[0.08] p-3"><p className="font-inter text-[10px] uppercase tracking-[0.16em] text-nex-grey">What compounds</p><p className="mt-1 font-inter text-sm font-semibold text-white">Review and decisions</p></div>
          <div className="rounded-xl border border-amber-300/55 bg-amber-300/[0.14] p-3"><p className="font-inter text-[10px] uppercase tracking-[0.16em] text-amber-200/70">What stays fixed</p><p className="mt-1 font-inter text-sm font-semibold text-amber-100">Human attention</p></div>
        </div>
      </div>
    </figure>
  );
}

function AiValueDimensionsDiagram() {
  const dimensions = [
    { number: 1, title: 'DEFENSIVE VALUE', description: 'Reduce risk, friction and operational failure' },
    { number: 2, title: 'OFFENSIVE VALUE', description: 'Improve growth, responsiveness and customer outcomes' },
    { number: 3, title: 'REVENUE HEALTH', description: 'Reduce Quiet Loss and recover revenue opportunity' },
    { number: 4, title: 'CUSTOMER LTV', description: 'Protect trust, retention, loyalty and lifetime value' },
    { number: 5, title: 'ENTERPRISE CAPACITY', description: 'Adaptive capability to compete continuously in AI-mediated markets' },
  ];

  return (
    <figure className="my-12 overflow-hidden rounded-3xl border border-nex-cyan/65 bg-[#0b2032] shadow-[0_0_0_1px_rgba(0,212,255,0.18),0_0_30px_rgba(0,212,255,0.12),0_24px_70px_rgba(0,0,0,0.4)]">
      <div className="relative px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-nex-cyan/10 blur-3xl" />
        <figcaption className="relative max-w-xl font-urbanist text-lg font-bold leading-tight text-white">AI Value Compounds Across Five Dimensions - Validation in Progress</figcaption>
        <div className="relative mx-auto mt-3 max-w-2xl text-center">
          <p className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-nex-cyan">AI-MEDIATED MARKETS</p>
          <div className="mt-0.5 font-urbanist text-sm leading-none text-nex-cyan">│</div>
          <div className="font-urbanist text-sm leading-none text-nex-cyan">▼</div>
        </div>
        <div className="relative mx-auto mt-3 max-w-2xl">
          {dimensions.map(({ number, title, description }, index) => (
            <div key={title}>
              <div className={`rounded-lg border px-3 py-2 transition-all ${index === dimensions.length - 1 ? 'border-nex-cyan/80 bg-gradient-to-r from-nex-cyan/25 to-nex-cyan/[0.08] shadow-[0_0_24px_rgba(0,212,255,0.16)]' : 'border-white/25 bg-white/[0.08]'}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-urbanist text-base font-bold ${index === dimensions.length - 1 ? 'bg-nex-cyan text-nex-dark shadow-glow-cyan' : 'border border-nex-cyan/65 bg-nex-cyan/15 text-nex-cyan'}`}>{number}</span>
                  <div className="min-w-0">
                    <p className="font-urbanist text-sm font-extrabold leading-tight tracking-[0.06em] text-white">{title}</p>
                    <p className="mt-0.5 font-inter text-[11px] leading-tight text-nex-text">{description}</p>
                  </div>
                </div>
              </div>
              {index < dimensions.length - 1 && <div className="py-0.5 text-center font-urbanist text-sm leading-none text-nex-cyan">▲</div>}
            </div>
          ))}
        </div>
        <div className="relative mt-3 rounded-lg border border-nex-cyan/60 bg-gradient-to-r from-nex-cyan/[0.16] to-nex-cyan/[0.04] px-3 py-2"><p className="font-inter text-[9px] font-bold uppercase tracking-[0.12em] text-nex-cyan">Enterprise Capacity is not another outcome</p><p className="mt-0.5 font-urbanist text-sm font-semibold leading-snug text-white">It is the organisational capability that continually strengthens the four dimensions beneath it.</p></div>
      </div>
    </figure>
  );
}

interface BlogMeta {
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  body: React.ReactNode;
}

const posts: Record<string, BlogMeta> = {
  'gartner-bq-2q26-ai-roi-operational-readiness': {
    title: "AI Will Not Deliver ROI Until Businesses Can Operate Differently",
    date: 'May 2026',
    readTime: '6 min read',
    category: 'Global',
    excerpt: "Gartner's Business Quarterly 2Q26 makes an important observation: many organisations have learned a great deal about AI, but boards and executive teams are still struggling to see meaningful returns from those investments.",
    body: (
      <>
        <p>Gartner's Business Quarterly 2Q26 makes an important observation: many organisations have learned a great deal about AI, but boards and executive teams are still struggling to see meaningful returns from those investments.</p>
        <p>That should not be surprising.</p>
        <p>Most businesses already have AI pilots, automation platforms, workflow systems, and growing digital infrastructure. Yet many still struggle with slow response times, fragmented workflows, broken handovers, and disconnected execution.</p>
        <p>The challenge is no longer access to AI. It is operational capability.</p>
        <h3>Gartner Calls It Autonomous Business</h3>
        <p>Gartner argues that the next wave of transformation is "autonomous business", where organisations increase both machine autonomy and human autonomy to create value.</p>
        <p>We agree with the direction.</p>
        <p>But autonomy is not achieved by deploying agents. It is achieved when information moves faster, decisions happen sooner, and operations can respond reliably without friction slowing everything down.</p>
        <p>Autonomy is an operational outcome, not a technology project.</p>
        <h3>The Real Constraint Is Operational Readiness</h3>
        <p>Gartner reports that 76% of CEOs see AI as the most disruptive technology affecting their industries over the next three years.</p>
        <p>The issue is that markets are moving faster than enterprise operations.</p>
        <p>AI-mediated markets compress response times, decision cycles, customer expectations, and competitive advantage. In that environment, operational delays become commercially visible.</p>
        <p>A slow response. A missed follow-up. A fragmented customer journey. These are no longer internal inefficiencies. They are growth constraints.</p>
        <p>This is where NexFrontier's concepts of Human Latency and Quiet Loss become increasingly relevant.</p>
        <h3>What Gartner Really Reveals</h3>
        <p>One of the most telling sections of the report focuses on how autonomous business should be measured. The metrics include revenue per employee, reduced human intervention, operational quality, lower error rates, and latency.</p>
        <p>Not AI pilots. Not agent counts. Not technology spend. Operational outcomes.</p>
        <p>That is the signal.</p>
        <p>The businesses most likely to benefit from AI will not simply be the ones with the most tools. They will be the ones that can reduce friction, improve responsiveness, and turn intent into outcomes faster than competitors.</p>
        <p>AI may create the opportunity. Operational readiness determines who captures the value.</p>
        <p>That is the frontier NexFrontier is built for.</p>
      </>
    ),
  },
  'ai-isnt-creating-the-next-management-challenge': {
    title: "AI Isn't Creating the Next Management Challenge. It's Exposing It.",
    date: '12 Aug 2026',
    readTime: '8 min read',
    category: 'Global',
    excerpt: "AI is making work faster, but faster work is not automatically becoming greater enterprise value. The next management challenge is the attention bottleneck created when output scales faster than human judgement.",
    body: (
      <>
        <p className="text-lg text-nex-text"><em>Why faster work isn't translating into greater enterprise value.</em></p>
        <ManagementBottleneckDiagram />
        <p>For years, the promise of AI has been simple.</p>
        <p>Work faster. Be more productive. Save time.</p>
        <p>By many measures, that is happening. <a href="https://www.bcg.com/publications/2026/ai-at-work-why-strategy-matters-more-than-tools" target="_blank" rel="noopener noreferrer" className="text-nex-cyan underline decoration-nex-cyan/40 underline-offset-4 hover:text-white">BCG reports</a> that 42% of regular frontline AI users save the equivalent of a full workday each week. <a href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" target="_blank" rel="noopener noreferrer" className="text-nex-cyan underline decoration-nex-cyan/40 underline-offset-4 hover:text-white">McKinsey reports</a> that AI adoption is now widespread across large organisations.</p>
        <p>Yet something curious is happening.</p>
        <p><a href="https://hbr.org/2026/05/managers-are-struggling-to-keep-up-with-the-ai-productivity-boom" target="_blank" rel="noopener noreferrer" className="text-nex-cyan underline decoration-nex-cyan/40 underline-offset-4 hover:text-white">Harvard Business Review recently quoted one manager</a> saying:</p>
        <blockquote>“Every 30 minutes, someone creates something I have to look at.”</blockquote>
        <p>That sentence captures the next enterprise challenge better than almost any AI statistic.</p>
        <p>AI has not just increased productivity. It has dramatically increased the volume of work requiring human judgement.</p>
        <h3>The productivity paradox</h3>
        <p>The assumption was straightforward.</p>
        <p>If AI saves eight hours each week, organisations become more productive.</p>
        <p>Instead, many managers describe spending those hours reviewing AI outputs, checking accuracy, resolving inconsistencies, approving more work, making more decisions, and responding to more activity.</p>
        <p>The work has not disappeared. The work has changed.</p>
        <p>AI creates abundance. Human attention does not.</p>
        <h3>The real bottleneck is not AI</h3>
        <p>Historically, organisations were designed around relatively predictable rates of work. People generated ideas. Managers reviewed them. Processes moved at human speed.</p>
        <p>AI changes that equation.</p>
        <p>Every employee can now produce more analysis, more reports, more proposals, more content, more experiments, and more decisions than ever before. The organisation becomes capable of producing far more work than leadership can realistically absorb.</p>
        <p>The bottleneck moves. Not to technology. To judgement.</p>
        <AttentionBottleneckDiagram />
        <h3>Why many AI programmes struggle to create enterprise value</h3>
        <p>This is where recent research begins to converge.</p>
        <p>McKinsey points to a familiar pattern. Most organisations adopt AI. Relatively few achieve meaningful enterprise advantage.</p>
        <p>Why? Because they improve individual productivity without redesigning how the organisation creates value.</p>
        <p>The operating model stays largely the same. Workflows remain unchanged. Governance remains unchanged. Decision rights remain unchanged.</p>
        <p>The result? People become faster. The organisation often does not.</p>
        <h3>But there is another shift happening</h3>
        <p>Most discussions stop there. They focus on internal transformation.</p>
        <p>We think there is a second shift that is just as important.</p>
        <p>The market itself is changing.</p>
        <p>Increasingly, organisations are being evaluated through AI-assisted buyers, autonomous systems, recommendation engines, and digital decision pathways. Customers are no longer the only ones interpreting your business. AI increasingly participates in that process too.</p>
        <p>That changes the commercial consequences of operational friction.</p>
        <p>Delayed responses. Poor handovers. Missing evidence. Weak governance. Process bottlenecks.</p>
        <p>These have always existed. The difference is that AI-mediated markets are far less tolerant of them.</p>
        <h3>AI does not create operational weakness</h3>
        <p>It exposes it.</p>
        <p>It accelerates it.</p>
        <p>It amplifies it.</p>
        <p>Weaknesses organisations could previously recover from now become visible sooner. Commercial consequences arrive faster. The rules of competition begin to change.</p>
        <h3>From productivity to enterprise capability</h3>
        <p>At NexFontier, we have found it useful to think about organisational maturity through five progressively broader dimensions of value.</p>
        <p>Dimension 1 asks whether AI helps individuals work faster.</p>
        <p>Dimension 2 looks at improving workflows and operational efficiency.</p>
        <p>Dimension 3 focuses on improving customer outcomes.</p>
        <p>Dimension 4 examines commercial performance by protecting revenue, improving growth, and reducing Quiet Loss.</p>
        <p>These are all important.</p>
        <p>But they lead to a fifth and more strategic question.</p>
        <p><strong className="text-nex-cyan">Is the organisation itself becoming more capable of competing in AI-mediated markets?</strong></p>
        <AiValueDimensionsDiagram />
        <p>That capability is no longer defined simply by technology. It includes an organisation's ability to adapt continuously, govern human and AI actors consistently, reduce operational friction, create trusted customer outcomes, and make confident decisions as complexity increases.</p>
        <p>That is enterprise capability. And increasingly, it may become the source of competitive advantage.</p>
        <h3>Where FOCL fits</h3>
        <p>We do not believe leaders need another dashboard. Or more alerts. Or another stream of AI-generated information.</p>
        <p>The opposite.</p>
        <p>If AI creates information abundance, leaders need clarity.</p>
        <p>The hypothesis behind FOCL is straightforward: help leaders identify where customer intent encounters operational friction. Show where value is quietly being lost. Provide evidence that supports earlier, better decisions.</p>
        <p>Not more information. Better judgement.</p>
        <p>That distinction matters.</p>
        <h3>Looking ahead</h3>
        <p>The first wave of AI was about capability. The next wave will be about competitiveness.</p>
        <p>Not because organisations have more AI. But because they become better at directing scarce human attention towards the decisions that matter most.</p>
        <p>Perhaps that is the real management challenge emerging in the AI era.</p>
        <p>Not keeping up with AI. But ensuring the organisation can keep up with itself.</p>
      </>
    ),
  },
  'agentic-ai-is-not-a-feature': {
    title: "Agentic AI Is Not a Feature: It's Infrastructure",
    date: 'May 2026',
    readTime: '6 min read',
    category: 'Global',
    excerpt: "Why the companies winning with AI aren't deploying chatbots. They're building the backbone that lets intelligent systems act reliably at scale.",
    body: (
      <>
        <p>There's a persistent misconception in the market right now. Businesses see AI as a feature to add: a chatbot on a website, a summarisation tool in an inbox, a recommendation engine on a product page. These are useful. They are not what's reshaping competitive markets.</p>
        <p>What's reshaping markets is something quieter and more structural: the capacity for intelligent systems to <em>act</em> on behalf of customers, and do so reliably, at volume, without human bottlenecks.</p>
        <h3>From assistants to agents</h3>
        <p>An assistant waits to be asked. An agent acts on intent. The shift between these two modes is not cosmetic. It changes what the underlying infrastructure needs to do.</p>
        <p>An assistant needs a clean interface and a capable model. An agent needs clean data, reliable APIs, defined decision boundaries, audit trails, graceful failure handling, and integration into every operational system that matters. That's not a feature. That's a platform.</p>
        <h3>Why most deployments stall</h3>
        <p>The businesses we work with have typically tried some form of AI deployment before. Most stalled within 90 days. Not because the AI wasn't capable, but because the surrounding infrastructure couldn't support it. Data was siloed. APIs were brittle. Workflows weren't designed for machine participation.</p>
        <p>The model was ready. The business wasn't.</p>
        <h3>The infrastructure layer is the moat</h3>
        <p>Companies that build operational readiness before deploying agents are accumulating a compounding advantage. Every integration strengthens the next. Every clean data asset enables more capable actions. Every workflow redesigned for machine participation reduces friction, and friction is where revenue leaks.</p>
        <p>This is why NexFrontier focuses on infrastructure first. Not because the AI isn't important, but because without the foundation, the AI has nowhere reliable to stand.</p>
      </>
    ),
  },
  'the-quiet-loss-most-businesses-miss': {
    title: 'The Quiet Loss Most Businesses Are Missing',
    date: 'Apr 2026',
    readTime: '5 min read',
    category: 'Global',
    excerpt: "Revenue doesn't always vanish loudly. Dropped queries, stalled handoffs, and unresolved friction compound silently until they show up in the numbers.",
    body: (
      <>
        <p>Most revenue loss in service businesses isn't dramatic. There's no single point of failure you can trace back to a decision or a system crash. It accumulates in the margins of ordinary operations: a query that never got a response, a handoff that stalled overnight, a customer who found what they needed, just not from you.</p>
        <h3>The compounding cost of small frictions</h3>
        <p>A 3% drop in query resolution doesn't feel urgent. But across thousands of weekly interactions, it represents tens of thousands of missed revenue opportunities annually. Multiply that across a medium-sized enterprise and you're looking at material losses that never appear on an incident report, because no one incident caused them.</p>
        <h3>What the data tells us</h3>
        <p>When we run our Quiet Loss calculator with new clients, the results are consistently surprising to them, not because the numbers are fabricated, but because the assumptions are conservative. We use their own industry benchmarks, their approximate interaction volumes, and standard conversion rates. The output is almost always higher than expected.</p>
        <p>This isn't a sales exercise. It's a diagnostic. The point is to make the invisible visible before designing a solution.</p>
        <h3>Fixing it requires infrastructure, not effort</h3>
        <p>The instinct is to hire more people or add more tools. But quiet loss isn't a resource problem, it's a systems problem. The gaps exist because workflows weren't designed to capture every customer moment, because handoff points weren't instrumented, because the resolution infrastructure was built for a lower-volume, higher-tolerance era.</p>
        <p>Closing the quiet loss gap requires rebuilding those systems, not patching them.</p>
      </>
    ),
  },
  'why-data-readiness-precedes-ai-readiness': {
    title: 'Why Data Readiness Precedes AI Readiness',
    date: 'Mar 2026',
    readTime: '7 min read',
    category: 'Global',
    excerpt: 'Before an AI agent can act, it must be able to see, trust, and retrieve. Most organisations skip this layer entirely.',
    body: (
      <>
        <p>There's a sequencing problem at the heart of most AI programmes. Organisations invest in models, interfaces, and deployment infrastructure, but skip the layer that makes all of it work: data readiness.</p>
        <h3>What data readiness actually means</h3>
        <p>Data readiness isn't about having a data warehouse or a business intelligence dashboard. It's about whether an AI system can access the right data, in the right format, at the right moment, and trust what it finds.</p>
        <p>This means clean schemas, current records, consistent identifiers across systems, and retrieval pathways that don't break under load. Most organisations, even those with mature data teams, have significant gaps here when it comes to supporting real-time agentic workflows.</p>
        <h3>The EY 2026 benchmark</h3>
        <p>The EY Global AI Sentiment Study 2026 noted that while confidence in AI is high across emerging markets, trust in underlying data infrastructure remains a constraint on actual deployment. The gap between AI ambition and AI execution is, in large part, a data gap.</p>
        <h3>A framework for readiness</h3>
        <p>We assess data readiness across four dimensions: accessibility (can the system reach it?), freshness (is it current?), coherence (is it consistent across sources?), and completeness (are the gaps acceptable for the decisions being made?). Most organisations score well on accessibility and poorly on coherence. That's where the agentic breakdowns happen.</p>
      </>
    ),
  },
  'mistaking-technology-investment-for-operational-readiness': {
    title: 'Businesses Are Mistaking Technology Investment for Operational Readiness',
    date: 'May 2026',
    readTime: '9 min read',
    category: 'Global',
    excerpt: "Owning technology, running AI pilots, and modernising systems are not the same as being operationally ready. The Veeam 2026 report highlights a gap many businesses are only discovering under pressure.",
    body: (
      <>
        <p>Veeam's <em>Data Trust and Resilience Report 2026</em> highlights a growing gap between what businesses think their operations can handle and what actually happens when pressure hits.</p>
        <p>That gap matters more in the AI era than many organisations realise.</p>
        <p>Because businesses are increasingly confusing owning technology, investing in platforms, running AI pilots, and modernising systems with being operationally ready.</p>
        <p>They are not the same thing.</p>
        <h3>The Real Problem Is Not Missing Technology</h3>
        <p>One of the strongest findings in the Veeam report is this: 90% of organisations believed they could recover quickly from a cyberattack, yet only 28% fully restored their data after ransomware incidents.</p>
        <p>That is not just a cyber issue. It suggests many businesses believe they are more operationally prepared than they actually are.</p>
        <p>Many organisations assume they are resilient because systems exist, dashboards exist, AI tools exist, and policies exist. But real operational capability only becomes visible when businesses are under pressure.</p>
        <p>Can teams still respond quickly? Can workflows still move cleanly? Can customer issues still be resolved smoothly? Can operations continue without friction building everywhere?</p>
        <p>That is where many businesses struggle. Not through dramatic collapse. But through slow response, broken follow-up, disconnected workflows, delayed decisions, and operational fatigue across teams.</p>
        <p>This is the gap NexFrontier focuses on.</p>
        <h3>AI Is Changing What Operational Readiness Means</h3>
        <p>Historically, businesses could tolerate operational inefficiency for much longer. Customers waited longer. Decision cycles moved slower. Competition was easier to contain.</p>
        <p>That environment is changing quickly. AI increasingly influences how customers compare businesses, which providers get recommended, how quickly trust forms, and how fast customers move on.</p>
        <p>This means responsiveness and continuity now matter far more than before. The question is no longer simply whether the systems exist. The real question becomes whether the business can operate reliably when speed, coordination, and responsiveness are tested.</p>
        <p>That is why NexFrontier focuses on operational readiness, not just technology deployment.</p>
        <h3>Technology Alone Does Not Remove Operational Friction</h3>
        <p>Most enterprises already have CRMs, workflow systems, cloud infrastructure, analytics platforms, automation tools, and AI initiatives. Yet operational friction still shows up everywhere: delayed response, fragmented handovers, disconnected execution, inconsistent follow-up, and slow escalation between teams.</p>
        <p>Historically, these were treated as internal inefficiencies. In AI-mediated markets, they increasingly become visible to customers much earlier. Because customers now expect faster response, smoother coordination, clearer next steps, and lower friction experiences.</p>
        <p>This is where NexFrontier's concept of Quiet Loss becomes important. Quiet Loss happens when customer intent exists, but operational friction quietly erodes trust and momentum before conversion happens. Most businesses rarely see this clearly in their reporting. But the commercial impact compounds over time.</p>
        <h3>Markets Are Moving Faster Than Enterprise Operations</h3>
        <p>This is where many transformation strategies are starting to fall behind market reality. Most organisations still focus heavily on system upgrades, platform consolidation, database projects, governance programmes, and infrastructure modernisation. Meanwhile, customer expectations accelerate, AI-mediated decision cycles shorten, and operational responsiveness increasingly shapes competitiveness.</p>
        <p>The market may not wait for businesses to finish transforming themselves.</p>
        <p>This is where NexFrontier sits differently from much of the current AI landscape. We are not focused on building another isolated assistant, copilot, or automation layer. We focus on helping businesses operate more reliably in AI-mediated markets by reducing Human Latency, improving continuity, reducing operational friction, recovering Quiet Loss, and strengthening responsiveness across customer and operational journeys.</p>
        <p>Because in the AI era, operational readiness matters more than perfect data readiness. Businesses are unlikely to fail because their databases were imperfect. They are far more likely to struggle because their operations could not respond, execute, and adapt fast enough.</p>
        <h3>The Bigger Signal Emerging Across Enterprise AI</h3>
        <p>The Veeam report aligns with a broader pattern now emerging across EY's AI Sentiment research, Cloudera's Data Readiness Index, NiCE's Agentic AI analysis, and operational resilience research more broadly. Different reports talk about resilience, governance, orchestration, trust, and data readiness. But underneath them all sits the same signal:</p>
        <p>The AI era is not just testing technology. It is testing whether businesses can operate reliably under faster, more demanding market conditions.</p>
        <p>The businesses most likely to succeed will not simply be the ones with more AI tools, larger transformation budgets, or cleaner dashboards. They will increasingly be the organisations that can respond faster, coordinate better, reduce friction, maintain continuity, and reliably turn intent into outcomes.</p>
        <p>That is the frontier NexFrontier is built for.</p>
      </>
    ),
  },
  'mckinsey-2025-sustainable-inclusive-growth-capability-challenge': {
    title: "Beyond Training: The Capability Challenge McKinsey's Report Points Toward",
    date: 'May 2026',
    readTime: '8 min read',
    category: 'Global',
    excerpt: "McKinsey's 2025 Sustainable & Inclusive Growth Impact Report explores jobs, skills, and workforce participation. Many will walk away thinking the answer is more training. NexFrontier believes the market has already moved beyond that question.",
    body: (
      <>
        <p>McKinsey's report explores jobs, skills, inclusion, adaptability, and workforce participation.</p>
        <p>Many readers may walk away with a straightforward conclusion:</p>
        <p><em>"We need more training."</em></p>
        <p>There is certainly truth in that.</p>
        <p>But we believe the market has already moved beyond that question.</p>
        <p>Training assumes the challenge is knowledge.</p>
        <p>The emerging challenge is adaptability.</p>
        <p>Knowledge has never been more abundant. AI is making expertise, information, and guidance available at unprecedented scale. Yet organisations continue to struggle with execution, transformation, capability gaps, workforce engagement, and productivity.</p>
        <p>This suggests the problem may not be a shortage of knowledge.</p>
        <p>It may be a shortage of organisational capability.</p>
        <p>Viewed through that lens, a different set of questions begins to emerge.</p>
        <h3>McKinsey asks: How do people remain employable?</h3>
        <p>An increasingly important question.</p>
        <p>But beneath it sits another:</p>
        <p><strong className="text-nex-cyan">How do organisations remain capable?</strong></p>
        <p>Because employability ultimately depends on whether organisations can create environments where people can continuously contribute, learn, adapt, and create value.</p>
        <h3>McKinsey asks: How do we build skills?</h3>
        <p>NexFrontier asks:</p>
        <p><strong className="text-nex-cyan">How do we build environments where skills compound rather than decay?</strong></p>
        <p>Many organisations invest heavily in training, only to watch capability dissipate through poor processes, fragmented systems, unclear accountability, decision bottlenecks, and operational friction.</p>
        <p>Skills alone do not create value.</p>
        <p>Skills applied consistently within healthy operating environments create value.</p>
        <h3>McKinsey asks: How do we increase workforce participation?</h3>
        <p>NexFrontier asks:</p>
        <p><strong className="text-nex-cyan">How do we remove the barriers that prevent people from contributing their full potential?</strong></p>
        <p>The challenge is not always a lack of willingness, intelligence, effort, or talent.</p>
        <p>Often, it is the environment itself.</p>
        <p>People spend enormous amounts of energy navigating complexity, waiting for decisions, managing workarounds, compensating for disconnected systems, and overcoming organisational friction.</p>
        <p>The result is capability that exists but never fully expresses itself.</p>
        <h3>McKinsey asks: How do societies adapt to technological change?</h3>
        <p>NexFrontier asks:</p>
        <p><strong className="text-nex-cyan">What makes a human system capable of adaptation in the first place?</strong></p>
        <p>Because adaptation is not merely a workforce issue.</p>
        <p>It is an operational issue.</p>
        <p>It is a leadership issue.</p>
        <p>It is a systems issue.</p>
        <p>It is an organisational design issue.</p>
        <p>And increasingly, it is becoming a competitive advantage.</p>
        <h3>A Shift in Perspective</h3>
        <p>What emerges is a shift in perspective.</p>
        <p>People are no longer viewed simply as resources to be managed.</p>
        <p>People become capability to be amplified.</p>
        <p>Organisations become systems of capability creation.</p>
        <p>Leadership becomes the discipline of creating conditions where capability can flourish.</p>
        <p>This matters because AI is not simply changing work.</p>
        <p>It is changing the conditions under which value is created.</p>
        <p>The organisations that thrive will not necessarily be those with the most technology, the largest budgets, or the biggest workforces.</p>
        <p>They will be those that can continuously absorb new knowledge, convert it into capability, translate capability into outcomes, and regenerate that capability as conditions evolve.</p>
        <p>That is the frontier we believe many organisations are now approaching.</p>
        <p>Not a skills challenge.</p>
        <p>Not a technology challenge.</p>
        <p>A capability challenge.</p>
      </>
    ),
  },
  'feedback-doesnt-create-learning-evidence-does': {
    title: "Feedback Doesn't Create Learning. Evidence Does.",
    date: 'Jul 2026',
    readTime: '9 min read',
    category: 'Global',
    excerpt: "Why organisations need more than better conversations in AI-mediated markets. Feedback based on perception changes behaviour temporarily. Feedback grounded in evidence improves capability.",
    body: (
      <>
        <p className="font-urbanist text-nex-cyan text-lg font-semibold mb-2">Why organisations need more than better conversations in AI-mediated markets.</p>
        <p>Harvard Business Review recently published a timely reminder: feedback only leads to learning when it helps people improve the work, rather than defend themselves. It's a valuable insight. Good feedback is specific, grounded in observable behaviour, invites reflection and focuses on what happens next.</p>
        <p>We agree.</p>
        <p>But there is a bigger question that organisations increasingly need to ask.</p>
        <p>Where does that feedback come from?</p>
        <HbrLinkCard />
        <p>Too often, feedback begins with opinion.</p>
        <p>Someone notices an issue.<br />A manager forms a view.<br />A conversation follows.<br />Actions are agreed.<br />Everyone hopes things improve.<br />Sometimes they do.</p>
        <p>Sometimes they don't.</p>
        <p>Either way, few organisations can confidently explain why.</p>
        <p>The missing layer isn't feedback. It's evidence.</p>
        <p>As organisations adopt more AI, automation and digital workflows, work becomes faster and more interconnected. Yet the quality of organisational learning often fails to keep pace.</p>
        <p>The problem isn't that organisations aren't talking.</p>
        <p>The problem is that many are still talking without first understanding operating reality.</p>
        <p>Consider the difference.</p>
        <p>Traditional feedback asks:</p>
        <ul className="list-disc list-inside space-y-1 text-nex-grey pl-2">
          <li>What happened?</li>
          <li>Who was responsible?</li>
          <li>What should be done differently?</li>
        </ul>
        <p>An evidence-led organisation asks first:</p>
        <ul className="list-disc list-inside space-y-1 text-nex-grey pl-2">
          <li>What actually happened?</li>
          <li>What evidence supports that conclusion?</li>
          <li>What operational conditions contributed to the outcome?</li>
          <li>Is this an isolated event or part of a broader pattern?</li>
          <li>What intervention is most likely to improve capability?</li>
        </ul>
        <p>That distinction matters.</p>
        <p>Because feedback based on perception often changes behaviour temporarily.</p>
        <p>Feedback grounded in evidence improves capability.</p>
        <h3>AI-mediated markets raise the bar</h3>
        <p>Artificial intelligence is changing more than how work gets done. It is changing how organisations are evaluated.</p>
        <p>Customers, partners, suppliers and increasingly AI systems themselves are assessing reliability, responsiveness and consistency before trust is established.</p>
        <p>In these AI-mediated markets, organisations cannot rely solely on experience or intuition. They need confidence that operational decisions are based on evidence, that interventions are measurable and that learning is repeatable.</p>
        <p>This is where Operational Readiness becomes a competitive advantage.</p>
        <p>Operational Readiness is an organisation's ability to consistently convert intent into trusted outcomes through capable people, effective processes, sound governance and evidence-based decision-making.</p>
        <p>Without it, AI can automate existing inefficiencies rather than eliminate them.</p>
        <h3>Feedback is only one part of the learning cycle</h3>
        <p>At NexFrontier, we believe feedback is an important intervention, but it should not be the starting point.</p>
        <p>A more effective progression looks like this:</p>
        <p className="text-nex-cyan font-semibold">Observe &rarr; Evidence &rarr; Insight &rarr; Feedback &rarr; Behaviour Change &rarr; Measured Learning &rarr; Organisational Capability</p>
        <p>This changes the conversation.</p>
        <p>Rather than saying:</p>
        <p><em>"Here's what I think happened."</em></p>
        <p>Leaders can instead say:</p>
        <p><em>"Here's what the evidence shows. Let's understand why before deciding what to do next."</em></p>
        <p>That shift reduces defensiveness, improves trust and increases the likelihood that learning becomes embedded rather than forgotten.</p>
        <h3>From individual feedback to organisational learning</h3>
        <p>Most organisations are good at capturing experiences.</p>
        <p>Far fewer are good at converting those experiences into institutional capability.</p>
        <p>The difference lies in whether learning remains with individuals or becomes part of how the organisation operates.</p>
        <p>Every operational event contains information.</p>
        <p>Every exception reveals something about process, governance or capability.</p>
        <p>Every intervention provides an opportunity to understand whether improvement actually occurred.</p>
        <p>Without evidence, these moments become anecdotes.</p>
        <p>With evidence, they become organisational knowledge.</p>
        <h3>Where FOCL fits</h3>
        <p>This is one of the reasons we are building FOCL.</p>
        <p>FOCL is not a feedback platform.</p>
        <p>Nor is it simply another AI application or analytics dashboard.</p>
        <p>It is an evidence-led operational intelligence platform designed to help organisations observe how work actually happens, identify where operational friction exists and understand whether interventions lead to measurable improvements in capability.</p>
        <p>Instead of simply reporting activity, FOCL helps answer more meaningful questions:</p>
        <ul className="list-disc list-inside space-y-1 text-nex-grey pl-2">
          <li>Where is operational trust strengthening?</li>
          <li>Where is capability improving?</li>
          <li>Where does friction continue despite automation?</li>
          <li>Which interventions created measurable value?</li>
          <li>Can we demonstrate improvement with evidence rather than assumption?</li>
        </ul>
        <p>Those questions become increasingly important as organisations invest in AI.</p>
        <h3>The organisations that learn fastest will lead</h3>
        <p>The next wave of competitive advantage is unlikely to come from deploying the most AI.</p>
        <p>It will come from learning faster than competitors.</p>
        <p>Not through more meetings. Not through more reports. Not through more feedback.</p>
        <p>But through an organisation's ability to consistently convert operational evidence into better decisions, better interventions and better outcomes.</p>
        <p>Because in AI-mediated markets, learning is no longer a soft capability.</p>
        <p>It is an operational one.</p>
        <p>And the organisations that can prove they learn will ultimately become the organisations that others trust.</p>
        <p>At NexFrontier, we believe Operational Readiness (turning customer intent to trusted outcomes) is becoming one of the defining disciplines of AI-enabled organisations.</p>
        <p>FOCL exists to help organisations move beyond automation, transforming operational evidence into measurable capability, trusted outcomes and sustainable competitive advantage.</p>
      </>
    ),
  },
  'cx-frontline-the-new-competitive-edge': {
    title: 'CX Frontline: The New Competitive Edge in an Agentic World',
    date: 'Feb 2026',
    readTime: '8 min read',
    category: 'Global',
    excerpt: 'As AI intermediaries handle more customer journeys, the businesses that optimise for machine-legible trust will outpace those optimised for human browsing.',
    body: (
      <>
        <p>Until recently, the CX layer was designed for humans. Websites, call flows, and service journeys were optimised for human attention, human patience, and human decision-making patterns.</p>
        <p>That's changing. Increasingly, the first point of contact in a customer journey is not a human discovering a brand. It's an AI intermediary evaluating options on behalf of a human. And that intermediary has very different needs.</p>
        <h3>What machines evaluate</h3>
        <p>AI agents don't respond to brand aesthetics or clever copy. They evaluate: Can I retrieve reliable information from this business? Are the APIs stable? Is the pricing data current? Can I complete a transaction without human intervention? Is there a structured record I can trust?</p>
        <p>Businesses optimised for human browsing are often invisible or unreliable to machine evaluation. That's a new kind of competitive disadvantage, and most organisations don't know they have it.</p>
        <h3>Redesigning for machine-legible trust</h3>
        <p>The CX frontline of the next five years will be built around reliability signals rather than persuasion architecture. Structured data, stable integrations, fast resolution paths, and transparent operational status are the new brand assets. This isn't a technology project. It's a strategy project with significant technology requirements.</p>
      </>
    ),
  },
  'malaysia-ai-adoption-gap': {
    title: "Malaysia's AI Adoption Gap: And the Window to Close It",
    date: 'May 2026',
    readTime: '6 min read',
    category: 'Malaysia',
    excerpt: "Malaysian enterprises are investing in AI tools but underinvesting in operational readiness. The gap between deployment and results is widening.",
    body: (
      <>
        <p>Malaysia's digital economy ambitions are genuine and well-resourced. The MDEC agenda, the MyDIGITAL initiative, and a wave of private investment have positioned the country as a serious contender in the regional AI race. But there's a gap forming between investment and outcomes.</p>
        <h3>Tools without foundations</h3>
        <p>The pattern we see repeatedly: enterprises procure AI tooling, often from global vendors with strong marketing and capable products, and deploy it on top of data infrastructure that was never designed to support agentic workloads. The AI works as designed. The results disappoint. The project stalls.</p>
        <p>This isn't a failure of ambition. It's a sequencing problem.</p>
        <h3>The window is now</h3>
        <p>Malaysia is at a point where the investment cycle is active but the competitive differentiation hasn't yet been locked in. The businesses that build operational infrastructure now, with clean data layers, reliable integration architectures, and machine-legible CX, will have a compounding advantage over those that wait for the market to force it.</p>
        <h3>What NexFrontier brings to Malaysia</h3>
        <p>Our focus in Malaysia is on mid-to-large-market enterprises, businesses large enough to have complex operational challenges but not yet resourced to build the infrastructure layer in-house. We bridge that gap with a deployment-ready framework and regional expertise.</p>
      </>
    ),
  },
  'sme-digitalisation-malaysia-beyond-grants': {
    title: "SME Digitalisation in Malaysia: Beyond the Grant Cycle",
    date: 'Mar 2026',
    readTime: '5 min read',
    category: 'Malaysia',
    excerpt: "Matching grants have done their job. The next phase requires sustainable infrastructure that doesn't depend on subsidy.",
    body: (
      <>
        <p>Malaysia's SME digitalisation grants, the SME Digitalisation Initiative, PENJANA, and the various MSC-linked programmes, were effective at creating first-contact moments with digital tools. Tens of thousands of SMEs got their first cloud subscription, their first e-commerce presence, their first digital accounting system.</p>
        <p>That was the right intervention for that moment. The moment has passed.</p>
        <h3>The grant dependency trap</h3>
        <p>A significant portion of SMEs that benefited from these programmes remain dependent on subsidy cycles for continued investment. When grants end, digital capability stalls. This creates a pattern of sporadic adoption rather than compounding capability, and it's not unique to Malaysia.</p>
        <h3>Sustainable infrastructure looks different</h3>
        <p>The businesses that have genuinely transformed through digitalisation share a common feature: they invested in infrastructure that generates operational returns, not tools that require ongoing justification. The ROI is built into the architecture rather than dependent on continued subsidy.</p>
        <p>For Malaysian SMEs looking to make the transition, the question isn't what tool to buy next. It's what operational problems are costing the business money today, and what the minimum infrastructure investment to solve them sustainably looks like.</p>
      </>
    ),
  },
  'malaysia-cx-frontline-readiness': {
    title: "Malaysia's Next Growth Layer Is Invisible",
    date: 'Feb 2026',
    readTime: '6 min read',
    category: 'Malaysia',
    excerpt: "How AI-mediated demand is quietly reshaping business across Southeast Asia and why operational readiness is becoming the new competitive edge.",
    body: (
      <>
        <p>For years, businesses competed for attention. Better branding. More advertising. Higher search rankings. More leads.</p>
        <p>But something deeper is beginning to shift beneath the surface of the market.</p>
        <p>Customers are increasingly using AI not just to search, but to compare, filter, shortlist, recommend, and increasingly, decide.</p>
        <p>That changes the role of business operations entirely.</p>
        <p>Because once AI begins influencing who gets considered, trust no longer forms only between customer and business. Trust begins transferring through the AI itself.</p>
        <p>At NexFrontier, we believe this is one of the most important commercial shifts unfolding across Malaysia and Southeast Asia today. And most businesses are still looking in the wrong direction.</p>

        <h3>The Trust Paradox</h3>
        <p>The latest EY AI Sentiment research highlights something deeply important: people say they are cautious about AI, yet their behaviour shows they are already depending on it.</p>
        <p>AI is moving from advice to authority. That means people increasingly allow AI to recommend products, guide financial decisions, compare providers, manage purchases, and shape who they trust.</p>
        <p>This creates what we call the Trust Paradox: people may not fully trust AI in principle, but they increasingly behave as if AI is useful enough to depend on.</p>
        <p>For businesses, the implication is even more profound: customers may not fully trust AI, but they may still trust the businesses AI sends them to. That makes AI a trust transfer layer. The customer thinks: "If AI sent me here, this business should be safe." The AI thinks: "If I send users here, the downstream experience must not create regret."</p>
        <p>And suddenly, operational quality becomes externally visible in ways most businesses are not yet prepared for.</p>

        <h3>Malaysia Is Closer to This Shift Than Many Realise</h3>
        <p>This is not some distant Silicon Valley future. The signals are already visible across Malaysia and Southeast Asia.</p>
        <p>Malaysia is already ahead of the global average in AI-assisted shopping behaviour. According to Adyen's Retail Report, 58% of Malaysian consumers use AI to support shopping decisions, compared with a global average of 37%.</p>
        <p>At the same time: Southeast Asian companies are scaling AI faster than global averages, Malaysia's AI infrastructure investment is accelerating rapidly, and national policy is increasingly aligned toward AI-enabled growth.</p>
        <p>McKinsey reports that 46% of Southeast Asian companies surveyed have moved beyond AI pilots, compared with 35% globally. Meanwhile, Malaysia's data centre market is forecast to grow from approximately USD 4.04B in 2024 to USD 13.57B by 2030. And Malaysia's Digital Ministry has said AI could contribute RM13B to RM20B annually to GDP by 2030.</p>
        <p>The infrastructure is being built. The consumer behaviour is already shifting. The economic incentives are aligned. The market is moving. Quietly.</p>

        <h3>The Real Risk Is Not Lack of Demand</h3>
        <p>Most businesses still think the problem is lead generation, visibility, reach, impressions, or traffic. But increasingly, the real issue may be what happens after demand arrives.</p>
        <p>This is especially true across Malaysia and SEA because customers are mobile-first, WhatsApp dominates business communication, digital commerce is deeply conversational, trust is relational, customers expect speed and continuity, while many enterprises still operate through fragmented internal systems and disconnected handoffs.</p>
        <p>That creates a dangerous mismatch. Demand may arrive faster than the business can reliably hold it. And when that happens, customers often do not complain. They disappear. They stop replying. They abandon forms. They move to another provider. They ask AI again.</p>
        <p>At NexFrontier, we call this Quiet Loss: hidden revenue erosion caused by delayed response, inconsistent follow-up, fragmented systems, overloaded teams, broken customer continuity, and operational friction during moments of intent. Most businesses cannot see it clearly because traditional reporting rarely measures trust decay, intent abandonment, or invisible opportunity leakage. But AI-mediated markets increasingly will.</p>

        <h3>Why Operational Readiness Is Becoming a Growth Strategy</h3>
        <p>Historically, operations sat behind the scenes. Now operations increasingly shape trust, conversion, recommendation survivability, and routing confidence.</p>
        <p>That changes the role of operational readiness entirely. Operational readiness is no longer merely an efficiency conversation. It becomes a revenue conversation, a trust conversation, and increasingly, a market access conversation.</p>
        <p>This is why we believe the next major competitive advantage will belong to businesses that become easier to trust, easier to respond to, easier to transact with, and safer to route demand toward. Not merely more visible.</p>

        <h3>Introducing AMRI: The AI-Mediated Routing Index</h3>
        <p>At NexFrontier, we use a strategic forecasting framework called AMRI, the AI-Mediated Routing Index: the estimated percentage of high-intent economic journeys influenced by AI before business or brand selection occurs.</p>
        <p>This is not chatbot adoption, AI search market share, or general AI awareness. It measures something more commercially important: how much economic flow is increasingly shaped by AI-mediated decision pathways before the customer chooses.</p>
        <p>Our current Malaysia baseline forecast suggests AI-mediated influence over high-intent journeys could rise significantly between now and 2030. Not because AI replaces search overnight. But because customers increasingly outsource decision friction to systems they perceive as faster, clearer, lower effort, and increasingly trustworthy enough.</p>

        <h3>AMRI Malaysia Forecast</h3>
        <table>
          <thead>
            <tr><th>Year</th><th>Conservative</th><th>Baseline</th><th>Aggressive</th></tr>
          </thead>
          <tbody>
            <tr><td>2026</td><td>12%</td><td>18%</td><td>22%</td></tr>
            <tr><td>2027</td><td>18%</td><td>28%</td><td>35%</td></tr>
            <tr><td>2028</td><td>24%</td><td>38%</td><td>48%</td></tr>
            <tr><td>2029</td><td>30%</td><td>47%</td><td>60%</td></tr>
            <tr><td>2030</td><td>35%</td><td>55%</td><td>70%</td></tr>
          </tbody>
        </table>
        <p><em>This is a forecast index based on proxy signals, not a measured national statistic.</em></p>
        <p>AI does not need to dominate search volume to dominate economic influence. Traditional search may remain large. But AI will increasingly influence the high-intent moments where choice, trust, and money converge.</p>

        <h3>The Businesses Most at Risk</h3>
        <p>The businesses most exposed are not necessarily the weakest businesses. Often, they are businesses with strong products, good people, healthy demand, and reasonable brand visibility.</p>
        <p>But internally: response is slow, systems are fragmented, ownership is unclear, follow-up breaks, customer continuity collapses under pressure, and trust decays during the journey. These businesses may still appear successful on the surface. But underneath, Quiet Loss compounds. And AI-mediated markets may accelerate the consequences because recommendation systems increasingly optimise toward low-regret outcomes.</p>

        <h3>The Next Competitive Layer</h3>
        <p>Many businesses are currently asking: "How do we appear in AI answers?" We believe the more important question is: "What happens after AI sends the customer?"</p>
        <p>Because visibility without operational reliability becomes increasingly fragile. At NexFrontier, this is where we focus. Not on gaming AI. Not on manipulating answers. But on helping businesses become safer to choose, stronger under demand, and operationally ready for markets where trust increasingly flows through AI-mediated systems.</p>
        <p>The market shift is unlikely to arrive with dramatic announcements. It will show up quietly: in rising acquisition cost, weakening conversion, disappearing leads, lower trust resilience, and invisible redistribution of demand.</p>
        <p>The market is already moving. The question is whether businesses will recognise the shift before the consequences become visible.</p>
      </>
    ),
  },
  'nz-australia-ai-stress-test': {
    title: "The Future of AI May Be Stress-Tested in New Zealand and Australia",
    date: 'May 2026',
    readTime: '9 min read',
    category: 'New Zealand',
    excerpt: "NZ and Australia aren't AI laggards. They may become the world's most important stress-test environments for operational trust in the AI era.",
    body: (
      <>
        <p>Much of the global AI conversation is currently focused on model capability, autonomous agents, productivity gains, and infrastructure scale.</p>
        <p>But there is another question emerging underneath the hype cycle: what happens when AI systems encounter economies where trust matters more than speed alone?</p>
        <p>That question may become increasingly important across New Zealand and Australia. Not because these countries are leading the world in AI deployment volume. But because they may become some of the world's most important stress-test environments for operational trust in the AI era.</p>

        <h3>The Market Is Misreading NZ and Australia</h3>
        <p>Globally, AI adoption is accelerating rapidly. Consumers increasingly allow AI to compare providers, guide purchases, automate decisions, and reduce friction in everyday life. But adoption behaviour differs significantly between regions.</p>
        <p>According to EY's global AI sentiment analysis, only around 28% of New Zealanders and 37% of Australians believe AI's benefits outweigh its risks. That places both countries below many faster-adopting markets such as India, United Arab Emirates, and parts of Southeast Asia.</p>
        <p>Many interpret this as hesitation. NexFrontier believes it reflects something else: operational trust scrutiny. These are highly developed economies where governance matters, accountability matters, escalation matters, reputational trust matters, and operational failure carries significant consequences. That changes how AI infrastructure gets evaluated.</p>

        <h3>Fast-Adoption Markets Optimise for Convenience. Trust-Sensitive Markets Optimise for Survivability.</h3>
        <p>Markets such as Malaysia, Brazil, and India increasingly reward speed, responsiveness, convenience, and operational acceleration. These are high-pressure environments where businesses win by operationalising faster.</p>
        <p>But NZ and Australia create a different evolutionary environment entirely. These markets stress-test operational continuity, governance, execution reliability, escalation pathways, and trust resilience under pressure.</p>
        <p>This distinction matters enormously. Because AI-mediated markets increasingly expose operational weakness much faster than traditional markets ever did. Historically, slow response, fragmented workflows, broken handovers, delayed escalation, and coordination fatigue were tolerated as operational inefficiencies. In AI-mediated markets, they increasingly become commercially visible liabilities. That changes the role of operational infrastructure entirely.</p>

        <h3>The Next Competitive Divide Is Not AI Capability Alone</h3>
        <p>Most organisations already possess cloud infrastructure, CRMs, analytics platforms, automation tools, and growing AI experimentation initiatives. Yet operational fragmentation remains everywhere.</p>
        <p>The issue is no longer simply "Can enterprises deploy AI?" The issue increasingly becomes: "Can enterprises remain operationally trustworthy at AI speed?"</p>
        <p>This is why NexFrontier believes the next infrastructure race may not be won primarily through larger models, more automation, or more software layers. It may increasingly be won through operational continuity, governance-aware orchestration, responsiveness, and reducing Human Latency between customer intent and business action. That is a very different category.</p>

        <h3>Why NZ and Australia Matter Strategically</h3>
        <p>For NexFrontier, New Zealand and Australia are not simply regional markets. They are highly valuable proving grounds for operational trust infrastructure.</p>
        <p>Because these economies expose weaknesses earlier. If AI systems fail unpredictably, fragment customer continuity, weaken accountability, or create operational instability, trust-sensitive markets react faster and more critically than acceleration-first markets.</p>
        <p>That makes these environments strategically important. Success here signals something deeper than technical capability. It signals operational resilience, governance maturity, continuity under pressure, and execution reliability. In many ways, NZ and Australia may become early indicators of what the next phase of enterprise AI actually requires. Not just intelligence. But dependable operational orchestration.</p>

        <h3>This Is Where NexFrontier Sits</h3>
        <p>NexFrontier is not focused on building another isolated AI tool layer. We are building operational infrastructure for AI-mediated markets, infrastructure designed to help businesses reduce Human Latency, strengthen continuity, recover Quiet Loss, improve execution flow, and remain operationally trustworthy as AI increasingly mediates customer journeys.</p>
        <p>This is why we believe: in the AI era, operational readiness matters more than perfect data readiness. Businesses will not fail because their databases were imperfect. They will fail because their operations could not respond, execute, and adapt fast enough.</p>
        <p>That distinction becomes especially important in trust-sensitive economies like New Zealand and Australia. Because these markets are unlikely to reward fragmented automation, isolated AI pilots, or operational inconsistency for very long. They will increasingly reward businesses that reduce friction, preserve trust, strengthen continuity, and reliably turn intent into outcomes at machine speed.</p>
        <p>That is the frontier NexFrontier is built for.</p>
      </>
    ),
  },
  'nz-australia-ai-era-cautiously': {
    title: "New Zealand and Australia Are Entering the AI Era More Cautiously Than the Market Realises",
    date: 'May 2026',
    readTime: '10 min read',
    category: 'New Zealand',
    excerpt: "The region isn't facing an AI adoption challenge. It's facing an operational readiness challenge. And that distinction matters enormously.",
    body: (
      <>
        <p>The global AI conversation is increasingly dominated by larger models, faster agents, automation headlines, and trillion-dollar infrastructure races.</p>
        <p>But across New Zealand and Australia, the real story may be very different.</p>
        <p>The region is not simply facing an AI adoption challenge. It is facing an operational readiness challenge. And that distinction matters enormously.</p>

        <h3>The Region Is Simultaneously Accelerating and Hesitating</h3>
        <p>Recent data shows AI adoption across New Zealand is rising rapidly: 67% of large NZ businesses now use some form of AI, up from 48% in 2023. New Zealand's government estimates AI could contribute NZD $76 billion to GDP by 2038. Australia is positioning itself as a regional AI infrastructure and compute hub, with estimates suggesting AI-related infrastructure could add AUD $134 billion to the economy by 2050.</p>
        <p>At the same time, trust and confidence remain unusually cautious compared to many emerging economies. Only 28% of New Zealanders and 37% of Australians believe AI's benefits outweigh its risks, according to EY's global sentiment analysis.</p>
        <p>This creates a highly unusual market condition: rapid AI pressure combined with cautious operational trust. And that tension may define the next decade across the region.</p>

        <h3>NZ and Australia Are Not Lagging Technologically. They Are Behaving Rationally.</h3>
        <p>Many global AI narratives interpret slower behavioural adoption in NZ and Australia as hesitation or conservatism. NexFrontier believes the reality is more sophisticated.</p>
        <p>These are governance-sensitive, operationally mature, risk-aware economies where businesses and customers increasingly ask: Can AI systems be trusted? Can decisions be audited? Who remains accountable? What happens when operations fail? Is escalation available when it matters?</p>
        <p>This is not anti-AI sentiment. It is operational trust scrutiny. And that changes what creates competitive advantage.</p>

        <h3>The Region's Real Bottleneck Is Not Intelligence. It Is Operational Capability.</h3>
        <p>Multiple reports now point toward the same hidden issue: fragmented systems, weak workflow integration, poor technology diffusion, slow execution cycles, and capability gaps inside organisations.</p>
        <p>The New Zealand Treasury has specifically highlighted weak managerial capability, poor technology diffusion, low investment in intangible capability, and structural barriers to technology adoption.</p>
        <p>Meanwhile, Cloudera's Data Readiness findings reveal fragmented operational visibility, inaccessible data environments, weak workflow integration, and infrastructure bottlenecks across enterprise environments.</p>
        <p>Most organisations already possess CRMs, automation tools, cloud infrastructure, analytics platforms, and AI experimentation initiatives. Yet operational friction remains everywhere: slow response, fragmented handovers, coordination fatigue, delayed escalation, and Human Latency between customer intent and business action. Historically, these were tolerated as operational inefficiencies. In AI-mediated markets, they increasingly become commercially visible liabilities.</p>

        <h3>This Is Why NexFrontier Exists</h3>
        <p>NexFrontier is not building another AI tool layer. We are building operational infrastructure for AI-mediated markets.</p>
        <p>Our thesis is simple: in the AI era, operational readiness matters more than perfect data readiness. Businesses will not fail because their databases were imperfect. They will fail because their operations could not respond, execute, and adapt fast enough.</p>
        <p>That distinction is strategically important for NZ and Australia. Because much of the region is still approaching AI through long transformation programmes, governance frameworks, restructuring exercises, cloud migration, and technology modernisation roadmaps. Meanwhile, customer expectations compress, AI-mediated decision cycles accelerate, and operational responsiveness increasingly shapes competitiveness. The market may not wait for enterprises to finish transforming themselves.</p>

        <h3>Why New Zealand Matters Strategically</h3>
        <p>For NexFrontier, New Zealand is not merely a small market. It is one of the world's most strategically valuable proving grounds for operational trust infrastructure.</p>
        <p>New Zealand combines high institutional trust expectations, operational conservatism, governance sensitivity, strong SME density, and increasing pressure for productivity improvement.</p>
        <p>If operational infrastructure can succeed in New Zealand's cautious, trust-sensitive environment, it signals something deeper than technical capability. It signals operational reliability. That matters globally.</p>

        <h3>Why Australia Matters Strategically</h3>
        <p>Australia represents a different but complementary opportunity. The country is increasingly positioning itself as an AI infrastructure economy, a regional compute hub, and a large-scale enterprise adoption market.</p>
        <p>But Australian enterprise leaders are also increasingly warning that governance uncertainty, fragmented regulation, and operational complexity could slow the region's productivity gains if execution capability does not improve fast enough.</p>
        <p>This creates a major opening for operational orchestration infrastructure: systems capable of reducing Human Latency, strengthening execution continuity, improving responsiveness, and stabilising AI-mediated operations without requiring full enterprise reconstruction first.</p>

        <h3>The Real Regional Shift</h3>
        <p>The biggest misconception in the current AI cycle is that the race will be won primarily through model capability, software proliferation, or AI experimentation.</p>
        <p>Across New Zealand and Australia, the evidence increasingly suggests something else: the organisations that succeed will not necessarily be the most technologically advanced. They will be the ones operationally capable of functioning in AI-mediated markets, reducing friction, improving continuity, strengthening operational trust, and reliably turning intent into outcomes while competitors are still modernising internally.</p>
        <p>That is the frontier NexFrontier is built for.</p>
      </>
    ),
  },
  'new-zealand-agentic-ai-opportunity': {
    title: "New Zealand's Agentic AI Opportunity in Professional Services",
    date: 'Apr 2026',
    readTime: '5 min read',
    category: 'New Zealand',
    excerpt: "NZ firms punch above their weight in services exports. Agentic infrastructure could be the multiplier that lets small teams compete globally.",
    body: (
      <>
        <p>New Zealand's professional services sector, legal, financial, advisory, architecture, engineering, consistently produces globally competitive firms from a small domestic market. The quality of output is rarely the constraint. The constraint is scale: there are only so many billable hours in a team.</p>
        <h3>Agentic AI as a leverage mechanism</h3>
        <p>Agentic infrastructure changes this calculus. An adviser supported by well-integrated AI systems can handle a client portfolio that would previously have required a larger team. A legal firm with reliable document intelligence and matter management automation can compete for work at a scale previously reserved for larger practices.</p>
        <p>This isn't about replacing professional judgement. It's about removing the operational overhead that consumes professional time without generating professional value.</p>
        <h3>The export dimension</h3>
        <p>For NZ firms with international clients, and there are more than most appreciate, the ability to operate in multiple time zones without proportional headcount is a genuine competitive advantage. Agentic systems that can handle routine client communication, documentation, and status updates across time zones let small NZ teams punch at a global weight.</p>
      </>
    ),
  },
};

const categoryToTab: Record<string, string> = {
  'Global': 'global',
  'Malaysia': 'malaysia',
  'New Zealand': 'new-zealand',
};

function parseIsoDate(label: string): string {
  const d = new Date(`1 ${label}`);
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

export default function BlogPost({ slug, onBack }: { slug: string; onBack: (tab: string) => void }) {
  const post = posts[slug];

  useMeta({
    title: post ? `${post.title} - NexFrontier` : 'Blog - NexFrontier',
    description: post ? post.excerpt : 'Insights on operational reliability, agentic AI, and the infrastructure that makes AI-mediated enterprise work reliably at scale.',
    ogUrl: `/#/blog/${slug}`,
  });

  useJsonLd(post ? [
    {
      '@type': 'Article',
      '@id': `https://nexfrontier.my/#/blog/${slug}`,
      'headline': post.title,
      'description': post.excerpt,
      'datePublished': parseIsoDate(post.date),
      'dateModified': parseIsoDate(post.date),
      'author': {
        '@id': 'https://nexfrontier.my/#organization',
        '@type': 'Organization',
        'name': 'NexFrontier',
      },
      'publisher': { '@id': 'https://nexfrontier.my/#organization' },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://nexfrontier.my/#/blog/${slug}`,
        'url': `https://nexfrontier.my/#/blog/${slug}`,
        'name': `${post.title} - NexFrontier`,
        'isPartOf': { '@id': 'https://nexfrontier.my/#website' },
      },
      'articleSection': post.category,
      'inLanguage': 'en',
      'keywords': [
        'NexFrontier',
        'Operational Reliability',
        'Agentic AI',
        'AI Infrastructure',
        post.category,
      ],
    },
  ] : {
    '@type': 'WebPage',
    '@id': `https://nexfrontier.my/#/blog/${slug}`,
    'url': `https://nexfrontier.my/#/blog/${slug}`,
    'name': 'Blog - NexFrontier',
    'isPartOf': { '@id': 'https://nexfrontier.my/#website' },
  });

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    const tab = post ? (categoryToTab[post.category] ?? 'global') : 'global';
    onBack(tab);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker flex items-center justify-center">
        <div className="text-center">
          <p className="font-urbanist text-nex-cyan text-2xl font-bold mb-4">Post not found</p>
          <a href="/#blog" className="font-inter text-nex-grey hover:text-nex-cyan transition-colors text-sm">
            ← Back to blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-nex-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-nex-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 font-inter text-nex-grey hover:text-nex-cyan transition-colors text-sm mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-nex-cyan/10 border border-nex-cyan/25 font-inter text-nex-cyan text-xs font-bold uppercase tracking-widest">
              {post.category}
            </span>
          </div>

          <h1 className="font-urbanist text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>

          <p className="font-inter text-nex-grey text-base leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-5 font-inter text-nex-grey/50 text-xs mb-10 pb-8 border-b border-nex-cyan/10">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <div className="prose-blog font-inter text-nex-grey text-base leading-relaxed space-y-5">
            {post.body}
          </div>

          {slug === 'gartner-bq-2q26-ai-roi-operational-readiness' && <ReportDownloadCard />}
          {slug === 'mckinsey-2025-sustainable-inclusive-growth-capability-challenge' && <McKinseyReportCard />}

          {/* Research series cross-links */}
          <div className="mt-12 pt-8 border-t border-nex-cyan/10">
            <p className="font-inter text-nex-grey/60 text-xs uppercase tracking-widest mb-4">Also in this series</p>
            <div className="grid sm:grid-cols-3 gap-3 mb-10">
              {[
                { href: '#/reading-the-shift', label: 'AI Adoption Is Splitting Into Two Different Market Economies' },
                { href: '#/data-readiness-index', label: 'The Data Readiness Index' },
                { href: '#/agentic-ai-cx-frontline', label: 'Agentic AI CX Frontline' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="px-4 py-3 rounded-xl border border-nex-cyan/20 hover:border-nex-cyan/50 hover:bg-nex-cyan/5 transition-all duration-300 group"
                >
                  <p className="font-inter text-nex-text text-xs font-medium group-hover:text-nex-cyan transition-colors duration-300 leading-snug">{label}</p>
                </a>
              ))}
            </div>

            <p className="font-inter text-nex-grey text-sm mb-4">
              Interested in how this applies to your business?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/#beta-access"
                className="font-inter inline-flex items-center gap-2 px-6 py-2.5 bg-nex-cyan text-nex-dark font-semibold text-sm rounded-full hover:shadow-glow-cyan-lg transition-all duration-300"
              >
                Apply for BETA Access
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/#calculate-quiet-loss"
                className="font-inter inline-flex items-center gap-2 px-6 py-2.5 border border-nex-cyan/60 text-nex-cyan font-semibold text-sm rounded-full hover:bg-nex-cyan/10 transition-all duration-300"
              >
                Calculate Your Quiet Loss
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
