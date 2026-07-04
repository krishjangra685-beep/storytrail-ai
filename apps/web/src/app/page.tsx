'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search, BookOpen, Camera, Map, Calendar, Star, Compass,
  Stamp, ChevronRight, Sparkles, Globe, ArrowRight, Play
} from 'lucide-react';

const features = [
  { icon: Search, label: 'Discover', desc: 'AI-curated attractions, hidden gems & local restaurants', href: '/discover', color: 'from-violet-500/20 to-purple-500/10 border-violet-500/20' },
  { icon: BookOpen, label: 'Story Mode', desc: 'Cinematic storytelling as Historian, Elder or Traveler', href: '/story', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/20', badge: 'FLAGSHIP' },
  { icon: Camera, label: 'Vision Scanner', desc: 'Point camera at anything. Get instant cultural insights', href: '/scanner', color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20' },
  { icon: Map, label: 'Trip Planner', desc: 'AI-crafted day-by-day itineraries tailored to you', href: '/planner', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20' },
  { icon: Calendar, label: 'Local Events', desc: 'Festivals, markets, cultural shows & heritage events', href: '/events', color: 'from-rose-500/20 to-pink-500/10 border-rose-500/20' },
  { icon: Star, label: 'Experiences', desc: 'Authentic cooking classes, craft workshops & village walks', href: '/experiences', color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/20' },
  { icon: Stamp, label: 'Cultural Passport', desc: 'Collect experiences & generate your AI travel journal', href: '/passport', color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/20' },
];

const stats = [
  { label: 'Destinations', value: '195+' },
  { label: 'Stories Generated', value: '10K+' },
  { label: 'Hidden Gems Found', value: '50K+' },
  { label: 'Experiences', value: '∞' },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-40" />
        <div className="orb orb-blue w-[500px] h-[500px] top-[40%] right-[-150px] opacity-30" />
        <div className="orb orb-cyan w-[400px] h-[400px] bottom-[10%] left-[20%] opacity-20" />
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass border border-violet-500/20 px-4 py-2 rounded-full text-sm text-violet-300 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          </motion.div>

          {/* Title */}
          <h1 className="text-hero text-white mb-6 leading-tight">
            Don&apos;t Just Visit
            <br />
            <span className="gradient-text">Places.</span>
            <br />
            Live Their{' '}
            <span className="relative">
              <span className="gradient-text">Stories.</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover hidden gems, immerse yourself in cinematic storytelling, and connect
            with authentic cultural experiences — all powered by Gemini AI.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/discover"
              className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
            >
              <Compass className="w-5 h-5" />
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/story"
              className="btn-glass flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold"
            >
              <Play className="w-4 h-4" />
              Watch Story Mode
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-20"
        >
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{value}</div>
              <div className="text-sm text-zinc-500 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-violet-400" />
          </div>
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-section text-white mb-4">
            Everything you need to{' '}
            <span className="gradient-text">travel deeper</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Seven AI-powered features that transform how you experience destinations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={feature.href} className="block h-full">
                <div className={`relative h-full glass bg-gradient-to-br ${feature.color} border rounded-2xl p-6 card-hover group`}>
                  {feature.badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{feature.label}</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs text-zinc-500 group-hover:text-violet-400 transition-colors">
                    Explore <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Mode highlight */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass bg-gradient-to-br from-amber-500/10 to-violet-500/10 border border-amber-500/20 rounded-3xl p-8 sm:p-12 overflow-hidden relative"
        >
          <div className="orb orb-purple w-64 h-64 top-[-50px] right-[-50px] opacity-30" />
          <div className="max-w-2xl relative">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full text-xs font-medium text-amber-400 mb-6">
              <Sparkles className="w-3 h-3" />
              FLAGSHIP FEATURE
            </div>
            <h2 className="text-display text-white mb-4">
              Story Mode
            </h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Every destination has three stories waiting to be told.
              Experience history through a{' '}
              <span className="text-amber-400">Historian</span>,{' '}
              <span className="text-emerald-400">Local Elder</span>, or{' '}
              <span className="text-blue-400">Traveler</span>{' '}
              — all generated live by Gemini AI.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { label: 'Historian Mode', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
                { label: 'Local Elder Mode', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
                { label: 'Traveler Mode', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
              ].map(({ label, color }) => (
                <span key={label} className={`text-sm px-4 py-2 rounded-xl border font-medium ${color}`}>
                  {label}
                </span>
              ))}
            </div>
            <Link
              href="/story"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
            >
              Explore Story Mode
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative max-w-3xl mx-auto px-4 text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Globe className="w-16 h-16 text-violet-400 mx-auto mb-6 animate-float" />
          <h2 className="text-display text-white mb-4">
            Ready to travel deeper?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Join thousands of travelers discovering the world through stories, culture, and authentic experiences.
          </p>
          <Link
            href="/discover"
            className="btn-primary inline-flex items-center gap-2 px-10 py-5 rounded-2xl text-lg font-semibold shadow-2xl shadow-violet-500/30"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
