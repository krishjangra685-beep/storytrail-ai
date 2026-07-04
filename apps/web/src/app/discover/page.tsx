'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Search, Loader2, MapPin, Star, Gem, Camera, Utensils, Landmark, ChevronDown,
  Clock, DollarSign, Tag, Heart, Sparkles
} from 'lucide-react';
import { discoverDestination } from '@/lib/api';
import type { DiscoverResponse, Attraction } from '@/types';
import { cn, getCategoryEmoji, getPriceIcon } from '@/lib/utils';

const discoverSchema = z.object({
  destination: z.string().min(2, 'Enter a destination'),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  travelStyle: z.enum(['adventure', 'cultural', 'relaxed', 'foodie', 'photography', 'spiritual']),
  mood: z.string().min(2, 'Describe your mood'),
  duration: z.coerce.number().int().min(1).max(30),
});

type DiscoverForm = z.infer<typeof discoverSchema>;

const tabs = [
  { key: 'attractions', label: 'Attractions', icon: MapPin },
  { key: 'hiddenGems', label: 'Hidden Gems', icon: Gem },
  { key: 'restaurants', label: 'Food', icon: Utensils },
  { key: 'photoSpots', label: 'Photo Spots', icon: Camera },
  { key: 'culturalPlaces', label: 'Culture', icon: Landmark },
] as const;

type TabKey = (typeof tabs)[number]['key'];

function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border border-white/[0.08] rounded-2xl p-5 card-hover group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryEmoji(attraction.category)}</span>
          <div>
            <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">{attraction.name}</h3>
            <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {attraction.address}
            </p>
          </div>
        </div>
        {attraction.isHiddenGem && (
          <span className="flex-shrink-0 text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
            HIDDEN GEM
          </span>
        )}
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed mb-3">{attraction.description}</p>

      {attraction.whySpecial && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-3">
          <p className="text-xs text-emerald-400 font-medium mb-1">Why it&apos;s special</p>
          <p className="text-xs text-zinc-300">{attraction.whySpecial}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {attraction.rating && (
          <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3" fill="currentColor" /> {attraction.rating}
          </span>
        )}
        {attraction.priceRange && (
          <span className="text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2 py-1 rounded-lg">
            {getPriceIcon(attraction.priceRange)}
          </span>
        )}
        {attraction.bestTime && (
          <span className="flex items-center gap-1 text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2 py-1 rounded-lg">
            <Clock className="w-3 h-3" /> {attraction.bestTime}
          </span>
        )}
        {attraction.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-1 rounded-lg">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function DiscoverPage() {
  const [result, setResult] = useState<DiscoverResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('attractions');

  const { register, handleSubmit, formState: { errors } } = useForm<DiscoverForm>({
    resolver: zodResolver(discoverSchema),
    defaultValues: { budget: 'moderate', travelStyle: 'cultural', duration: 5 },
  });

  const onSubmit = async (data: DiscoverForm) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await discoverDestination(data);
      setResult(res);
      setActiveTab('attractions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discovery failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const activeAttractions = result
    ? (result[activeTab] as Attraction[]) || []
    : [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass border border-violet-500/20 px-4 py-2 rounded-full text-sm text-violet-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI Destination Discovery
          </div>
          <h1 className="text-display text-white mb-4">
            Discover Your Next{' '}
            <span className="gradient-text">Adventure</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Tell us where you want to go and how you like to travel. Gemini AI will craft a personalized guide just for you.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto glass border border-white/[0.08] rounded-3xl p-8 mb-12"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Destination *
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('destination')}
                  placeholder="e.g. Jaipur, India / Tokyo, Japan / Rome, Italy"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              {errors.destination && <p className="text-xs text-red-400 mt-1">{errors.destination.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Budget</label>
                <select
                  {...register('budget')}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                >
                  <option value="budget">💰 Budget</option>
                  <option value="moderate">💳 Moderate</option>
                  <option value="luxury">💎 Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Duration (days)</label>
                <input
                  {...register('duration')}
                  type="number"
                  min="1"
                  max="30"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Travel Style</label>
              <select
                {...register('travelStyle')}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
              >
                <option value="adventure">🏔️ Adventure</option>
                <option value="cultural">🏛️ Cultural</option>
                <option value="relaxed">🌴 Relaxed</option>
                <option value="foodie">🍜 Foodie</option>
                <option value="photography">📸 Photography</option>
                <option value="spiritual">🕯️ Spiritual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Your Mood / Vibe *</label>
              <input
                {...register('mood')}
                placeholder="e.g. adventurous, peaceful, romantic, curious..."
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              {errors.mood && <p className="text-xs text-red-400 mt-1">{errors.mood.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gemini is curating your guide...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Discover with AI
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto"
          >
            {/* Overview */}
            <div className="glass border border-white/[0.08] rounded-3xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{result.destination}</h2>
              <p className="text-zinc-400 leading-relaxed mb-6">{result.overview}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Clock className="w-4 h-4 text-violet-400" />
                  Best time: <span className="text-white">{result.bestTimeToVisit}</span>
                </div>
              </div>
              {result.localTips.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-3">Local Tips</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.localTips.map((tip, i) => (
                      <span key={i} className="text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-xl">
                        💡 {tip}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2 mb-6">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                    activeTab === key
                      ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                      : 'glass border border-white/[0.08] text-zinc-400 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className="text-xs opacity-60">
                    ({(result[key] as Attraction[])?.length || 0})
                  </span>
                </button>
              ))}
            </div>

            {/* Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {activeAttractions.map((attraction, i) => (
                  <AttractionCard key={i} attraction={attraction} />
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
