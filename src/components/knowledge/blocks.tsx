import { Lightbulb, Quote, Info, Target, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

export function KeyInsight({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 rounded-2xl border border-nex-cyan/30 bg-gradient-to-br from-nex-cyan/[0.08] to-nex-blue/[0.04] p-6 md:p-7">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-nex-cyan" />
        <span className="font-urbanist text-xs font-bold uppercase tracking-widest text-nex-cyan">
          Key Insight
        </span>
      </div>
      <div className="font-inter text-nex-text text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function PullQuote({ children, author }: { children: ReactNode; author?: string }) {
  return (
    <blockquote className="my-8 border-l-2 border-nex-cyan/50 pl-6 pr-2 py-2">
      <Quote size={20} className="text-nex-cyan/40 mb-2" />
      <p className="font-urbanist text-lg md:text-xl text-white font-medium leading-snug italic">
        {children}
      </p>
      {author && (
        <p className="font-inter text-nex-grey text-sm mt-3">- {author}</p>
      )}
    </blockquote>
  );
}

export function DidYouKnow({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
      <div className="flex items-center gap-2 mb-3">
        <Info size={16} className="text-nex-blue" />
        <span className="font-urbanist text-xs font-bold uppercase tracking-widest text-nex-blue">
          Did You Know?
        </span>
      </div>
      <div className="font-inter text-nex-grey text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function ExecutiveTip({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 rounded-2xl border border-nex-cyan/20 bg-nex-navy/40 p-6 md:p-7">
      <div className="flex items-center gap-2 mb-3">
        <Target size={16} className="text-nex-cyan" />
        <span className="font-urbanist text-xs font-bold uppercase tracking-widest text-nex-cyan">
          Executive Tip
        </span>
      </div>
      <div className="font-inter text-nex-text text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function CalloutPanel({
  title,
  children,
  href,
  ctaLabel,
}: {
  title: string;
  children: ReactNode;
  href: string;
  ctaLabel: string;
}) {
  return (
    <div className="my-8 rounded-2xl border border-nex-cyan/25 bg-gradient-to-br from-nex-navy/80 to-nex-darker/80 overflow-hidden shadow-[0_0_0_1px_rgba(24,213,255,0.06),0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="px-6 py-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={18} className="text-nex-cyan" />
          <span className="font-urbanist text-sm font-bold text-white">{title}</span>
        </div>
        <p className="font-inter text-nex-grey text-sm leading-relaxed mb-4">
          {children}
        </p>
        <a
          href={href}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-nex-cyan text-nex-dark font-inter font-bold text-sm rounded-full hover:shadow-[0_0_18px_rgba(24,213,255,0.45)] active:scale-95 transition-all duration-200"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
