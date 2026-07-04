'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  BookOpen, Loader2, Search, Sparkles, History, Users, Backpack,
  ChevronRight, Quote, Lightbulb, MapPin, Clock, Star
} from 'lucide-react';
import { generateStory } from '@/lib/api';
import type { StoryResponse, StoryMode } from '@/types';
import { cn, getModeDescription, getModeColor } from '@/lib/utils';

const storySchema = z.object({
  place: z.string().min(2, 'Enter a place name'),
  city: z.string().optional(),
  country: z.string().optional(),
  mode: z.enum(['historian', 'elder', 'traveler']),
});

type StoryForm = z.infer<typeof storySchema>;

const modes: { value: StoryMode; label: string; icon: typeof History; desc: string; color: string }[] = [
  {
    value: 'historian',
    label: 'Historian',
    icon: History,
    desc: 'Academic depth with engaging storytelling',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
  },
  {
    value: 'elder',
    label: 'Local Elder',
    icon: Users,
    desc: 'Oral traditions and personal memories',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
  },
  {
    value: 'traveler',
    label: 'Traveler',
    icon: Backpack,
    desc: 'First-hand wonder and discovery',
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30',
  },
];

const popularPlaces = [
  { place: 'Taj Mahal', city: 'Agra', country: 'India' },
  { place: 'Angkor Wat', city: 'Siem Reap', country: 'Cambodia' },
  { place: 'Colosseum', city: 'Rome', country: 'Italy' },
  { place: 'Machu Picchu', city: 'Cusco', country: 'Peru' },
  { place: 'Petra', city: 'Ma\'an', country: 'Jordan' },
  { place: 'Chichen Itza', city: 'Yucatan', country: 'Mexico' },
];

export default function StoryPage() {
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StoryForm>({
    resolver: zodResolver(storySchema),
    defaultValues: { mode: 'historian' },
  });

  const selectedMode = watch('mode');

  const onSubmit = async (data: StoryForm) => {
    setIsLoading(true);
    setError(null);
    setStory(null);
    try {
      const res = await generateStory(data);
      setStory(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Story generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedModeConfig = modes.find((m) => m.value === selectedMode);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-purple w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-25" />
        <div className="orb orb-blue w-[400px] h-[400px] bottom-[10%] left-[-100px] opacity-20" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass border border-amber-500/20 px-4 py-2 rounded-full text-sm text-amber-300 mb-6">
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            Flagship Feature
          </div>
          <h1 className="text-display text-white mb-4">
            Story <span className="gradient-text">Mode</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Every destination has three stories. Choose your narrator and experience
            places through cinematic AI storytelling powered by Gemini.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass border border-white/[0.08] rounded-3xl p-8 mb-8"
        >
          {/* Mode selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-zinc-300 mb-4">Choose your Narrator</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {modes.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setValue('mode', mode.value)}
                  className={cn(
                    'relative flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all',
                    selectedMode === mode.value
                      ? `bg-gradient-to-br ${mode.color} scale-[1.02] shadow-lg`
                      : 'glass border-white/[0.08] hover:border-white/[0.15]'
                  )}
                >
                  {selectedMode === mode.value && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                  <mode.icon className={cn('w-8 h-8', selectedMode === mode.value ? 'text-white' : 'text-zinc-400')} />
                  <div>
                    <div className={cn('font-semibold', selectedMode === mode.value ? 'text-white' : 'text-zinc-300')}>
                      {mode.label}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">{mode.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Place / Landmark *</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('place')}
                  placeholder="e.g. Taj Mahal, Angkor Wat, Eiffel Tower..."
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              {errors.place && <p className="text-xs text-red-400 mt-1">{errors.place.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">City (optional)</label>
                <input
                  {...register('city')}
                  placeholder="e.g. Agra"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Country (optional)</label>
                <input
                  {...register('country')}
                  placeholder="e.g. India"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gemini is crafting your story...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Generate {selectedModeConfig?.label} Story
                </>
              )}
            </button>
          </form>

          {/* Popular places */}
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-zinc-500 mb-3">Try a popular place:</p>
            <div className="flex flex-wrap gap-2">
              {popularPlaces.map((p) => (
                <button
                  key={p.place}
                  onClick={() => { setValue('place', p.place); setValue('city', p.city); setValue('country', p.country); }}
                  className="text-xs text-zinc-400 hover:text-white bg-white/[0.04] border border-white/[0.06] hover:border-violet-500/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  {p.place}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Story Result */}
        <AnimatePresence>
          {story && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Mode badge */}
              <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border bg-gradient-to-r', getModeColor(story.mode))}>
                {story.mode === 'historian' && <History className="w-4 h-4" />}
                {story.mode === 'elder' && <Users className="w-4 h-4" />}
                {story.mode === 'traveler' && <Backpack className="w-4 h-4" />}
                {getModeDescription(story.mode)}
              </div>

              {/* Main narrative */}
              <div className="glass border border-white/[0.08] rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-2">{story.title}</h2>
                <p className="text-sm text-zinc-500 mb-6">About {story.place}</p>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-violet-500/30" />
                  <p className="prose-dark text-lg leading-relaxed pl-6">{story.narrative}</p>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" /> History
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{story.history}</p>
                </div>
                <div className="glass border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-violet-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Cultural Significance
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{story.culturalSignificance}</p>
                </div>
                {story.architecture && (
                  <div className="glass border border-white/[0.08] rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-blue-400 mb-3">🏛️ Architecture</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{story.architecture}</p>
                  </div>
                )}
                {story.localLegend && (
                  <div className="glass border border-amber-500/20 bg-amber-500/5 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-amber-400 mb-3">✨ Local Legend</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed italic">{story.localLegend}</p>
                  </div>
                )}
              </div>

              {/* Interesting facts */}
              <div className="glass border border-white/[0.08] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" /> Fascinating Facts
                </h3>
                <div className="space-y-2">
                  {story.interestingFacts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold text-sm mt-0.5">{i + 1}.</span>
                      <p className="text-zinc-400 text-sm leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby recommendations */}
              <div className="glass border border-white/[0.08] rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Nearby Recommendations
                </h3>
                <div className="space-y-2">
                  {story.nearbyRecommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-zinc-400 text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best time */}
              <div className="glass border border-white/[0.08] rounded-2xl p-5 flex items-center gap-4">
                <Clock className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-300">Best Time to Visit</p>
                  <p className="text-zinc-400 text-sm mt-0.5">{story.bestTimeToVisit}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
