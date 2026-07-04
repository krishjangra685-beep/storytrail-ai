'use client';

import { useState, useCallback } from 'react';
import type { FavoriteItem } from '@/types';
import { saveFavorite, getFavorites, deleteFavorite } from '@/lib/api';
import { useAuth } from './useAuth';

interface UseFavoritesReturn {
  favorites: FavoriteItem[];
  isLoading: boolean;
  addFavorite: (item: Omit<FavoriteItem, 'id'>) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  isFavorited: (name: string) => boolean;
}

export function useFavorites(): UseFavoritesReturn {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addFavorite = useCallback(async (item: Omit<FavoriteItem, 'id'>) => {
    if (!user) return;
    try {
      const id = await saveFavorite(item);
      setFavorites((prev) => [{ ...item, id }, ...prev]);
    } catch (err) {
      console.error('Failed to save favorite:', err);
    }
  }, [user]);

  const removeFavorite = useCallback(async (id: string) => {
    try {
      await deleteFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  }, []);

  const isFavorited = useCallback((name: string) => {
    return favorites.some((f) => f.name.toLowerCase() === name.toLowerCase());
  }, [favorites]);

  return { favorites, isLoading, addFavorite, removeFavorite, fetchFavorites, isFavorited };
}
