'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Loader2, Search, Sparkles, Clock, Users, DollarSign, BookOpen, ChevronRight } from 'lucide-react';
import { getCulturalExperiences } from '@/lib/api';
import type { ExperiencesResponse, CulturalExperience } from '@/types';
import { cn, getCategoryEmoji, getDifficultyColor } from '@/lib/utils';

const experiencesSchema = z.object({
  destination: z.string().min(2, 'Enter a destination'),
  interests: z.string().min(2, 'Add interests'),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  duration: z.string().optional(),
});

type ExperiencesForm = z.infer<typeof experiencesSchema>;

function ExperienceCard({ exp }: { exp: CulturalExperience }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass border border-white/[0.08] rounded-2xl p-6 card-hover">
      <div className="flex items-start gap-4 mb-4">
        <span className="text-3xl">{getCategoryEmoji(exp.type)}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1">{exp.name}</h3>
          <p className="text-xs text-zinc-500">{exp.location}</p>
        </div>
        <span className={cn('text-xs font-semibold capitalize', getDifficultyColor(exp.difficulty))}>
          {exp.difficulty}
        </span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed mb-4">{exp.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2">
          <Clock className="w-3.5 h-3.5 text-blue-400" /> {exp.duration}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2">
          <DollarSign className="w-3.5 h-3.5 text-green-400" /> {exp.priceRange}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2">
          <Users className="w-3.5 h-3.5 text-violet-400" /> {exp.groupSize}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-400/10 border border-violet-400/20 rounded-lg px-3 py-2 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" /> {expanded ? 'Less' : 'Details'}
        </button>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-3">
        <p className="text-xs font-medium text-emerald-400 mb-1">Why it&apos;s authentic</p>
        <p className="text-xs text-zinc-300">{exp.whyAuthentic}</p>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          {exp.whatYouLearn.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-300 mb-2">What You&apos;ll Learn</p>
              <div className="flex flex-wrap gap-1.5">
                {exp.whatYouLearn.map((skill, i) => (
                  <span key={i} className="text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-zinc-300 mb-2">What to Expect</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{exp.whatToExpect}</p>
          </div>
          {exp.bookingTips.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-300 mb-2">Booking Tips</p>
              {exp.bookingTips.map((tip, i) => (
                <p key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                  <ChevronRight className="w-3 h-3 text-violet-400 flex-shrink-0 mt-0.5" /> {tip}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function ExperiencesPage() {
  const [result, setResult] = useState<ExperiencesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ExperiencesForm>({
    resolver: zodResolver(experiencesSchema),
    defaultValues: { budget: 'moderate' },
  });

  const onSubmit = async (data: ExperiencesForm) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const interests = data.interests.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await getCulturalExperiences({ ...data, interests });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find experiences.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass border border-yellow-500/20 px-4 py-2 rounded-full text-sm text-yellow-300 mb-6">
            <Star className="w-3.5 h-3.5" />
            Authentic Cultural Experiences
          </div>
          <h1 className="text-display text-white mb-4">
            Go Beyond <span className="gradient-text">Tourism</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Discover genuine cultural immersions — cooking classes, craft workshops, temple tours, and village walks curated by Gemini AI.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass border border-white/[0.08] rounded-3xl p-8 mb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Destination *</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input {...register('destination')} placeholder="e.g. Hoi An, Vietnam" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50" />
              </div>
              {errors.destination && <p className="text-xs text-red-400 mt-1">{errors.destination.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Budget</label>
                <select {...register('budget')} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50">
                  <option value="budget">💰 Budget</option>
                  <option value="moderate">💳 Moderate</option>
                  <option value="luxury">💎 Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Duration preference</label>
                <select {...register('duration')} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50">
                  <option value="">Any length</option>
                  <option value="half-day">Half day</option>
                  <option value="full-day">Full day</option>
                  <option value="multi-day">Multi-day</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Interests (comma-separated) *</label>
              <input {...register('interests')} placeholder="e.g. cooking, pottery, weaving, temple, music, dance" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50" />
              {errors.interests && <p className="text-xs text-red-400 mt-1">{errors.interests.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Finding authentic experiences...</> : <><Sparkles className="w-5 h-5" />Find Cultural Experiences</>}
            </button>
          </form>
        </motion.div>

        {error && <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">{error}</div>}

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {result.generalAdvice.length > 0 && (
              <div className="glass border border-blue-500/20 bg-blue-500/5 rounded-2xl p-4 mb-6">
                <p className="text-xs font-semibold text-blue-400 mb-2">💡 General Advice</p>
                {result.generalAdvice.map((a, i) => <p key={i} className="text-xs text-zinc-400">{a}</p>)}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.experiences.map((exp, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ExperienceCard exp={exp} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
