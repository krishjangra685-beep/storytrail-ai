'use client';

import { useState, useCallback, useEffect } from 'react';
import type { PassportEntry } from '@/types';
import { savePassportEntry, getPassportEntries } from '@/lib/api';
import { useAuth } from './useAuth';

interface UsePassportReturn {
  entries: PassportEntry[];
  isLoading: boolean;
  error: string | null;
  addEntry: (entry: Omit<PassportEntry, 'id'>) => Promise<void>;
  fetchEntries: () => Promise<void>;
  localEntries: PassportEntry[];
  addLocalEntry: (entry: Omit<PassportEntry, 'id'>) => void;
  removeLocalEntry: (id: string) => void;
}

export function usePassport(): UsePassportReturn {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PassportEntry[]>([]);
  const [localEntries, setLocalEntries] = useState<PassportEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('passport_entries');
      return saved ? (JSON.parse(saved) as PassportEntry[]) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getPassportEntries();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch passport entries');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addEntry = useCallback(async (entry: Omit<PassportEntry, 'id'>) => {
    if (!user) {
      addLocalEntry(entry);
      return;
    }
    try {
      const id = await savePassportEntry(entry);
      const newEntry: PassportEntry = { ...entry, id };
      setEntries((prev) => [newEntry, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    }
  }, [user]);

  const addLocalEntry = useCallback((entry: Omit<PassportEntry, 'id'>) => {
    const newEntry: PassportEntry = { ...entry, id: `local_${Date.now()}` };
    setLocalEntries((prev) => {
      const updated = [newEntry, ...prev];
      localStorage.setItem('passport_entries', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeLocalEntry = useCallback((id: string) => {
    setLocalEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      localStorage.setItem('passport_entries', JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user, fetchEntries]);

  return { entries, isLoading, error, addEntry, fetchEntries, localEntries, addLocalEntry, removeLocalEntry };
}
