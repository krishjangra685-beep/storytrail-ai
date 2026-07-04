'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Map, Loader2, Search, Sparkles, Sun, Sunset, Moon, Utensils,
  Camera, Cloud, DollarSign, ChevronDown, Clock, Luggage
} from 'lucide-react';
import { generateItinerary } from '@/lib/api';
import type { ItineraryResponse, ItineraryDay } from '@/types';
import { cn } from '@/lib/utils';

const itinerarySchema = z.object({
  destination: z.string().min(2, 'Enter a destination'),
  days: z.coerce.number().int().min(1).max(30),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  travelStyle: z.string().min(2, 'Add your travel style'),
  interests: z.string().min(2, 'Add at least one interest'),
  startDate: z.string().optional(),
});

type ItineraryForm = z.infer<typeof itinerarySchema>;

function DayCard({ day, isOpen, onToggle }: { day: ItineraryDay; isOpen: boolean; onToggle: () => void }) {
  const slots = [
    { key: 'morning', label: 'Morning', icon: Sun, color: 'text-yellow-400' },
    { key: 'afternoon', label: 'Afternoon', icon: Sunset, color: 'text-orange-400' },
    { key: 'evening', label: 'Evening', icon: Moon, color: 'text-blue-400' },
  ] as const;

  return (
    <div className="glass border border-white/[0.08] rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center">
            <span className="text-lg font-bold text-violet-400">{day.day}</span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-white">{day.theme}</p>
            <p className="text-sm text-zinc-500">{day.estimatedCost}</p>
          </div>
        </div>
        <ChevronDown className={cn('w-5 h-5 text-zinc-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4 border-t border-white/[0.06]">
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {slots.map(({ key, label, icon: Icon, color }) => {
                  const slot = day[key];
                  return (
                    <div key={key} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                      <div className={cn('flex items-center gap-2 mb-2', color)}>
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-semibold">{label}</span>
                      </div>
                      <p className="text-sm font-medium text-white mb-1">{slot.activity}</p>
                      <p className="text-xs text-zinc-500 mb-2">{slot.location}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{slot.description}</p>
                      {slot.duration && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-zinc-600">
                          <Clock className="w-3 h-3" /> {slot.duration}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Meals */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-3">
                  <Utensils className="w-4 h-4" />
                  <span className="text-xs font-semibold">Meals</span>
                </div>
                <div className="space-y-2">
                  {day.meals.breakfast && (
                    <div className="flex gap-2 text-xs">
                      <span className="text-zinc-500 w-16 flex-shrink-0">Breakfast</span>
                      <span className="text-zinc-300">{day.meals.breakfast}</span>
                    </div>
                  )}
                  <div className="flex gap-2 text-xs">
                    <span className="text-zinc-500 w-16 flex-shrink-0">Lunch</span>
                    <span className="text-zinc-300">{day.meals.lunch}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-zinc-500 w-16 flex-shrink-0">Dinner</span>
                    <span className="text-zinc-300">{day.meals.dinner}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {day.photoSpots.length > 0 && (
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-violet-400 mb-2">
                      <Camera className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">Photo Spots</span>
                    </div>
                    {day.photoSpots.map((spot, i) => (
                      <p key={i} className="text-xs text-zinc-400 mt-1">📸 {spot}</p>
                    ))}
                  </div>
                )}
                {day.rainAlternatives.length > 0 && (
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Cloud className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">Rain Plan</span>
                    </div>
                    {day.rainAlternatives.map((alt, i) => (
                      <p key={i} className="text-xs text-zinc-400 mt-1">☂️ {alt}</p>
                    ))}
                  </div>
                )}
                {day.travelTips.length > 0 && (
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">Tips</span>
                    </div>
                    {day.travelTips.map((tip, i) => (
                      <p key={i} className="text-xs text-zinc-400 mt-1">💡 {tip}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PlannerPage() {
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));

  const { register, handleSubmit, formState: { errors } } = useForm<ItineraryForm>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: { budget: 'moderate', days: 5 },
  });

  const onSubmit = async (data: ItineraryForm) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const interests = data.interests.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await generateItinerary({ ...data, interests });
      setItinerary(res);
      setOpenDays(new Set([1]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Planning failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass border border-emerald-500/20 px-4 py-2 rounded-full text-sm text-emerald-300 mb-6">
            <Map className="w-3.5 h-3.5" />
            AI Trip Planner
          </div>
          <h1 className="text-display text-white mb-4">
            Your Perfect <span className="gradient-text">Itinerary</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Tell us your dream trip and Gemini AI will craft a personalized day-by-day itinerary with food, photo spots, and rain alternatives.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass border border-white/[0.08] rounded-3xl p-8 mb-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Destination *</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('destination')}
                  placeholder="e.g. Kyoto, Japan"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              {errors.destination && <p className="text-xs text-red-400 mt-1">{errors.destination.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Duration (days)</label>
                <input {...register('days')} type="number" min="1" max="30" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Budget</label>
                <select {...register('budget')} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50">
                  <option value="budget">💰 Budget</option>
                  <option value="moderate">💳 Moderate</option>
                  <option value="luxury">💎 Luxury</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Travel Style</label>
              <input {...register('travelStyle')} placeholder="e.g. cultural, food-focused, photography, relaxed" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Interests (comma-separated)</label>
              <input {...register('interests')} placeholder="e.g. temples, street food, photography, markets, music" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50" />
              {errors.interests && <p className="text-xs text-red-400 mt-1">{errors.interests.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Start Date (optional)</label>
              <input {...register('startDate')} type="date" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50" />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Gemini is planning your trip...</> : <><Sparkles className="w-5 h-5" />Generate Itinerary</>}
            </button>
          </form>
        </motion.div>

        {error && <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">{error}</div>}

        {itinerary && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass border border-white/[0.08] rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2">{itinerary.destination}</h2>
              <p className="text-zinc-400 mb-4">{itinerary.overview}</p>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-sm text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-lg">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {itinerary.budget}
                </span>
              </div>
              {itinerary.packingTips.length > 0 && (
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-violet-400" /> Packing Tips
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {itinerary.packingTips.map((tip, i) => (
                      <span key={i} className="text-xs text-zinc-500 bg-white/[0.04] border border-white/[0.06] px-3 py-1 rounded-lg">
                        {tip}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {itinerary.days.map((day) => (
                <DayCard key={day.day} day={day} isOpen={openDays.has(day.day)} onToggle={() => toggleDay(day.day)} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
