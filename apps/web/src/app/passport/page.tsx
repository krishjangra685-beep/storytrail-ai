'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stamp, Plus, BookOpen, Loader2, Sparkles, Trash2, Globe,
  X, MapPin, Calendar, FileText
} from 'lucide-react';
import { usePassport } from '@/hooks/usePassport';
import { generateTravelJournal } from '@/lib/api';
import type { PassportEntry, PassportJournalResponse } from '@/types';
import { cn, getPassportTypeColor, getPassportTypeEmoji, formatDate } from '@/lib/utils';

const entryTypes: PassportEntry['type'][] = ['place', 'event', 'experience', 'food', 'story'];

function AddEntryModal({ onClose, onAdd }: { onClose: () => void; onAdd: (entry: Omit<PassportEntry, 'id'>) => void }) {
  const [form, setForm] = useState<Omit<PassportEntry, 'id'>>({
    type: 'place',
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0]!,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.location) {
      onAdd(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong border border-white/[0.12] rounded-3xl p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Add Passport Stamp</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Type</label>
            <div className="flex flex-wrap gap-2">
              {entryTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={cn(
                    'text-sm px-3 py-1.5 rounded-xl border capitalize transition-all',
                    form.type === t
                      ? getPassportTypeColor(t).replace('text-', 'bg-').replace('-400', '-400/20') + ' ' + getPassportTypeColor(t)
                      : 'glass border-white/[0.08] text-zinc-400'
                  )}
                >
                  {getPassportTypeEmoji(t)} {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Taj Mahal, Street Food Tour..." className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Location *</label>
            <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Agra, India" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Notes (optional)</label>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="What made this special?" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 resize-none" rows={3} />
          </div>
          <button type="submit" className="btn-primary w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2">
            <Stamp className="w-4 h-4" /> Add to Passport
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function JournalView({ journal }: { journal: PassportJournalResponse }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass border border-violet-500/20 bg-violet-500/5 rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-white mb-4">{journal.title}</h2>
        <p className="text-zinc-300 text-lg leading-relaxed italic border-l-2 border-violet-500 pl-4">{journal.coverStory}</p>
      </div>

      {journal.chapters.map((chapter, i) => (
        <div key={i} className="glass border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">{chapter.title}</h3>
          <p className="text-zinc-400 leading-relaxed">{chapter.content}</p>
        </div>
      ))}

      <div className="glass border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-emerald-400 mb-3">✨ Reflections</h3>
        <p className="text-zinc-300 leading-relaxed">{journal.reflections}</p>
      </div>

      <div className="glass border border-amber-500/20 bg-amber-500/5 rounded-2xl p-6 text-center">
        <p className="text-xl text-amber-300 italic font-light">"{journal.memorableQuote}"</p>
      </div>

      {journal.nextDestinationSuggestions.length > 0 && (
        <div className="glass border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-400" /> Next Adventures
          </h3>
          <div className="space-y-2">
            {journal.nextDestinationSuggestions.map((dest, i) => (
              <p key={i} className="text-sm text-zinc-400">🌏 {dest}</p>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function PassportPage() {
  const { localEntries, addLocalEntry, removeLocalEntry } = usePassport();
  const [showModal, setShowModal] = useState(false);
  const [journal, setJournal] = useState<PassportJournalResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [journalError, setJournalError] = useState<string | null>(null);
  const [destination, setDestination] = useState('');

  const handleGenerateJournal = async () => {
    if (localEntries.length === 0) return;
    if (!destination) return;
    setIsGenerating(true);
    setJournalError(null);
    try {
      const res = await generateTravelJournal({ destination, entries: localEntries });
      setJournal(res);
    } catch (err) {
      setJournalError(err instanceof Error ? err.message : 'Journal generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass border border-indigo-500/20 px-4 py-2 rounded-full text-sm text-indigo-300 mb-6">
            <Stamp className="w-3.5 h-3.5" />
            Cultural Passport
          </div>
          <h1 className="text-display text-white mb-4">
            Collect <span className="gradient-text">Experiences</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Stamp your passport with every cultural experience. When you&apos;re ready, generate a beautiful AI travel journal from your adventures.
          </p>
        </motion.div>

        {/* Add entry + generate */}
        <div className="glass border border-white/[0.08] rounded-3xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter your destination (e.g. Rajasthan, India)..."
              className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 text-sm"
            />
            <button onClick={() => setShowModal(true)} className="btn-glass flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add Stamp
            </button>
          </div>
          <button
            onClick={handleGenerateJournal}
            disabled={localEntries.length === 0 || !destination || isGenerating}
            className="btn-primary w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Gemini is writing your journal...</>
            ) : (
              <><Sparkles className="w-5 h-5" />Generate AI Travel Journal ({localEntries.length} stamps)</>
            )}
          </button>
          {localEntries.length === 0 && (
            <p className="text-xs text-center text-zinc-600 mt-2">Add at least one stamp to generate your journal</p>
          )}
          {journalError && <p className="text-xs text-center text-red-400 mt-2">{journalError}</p>}
        </div>

        {/* Stamps grid */}
        {localEntries.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-white mb-4">Your Stamps ({localEntries.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {localEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      'passport-stamp relative glass border rounded-2xl p-4',
                      getPassportTypeColor(entry.type)
                    )}
                  >
                    <button
                      onClick={() => removeLocalEntry(entry.id)}
                      className="absolute top-2 right-2 p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-2xl mb-2">{getPassportTypeEmoji(entry.type)}</div>
                    <p className="font-semibold text-white text-sm mb-1">{entry.name}</p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" /> {entry.location}
                    </p>
                    <p className="text-xs text-zinc-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(entry.date)}
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{entry.notes}</p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty state */}
        {localEntries.length === 0 && !journal && (
          <div className="text-center py-16">
            <Stamp className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">No stamps yet</h3>
            <p className="text-zinc-600 text-sm mb-6">Start collecting your cultural experiences by adding your first stamp.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" /> Add First Stamp
            </button>
          </div>
        )}

        {/* Journal */}
        {journal && <JournalView journal={journal} />}
      </div>

      {showModal && (
        <AddEntryModal onClose={() => setShowModal(false)} onAdd={addLocalEntry} />
      )}
    </div>
  );
}
