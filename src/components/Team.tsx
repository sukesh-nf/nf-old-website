import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { useMeta } from '../lib/useMeta';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

function LinkedInLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white" />
      <circle cx="6.25" cy="6.75" r="1.5" fill="white" />
      <path d="M19 19H16.5V14.25C16.5 13.0074 15.4926 12 14.25 12C13.0074 12 12 13.0074 12 14.25V19H9.5V9.5H12V10.8531C12.6578 9.97547 13.7393 9.5 14.875 9.5C17.1531 9.5 19 11.3469 19 13.625V19Z" fill="white" />
    </svg>
  );
}

const members = [
  {
    name: 'Sukesh Sukumaran',
    role: 'Founder / CEO',
    linkedin: 'https://www.linkedin.com/in/sukeshsukumaran',
    photo: '/sukesh_pic.png',
    bio: [
      'Sukesh Sukumaran is a strategist, operator, and venture builder who has spent his career helping organisations navigate periods of significant change.',
      'Working across technology, education, economic development, and renewable energy, he repeatedly encountered the same challenge: organisations often lose value not because they lack strategy, talent, or opportunity, but because operational readiness fails to keep pace with change.',
      'That observation became the foundation for NexFrontier.',
      'Today, he leads NexFrontier\'s mission to help organisations become more operationally ready, resilient, and trusted in a world increasingly shaped by AI, automation, and accelerating complexity.',
    ],
  },
  {
    name: 'Chris Stanley',
    role: 'Co-Founder / GM, Commercial & Partnerships (Malaysia)',
    linkedin: 'https://www.linkedin.com/in/chris-s-1a48b13b7/',
    photo: '/chris_pic.png',
    bio: [
      'Chris Stanley is a commercial strategist and operator whose career has focused on helping businesses unlock growth through customer experience, asset optimisation, and market expansion.',
      'Across retail, property, and destination development, he has worked at the intersection of commercial performance and customer engagement, helping organisations translate opportunity into sustainable business outcomes.',
      'Throughout that journey, he developed a deep appreciation for the realities of customer behaviour, operational execution, and the factors that determine whether growth initiatives succeed in practice.',
      'At NexFrontier, Chris leads commercial validation, strategic partnerships, and market development, helping organisations strengthen the operational foundations required to earn trust, capture demand, and grow in an increasingly AI-mediated economy.',
    ],
  },
  {
    name: 'Nela Muttettuwegama',
    role: 'Head, Systems & Intelligence',
    linkedin: 'https://www.linkedin.com/in/nela-muttettuwegama/',
    photo: '/nela_pic.jpeg',
    bio: [
      'Nela Muttettuwegama is a systems architect and AI builder whose career has spanned large-scale operations management, business development, and enterprise automation across Sri Lanka, Europe and New Zealand.',
      'Having directed complex operations, built multi-agent AI systems, and worked at the intersection of human decision-making and commercial outcomes, his work has consistently focused on one question: how do organisations translate intent into reliable results.',
      'At NexFrontier, he leads the development of the company\'s core technology and intelligence capabilities. His focus is on translating complex operational challenges into practical, scalable solutions that help organisations make better decisions, execute with greater confidence, and realise measurable business value.',
    ],
  },
];

