import Link from 'next/link';
import { Globe, Twitter, Github, Instagram } from 'lucide-react';

const footerLinks = {
  Features: [
    { href: '/discover', label: 'Discover' },
    { href: '/story', label: 'Story Mode' },
    { href: '/scanner', label: 'Vision Scanner' },
    { href: '/planner', label: 'Trip Planner' },
    { href: '/events', label: 'Local Events' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/passport', label: 'Cultural Passport' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="gradient-text">Story</span>
                <span className="text-white">Trail AI</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Don&apos;t just visit places. Live their stories. AI-powered travel discovery 
              with immersive storytelling and authentic cultural experiences.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} StoryTrail AI. Built for Google PromptWars.
          </p>
          <p className="text-sm text-zinc-600">
            Powered by{' '}
            <span className="gradient-text font-medium">Google Gemini AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
