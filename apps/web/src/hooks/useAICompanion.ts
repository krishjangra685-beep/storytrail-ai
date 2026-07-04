'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from '@/types';
import { sendChatMessage } from '@/lib/api';

interface UseAICompanionOptions {
  currentDestination?: string;
  userContext?: {
    budget?: string;
    travelStyle?: string;
    interests?: string[];
  };
}

interface UseAICompanionReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function useAICompanion(options: UseAICompanionOptions = {}): UseAICompanionReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi! I'm Aria, your AI Travel Companion 🌍 I'm here to help you discover amazing destinations, hidden gems, cultural experiences, and local stories. ${options.currentDestination ? `I see you're exploring ${options.currentDestination} — what would you like to know?` : 'Where would you like to travel today?'}`,
      timestamp: new Date(),
      suggestions: ['Tell me about hidden gems', 'What should I eat?', 'Best photo spots?'],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (options.currentDestination) {
      setMessages([
        {
          role: 'assistant',
          content: `Welcome to ${options.currentDestination}! 🌟 I'm Aria, your AI Travel Companion. I know this destination well — ask me about hidden gems, local food, cultural experiences, or the best times to visit specific places.`,
          timestamp: new Date(),
          suggestions: [`Hidden gems in ${options.currentDestination}`, 'Local food to try', 'Cultural experiences'],
        },
      ]);
    }
  }, [options.currentDestination]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const historyForApi = messages
        .slice(-10)
        .map(({ role, content }) => ({ role, content }));

      const response = await sendChatMessage({
        message: text,
        history: historyForApi,
        currentDestination: options.currentDestination,
        userContext: options.userContext,
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
        suggestions: response.suggestions,
        relatedPlaces: response.relatedPlaces,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, options]);

  const clearHistory = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: "I've cleared our conversation. Let's start fresh! What would you like to explore?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, isLoading, error, sendMessage, clearHistory, isOpen, setIsOpen };
}
