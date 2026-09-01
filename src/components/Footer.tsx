import { motion } from 'framer-motion';

function LinkedInIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
      <rect width="24" height="24" rx="4" fill="#0A66C2"/>
      <path fill="#fff" d="M7.75 9.5h-2.5v8h2.5v-8zm-1.25-1a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10.5 1c-1.38 0-2.25.75-2.5 1.25V9.5h-2.5v8h2.5v-4.25c0-1.1.9-1.75 1.75-1.75s1.75.65 1.75 1.75V17.5h2.5v-4.75c0-2.62-1.5-3.25-3.5-3.25z"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
      <circle cx="12" cy="12" r="12" fill="#25D366"/>
      <path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const LINKEDIN_URL = 'https://www.linkedin.com/company/nexfrontier';

const countries = [
  {
    country: 'Malaysia',
    email: 'hello@nexfrontier.my',
    whatsapp: '60179569088',
    whatsappDisplay: '+60 17 956 9088',
    linkedin: LINKEDIN_URL,
    address: 'L9, Menara Public Gold @TRX\n50400 Kuala Lumpur',
    badge: {
      label: 'MSC Status - MDigital',
      sublabel: 'MDEC Accredited',
    },
  },
  {
    country: 'New Zealand',
    email: 'hello@nexfrontierlogic.nz',
    whatsapp: '64219496932',
    whatsappDisplay: '+64 21 94 96 93',
    linkedin: LINKEDIN_URL,
    address: null,
    badge: null,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-nex-cyan/10 pt-8 pb-8 md:pt-10 md:pb-10 -mt-10" id="contact">
      <div className="container-wide mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
        >
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-0 mb-6 pb-6 border-b border-nex-cyan/10">

            {/* Brand */}
            <div className="lg:w-[42%] lg:pr-16 shrink-0 flex flex-col items-center lg:items-start self-start">
              <img src="/Crop_Image.png" alt="NexFrontier" className="h-12 w-auto object-contain object-center mb-5" />
              <div className="flex flex-col sm:flex-row gap-6 w-full">
                {countries.map(({ country, email, whatsapp, whatsappDisplay, linkedin, address, badge }) => (
                  <div key={country} className="flex flex-col gap-2">
                    <span className="font-inter text-nex-grey text-xs uppercase tracking-widest mb-0.5">{country}</span>
                    <a href={`mailto:${email}`} className="font-inter text-nex-cyan text-xs hover:text-nex-cyan/70 transition-colors duration-300">{email}</a>
                    {address && (
                      <p className="font-inter text-nex-grey/80 text-[10px] leading-snug whitespace-pre-line">{address}</p>
                    )}
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-inter text-nex-grey text-xs hover:text-nex-cyan transition-colors duration-300"
                    >
                      <WhatsAppIcon size={11} />
                      {whatsappDisplay}
                    </a>
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-inter text-nex-grey text-xs hover:text-nex-cyan transition-colors duration-300"
                    >
                      <LinkedInIcon size={11} />
                      LinkedIn
                    </a>
                    {badge && (
                      <div className="mt-2 inline-flex items-center gap-2 border border-nex-cyan/20 rounded px-2.5 py-1.5 bg-nex-cyan/5 w-fit">
                        <div className="flex flex-col">
                          <span className="font-urbanist text-nex-cyan text-[10px] font-semibold tracking-wide leading-tight">{badge.label}</span>
                          <span className="font-inter text-nex-grey/80 text-[10px] leading-tight">{badge.sublabel}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            <div className="flex flex-wrap sm:flex-nowrap gap-10 lg:gap-0 lg:flex-1 lg:justify-between mb-4 self-start">

              {/* Product */}
              <div className="min-w-[120px]">
                <h4 className="font-urbanist text-nex-text font-semibold text-xs uppercase tracking-widest mb-5">Product</h4>
                <ul className="space-y-2">
                  {[
                    { label: 'BETA Programme', href: '#beta-programme' },
                    { label: 'QL Calc Example', href: '#/case-example' },
                    { label: 'Exemplar Videos', href: '#/exemplar-videos' },
                    { label: 'FAQs', href: '#/faq' },
                  ].map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="font-inter text-white hover:text-nex-cyan text-sm transition-colors duration-300">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div className="min-w-[100px]">
                <h4 className="font-urbanist text-nex-text font-semibold text-xs uppercase tracking-widest mb-5">Company</h4>
                <ul className="space-y-2">
                  {[
                    { label: 'About', href: '#what-nexfrontier-does' },
                    { label: 'Blogs', href: '#blog' },
                    { label: 'Careers', href: '#/careers' },
                  ].map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="font-inter text-white hover:text-nex-cyan text-sm transition-colors duration-300">{link.label}</a>
                    </li>
                  ))}
                  <li>
                    <a href="#/privacy" className="group relative inline-flex items-center gap-1 font-inter text-white hover:text-nex-cyan text-sm transition-colors duration-300">
                      Privacy &amp; Setting Policies
                      <span className="text-nex-grey/70 group-hover:text-nex-cyan transition-colors duration-300 text-xs font-bold leading-none">?</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Reading the Shift */}
              <div className="min-w-[160px] max-w-[220px]">
                <h4 className="font-urbanist text-nex-text font-semibold text-xs uppercase tracking-widest mb-5 flex items-center gap-1.5">
                  Reading The Shift in 2026
                  <span className="relative group">
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-nex-grey/40 text-nex-grey/50 hover:border-nex-cyan hover:text-nex-cyan cursor-default transition-colors duration-200 text-[9px] font-bold leading-none select-none">i</span>
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-nex-dark border border-nex-cyan/20 rounded-lg px-3 py-2.5 text-nex-grey font-inter font-normal text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50 normal-case tracking-normal">
                      A curated set of reports and research that inform how the AI-mediated economy is evolving, and how NexFrontier remains relevant.
                      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-nex-cyan/20" />
                    </span>
                  </span>
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: 'EY Global AI Sentiment', href: '#/reading-the-shift' },
                    { label: 'Cloudera Data Readiness Index', href: '#/data-readiness-index' },
                    { label: 'NiCE Agentic AI CX Frontline', href: '#/agentic-ai-cx-frontline' },
                  ].map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="font-inter text-white hover:text-nex-cyan text-sm transition-colors duration-300 leading-snug block">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 -mt-10">
            <p className="font-inter text-nex-grey/50 text-sm leading-none text-center w-full">
              © {currentYear} NexFrontier. All rights reserved.
            </p>
          </div>

        </motion.div>
      </div>
    </footer>
  );
}
