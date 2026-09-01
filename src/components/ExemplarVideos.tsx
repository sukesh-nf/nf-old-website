import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { useMeta } from '../lib/useMeta';
import { useJsonLd } from '../lib/useJsonLd';

const VIDEOS = [
  {
    title: 'NexFrontier Simple Use Case',
    description: 'A walkthrough of how NexFrontier detects quiet loss and recovers revenue through intelligent operational infrastructure.',
    url: 'https://wufxwblizgnizssdejhn.supabase.co/storage/v1/object/public/exemplar-videos/1779656260257-NexFrontier_Simple_Use_Case_Mar26.mp4',
  },
];

export default function ExemplarVideos() {
  useMeta({
    title: 'Exemplar Videos - NexFrontier',
    description: 'Watch NexFrontier in action: see how our operational reliability infrastructure detects quiet loss and recovers revenue in real enterprise environments.',
    ogUrl: '/#/exemplar-videos',
  });
  useJsonLd([
    {
      '@type': 'WebPage',
      '@id': 'https://nexfrontier.my/#/exemplar-videos',
      'url': 'https://nexfrontier.my/#/exemplar-videos',
      'name': 'Exemplar Videos - NexFrontier',
      'description': 'Watch NexFrontier in action: see how operational reliability infrastructure detects quiet loss and recovers revenue in real enterprise environments.',
      'isPartOf': { '@id': 'https://nexfrontier.my/#website' },
      'publisher': { '@id': 'https://nexfrontier.my/#organization' },
      'inLanguage': 'en',
    },
    {
      '@type': 'VideoObject',
      'name': 'NexFrontier Simple Use Case',
      'description': 'A walkthrough of how NexFrontier detects quiet loss and recovers revenue through intelligent operational infrastructure.',
      'contentUrl': 'https://wufxwblizgnizssdejhn.supabase.co/storage/v1/object/public/exemplar-videos/1779656260257-NexFrontier_Simple_Use_Case_Mar26.mp4',
      'uploadDate': '2026-03-01',
      'publisher': { '@id': 'https://nexfrontier.my/#organization' },
      'inLanguage': 'en',
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

          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 border border-nex-cyan/30 rounded-full text-nex-cyan/80 text-sm font-medium">
              <Play size={14} />
              Exemplar Videos
            </div>
            <h1 className="font-urbanist text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              See It In <span className="text-nex-cyan">Action</span>
            </h1>
            <p className="font-inter text-nex-grey text-lg leading-relaxed">
              Short-form walkthroughs showing how NexFrontier operates in real scenarios  - from detecting quiet loss to recovering revenue at scale.
            </p>
          </div>

          <div className="grid gap-10 max-w-4xl">
            {VIDEOS.map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="p-6 md:p-8 bg-gradient-to-br from-nex-navy/50 to-nex-darker/50 border border-nex-cyan/20 rounded-xl backdrop-blur-sm"
              >
                <h2 className="font-urbanist text-xl font-bold text-white mb-2">{video.title}</h2>
                <p className="font-inter text-nex-grey text-sm leading-relaxed mb-6">{video.description}</p>
                <div className="rounded-lg overflow-hidden border border-nex-cyan/15 bg-nex-dark/60">
                  <video
                    controls
                    preload="metadata"
                    className="w-full aspect-video"
                    src={video.url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </motion.div>
            ))}

            {/* Funnel CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 border-t border-nex-cyan/10"
            >
              <p className="font-urbanist text-white font-bold text-xl md:text-2xl mb-2">
                Ready to see this in your business?
              </p>
              <p className="font-inter text-nex-grey text-sm leading-relaxed mb-6 max-w-xl">
                Apply for the beta programme and get NexFrontier deployed inside your operations - or calculate what quiet loss is already costing you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/#beta-access"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-nex-cyan text-nex-dark font-inter font-semibold rounded-full hover:shadow-glow-cyan-lg transition-all duration-300 text-sm"
                >
                  Apply for BETA Access
                  <ArrowRight size={14} />
                </a>
                <a
                  href="/#calculate-quiet-loss"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-nex-cyan/60 text-nex-cyan font-inter font-semibold rounded-full hover:bg-nex-cyan/10 transition-all duration-300 text-sm"
                >
                  Calculate Your Quiet Loss
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
