'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Loader2, Search, Sparkles, MapPin, Clock, Ticket, ChevronDown } from 'lucide-react';
import { getLocalEvents } from '@/lib/api';
import type { EventsResponse, LocalEvent } from '@/types';
import { cn, getEventTypeColor, getCategoryEmoji } from '@/lib/utils';

const eventsSchema = z.object({
  destination: z.string().min(2, 'Enter a destination'),
  month: z.string().optional(),
  year: z.string().optional(),
});

type EventsForm = z.infer<typeof eventsSchema>;

function EventCard({ event }: { event: LocalEvent }) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = getEventTypeColor(event.type);

  return (
    <div className="glass border border-white/[0.08] rounded-2xl overflow-hidden card-hover">
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryEmoji(event.type)}</span>
            <div>
              <h3 className="font-semibold text-white">{event.name}</h3>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {event.location}
              </p>
            </div>
          </div>
          <span className={cn('text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border capitalize', colorClass)}>
            {event.type}
          </span>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{event.description}</p>

        <div className="flex flex-wrap gap-3 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-lg">
            <Clock className="w-3 h-3" /> {event.timing}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-lg">
            <Ticket className="w-3 h-3" /> {event.ticketInfo}
          </span>
        </div>

        <p className="text-xs text-zinc-500 italic mb-3">{event.significance}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          {expanded ? 'Show less' : 'Show more'}
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3">
                {event.whatToExpect.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-zinc-300 mb-2">What to Expect</p>
                    <div className="space-y-1">
                      {event.whatToExpect.map((e, i) => (
                        <p key={i} className="text-xs text-zinc-400">✨ {e}</p>
                      ))}
                    </div>
                  </div>
                )}
                {event.tips.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-zinc-300 mb-2">Tips</p>
                    <div className="space-y-1">
                      {event.tips.map((tip, i) => (
                        <p key={i} className="text-xs text-zinc-400">💡 {tip}</p>
                      ))}
                    </div>
                  </div>
                )}
                {event.bestFor.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {event.bestFor.map((tag, i) => (
                      <span key={i} className="text-xs text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<EventsForm>({
    resolver: zodResolver(eventsSchema),
  });

  const onSubmit = async (data: EventsForm) => {
    setIsLoading(true);
    setError(null);
    setEvents(null);
    try {
      const res = await getLocalEvents(data);
      setEvents(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass border border-rose-500/20 px-4 py-2 rounded-full text-sm text-rose-300 mb-6">
            <Calendar className="w-3.5 h-3.5" />
            Local Events & Festivals
          </div>
          <h1 className="text-display text-white mb-4">
            Experience <span className="gradient-text">Living Culture</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Discover authentic local festivals, markets, cultural shows, and heritage events powered by Gemini AI.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass border border-white/[0.08] rounded-3xl p-8 mb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Destination *</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input {...register('destination')} placeholder="e.g. Varanasi, India / Kyoto, Japan" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50" />
              </div>
              {errors.destination && <p className="text-xs text-red-400 mt-1">{errors.destination.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Month</label>
                <select {...register('month')} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50">
                  <option value="">Current month</option>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Year</label>
                <select {...register('year')} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50">
                  <option value="">Current year</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Discovering events...</> : <><Calendar className="w-5 h-5" />Find Local Events</>}
            </button>
          </form>
        </motion.div>

        {error && <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">{error}</div>}

        {events && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">{events.destination} — {events.month}</h2>
              <span className="text-sm text-zinc-500">{events.events.length} events found</span>
            </div>
            {events.generalTips.length > 0 && (
              <div className="glass border border-blue-500/20 bg-blue-500/5 rounded-2xl p-4 mb-4">
                <p className="text-xs font-semibold text-blue-400 mb-2">💡 General Tips</p>
                <div className="space-y-1">
                  {events.generalTips.map((tip, i) => <p key={i} className="text-xs text-zinc-400">{tip}</p>)}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.events.map((event, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
