'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Compass, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryEmoji } from '@/lib/utils';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavorites();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to view favorites</h2>
          <p className="text-zinc-400 mb-6">Save your favorite destinations, stories, and experiences across all your devices.</p>
          <Link href="/auth" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium">
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass border border-rose-500/20 px-4 py-2 rounded-full text-sm text-rose-300 mb-6">
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
            Your Saved Collection
          </div>
          <h1 className="text-display text-white mb-4">
            Saved <span className="gradient-text">Favorites</span>
          </h1>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {favorites.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass border border-white/[0.08] rounded-2xl p-6 relative group"
                >
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute top-4 right-4 p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getCategoryEmoji(item.type)}</span>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors pr-8">
                        {item.name}
                      </h3>
                      {item.location && (
                        <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-zinc-400 line-clamp-3">{item.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border border-white/[0.1] text-zinc-400 capitalize bg-white/[0.02]">
                      {item.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20">
            <Compass className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">No favorites yet</h3>
            <p className="text-zinc-600 text-sm mb-6">Start exploring to build your collection.</p>
            <Link href="/discover" className="btn-primary inline-flex px-6 py-3 rounded-xl font-medium items-center gap-2">
              <Compass className="w-4 h-4" /> Discover Places
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