function MemberCard({ member, delay }: { member: typeof members[number]; delay: number }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="group relative flex flex-col sm:flex-row gap-7 bg-gradient-to-br from-nex-navy/50 to-nex-darker/60 border border-nex-cyan/35 shadow-glow-cyan rounded-2xl overflow-hidden transition-all duration-300 p-7"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,255,0.05)_0%,transparent_55%)] pointer-events-none" />

      {/* Photo */}
      <div className="relative shrink-0 w-full sm:w-44 rounded-xl overflow-hidden border border-nex-cyan/15" style={{ minHeight: '220px' }}>
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover object-top"
          style={{ minHeight: '220px' }}
        />
      </div>

      {/* Bio */}
      <div className="relative flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-urbanist text-2xl font-bold text-white">{member.name}</h2>
            <p className="font-inter text-nex-cyan text-sm font-medium mt-0.5">{member.role}</p>
          </div>
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0A66C2]/10 border border-[#0A66C2]/30 rounded-full font-inter text-xs text-[#70b5f9] hover:bg-[#0A66C2]/25 hover:border-[#0A66C2]/70 transition-all duration-200 shrink-0"
          >
            <LinkedInLogo size={14} />
            LinkedIn
          </a>
        </div>
        <div className="space-y-3">
          {member.bio.map((para, j) => (
            <p key={j} className="font-inter text-nex-grey text-sm leading-relaxed">{para}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  useMeta({
    title: 'Meet The Team | NexFrontier',
    description: 'The people behind NexFrontier, building operational reliability infrastructure for the AI-mediated economy.',
    ogTitle: 'Meet The Team | NexFrontier',
    ogDescription: 'The people behind NexFrontier.',
  });

  const [founder, ...rest] = members;

  return (
    <div className="relative bg-gradient-to-b from-nex-dark via-nex-navy to-nex-darker min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.07)_0%,transparent_65%)] pointer-events-none" />

      <div className="container-wide relative py-16 md:py-24">
        {/* Back link */}
        <motion.div {...fadeUp()}>
          <a
            href="#/"
            className="inline-flex items-center gap-2 font-inter text-sm text-nex-grey hover:text-nex-cyan transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            Back
          </a>
        </motion.div>

        {/* Header */}
        <motion.div {...fadeUp(0.06)} className="mt-10 mb-14">
          <span className="font-inter text-xs font-medium tracking-widest uppercase text-nex-cyan/70 mb-3 block">
            The People
          </span>
          <h1 className="font-urbanist text-4xl sm:text-5xl font-bold text-white mb-4">
            Meet The Team
          </h1>
          <p className="font-inter text-nex-grey text-base max-w-xl leading-relaxed">
            The minds building NexFrontier, combining deep enterprise experience with a conviction that AI reliability is the defining operational challenge of this decade.
          </p>
        </motion.div>

        {/* Founder card with embedded video */}
        <motion.div
          {...fadeUp(0.1)}
          className="group relative bg-gradient-to-br from-nex-navy/50 to-nex-darker/60 border border-nex-cyan/35 shadow-glow-cyan rounded-2xl overflow-hidden transition-all duration-300 p-7 mb-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,255,0.05)_0%,transparent_55%)] pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row gap-7">
            {/* Left column: photo + video stacked */}
            <div className="shrink-0 flex flex-col gap-4 w-full lg:w-64">
              {/* Photo */}
              <div className="rounded-xl overflow-hidden border border-nex-cyan/15" style={{ minHeight: '260px' }}>
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="w-full h-full object-cover object-top"
                  style={{ minHeight: '260px' }}
                />
              </div>

              {/* Founder's Video placeholder */}
              <div className="relative rounded-xl overflow-hidden border border-nex-cyan/20 bg-nex-navy/70 aspect-video flex items-center justify-center cursor-pointer group/vid hover:border-nex-cyan/50 transition-all duration-300">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.09)_0%,transparent_70%)]" />
                <div className="relative flex flex-col items-center gap-2.5">
                  <div className="w-11 h-11 rounded-full bg-nex-cyan/15 border border-nex-cyan/40 flex items-center justify-center group-hover/vid:bg-nex-cyan/25 group-hover/vid:border-nex-cyan/70 transition-all duration-300">
                    <Play size={18} className="text-nex-cyan ml-0.5" fill="currentColor" />
                  </div>
                  <p className="font-inter text-xs text-nex-grey/60 text-center leading-tight">Founder's Video<br />coming soon</p>
                </div>
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-nex-darker/80 border border-nex-cyan/20 rounded-full">
                  <span className="font-inter text-[10px] text-nex-cyan/60 font-medium">Founder's Message</span>
                </div>
              </div>
            </div>

            {/* Right column: bio */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-urbanist text-2xl font-bold text-white">{founder.name}</h2>
                  <p className="font-inter text-nex-cyan text-sm font-medium mt-0.5">{founder.role}</p>
                </div>
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0A66C2]/10 border border-[#0A66C2]/30 rounded-full font-inter text-xs text-[#70b5f9] hover:bg-[#0A66C2]/25 hover:border-[#0A66C2]/70 transition-all duration-200 shrink-0"
                >
                  <LinkedInLogo size={14} />
                  LinkedIn
                </a>
              </div>
              <div className="space-y-3">
                {founder.bio.map((para, j) => (
                  <p key={j} className="font-inter text-nex-grey text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div {...fadeUp(0.16)} className="border-t border-nex-cyan/10 mb-10" />

        {/* Remaining team members */}
        <div className="space-y-10">
          {rest.map((member, i) => (
            <MemberCard key={member.name} member={member} delay={0.18 + i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
}
