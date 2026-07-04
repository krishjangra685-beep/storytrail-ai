'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Search, BookOpen, Camera, Map, Calendar, Star,
  Compass, User, Menu, X, LogOut, Heart, Stamp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { href: '/discover', label: 'Discover', icon: Search },
  { href: '/story', label: 'Stories', icon: BookOpen },
  { href: '/scanner', label: 'Scanner', icon: Camera },
  { href: '/planner', label: 'Planner', icon: Map },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/experiences', label: 'Experiences', icon: Star },
  { href: '/passport', label: 'Passport', icon: Stamp },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="glass border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/40 transition-shadow">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                <span className="gradient-text">Story</span>
                <span className="text-white">Trail</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/favorites"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    Saved
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-semibold">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <button
                      onClick={() => logout()}
                      className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all"
                      title="Sign out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className="btn-primary text-sm px-4 py-2 rounded-xl font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-b border-white/[0.06]"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/[0.06]">
                {user ? (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/auth" onClick={() => setIsOpen(false)} className="btn-glass text-center px-4 py-3 rounded-xl text-sm font-medium">
                      Sign in
                    </Link>
                    <Link href="/auth?mode=signup" onClick={() => setIsOpen(false)} className="btn-primary text-center px-4 py-3 rounded-xl text-sm font-medium">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
