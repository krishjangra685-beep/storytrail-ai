'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { useAICompanion } from '@/hooks/useAICompanion';
import { cn } from '@/lib/utils';

export default function AICompanion() {
  const { messages, isLoading, error, sendMessage, clearHistory, isOpen, setIsOpen } = useAICompanion();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="companion-bubble">
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-[360px] sm:w-[420px] glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/[0.1]"
            style={{ maxHeight: '580px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-gradient-to-r from-violet-500/10 to-indigo-500/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Bot className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Aria</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xs text-zinc-400">AI Travel Companion</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearHistory}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto p-4 space-y-4" style={{ height: '380px' }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={cn('max-w-[80%] space-y-2', msg.role === 'user' ? 'items-end' : 'items-start', 'flex flex-col')}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm'
                          : 'glass text-zinc-200 rounded-tl-sm'
                      )}
                    >
                      {msg.content}
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((s, si) => (
                          <button
                            key={si}
                            onClick={() => sendMessage(s)}
                            className="text-xs px-3 py-1.5 rounded-full glass border border-white/[0.1] text-zinc-400 hover:text-white hover:border-violet-500/40 transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center text-xs text-red-400 bg-red-400/10 rounded-xl px-3 py-2">
                  {error}. Try again.
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/[0.08]">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Aria anything about your destination..."
                  className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
                  rows={1}
                  style={{ minHeight: '42px', maxHeight: '100px' }}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="btn-primary w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-2xl btn-primary flex items-center justify-center shadow-2xl shadow-violet-500/40 glow-purple"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Notification dot */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-violet-400 rounded-full animate-pulse-glow" />
        )}
      </motion.button>
    </div>
  );
}
