import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AICompanion from '@/components/layout/AICompanion';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'StoryTrail AI — Don\'t Just Visit Places. Live Their Stories.',
    template: '%s | StoryTrail AI',
  },
  description:
    'Discover destinations through immersive AI storytelling. Find hidden gems, plan authentic cultural experiences, and connect with local heritage powered by Gemini AI.',
  keywords: [
    'travel', 'AI travel guide', 'cultural experiences', 'hidden gems',
    'storytelling', 'heritage', 'local culture', 'Gemini AI', 'trip planner',
  ],
  authors: [{ name: 'StoryTrail AI' }],
  creator: 'StoryTrail AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://storytrail.ai',
    title: 'StoryTrail AI — Don\'t Just Visit Places. Live Their Stories.',
    description: 'AI-powered travel discovery platform with immersive storytelling and cultural experiences.',
    siteName: 'StoryTrail AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StoryTrail AI',
    description: 'Don\'t Just Visit Places. Live Their Stories.',
    creator: '@storytrailai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="bg-[#09090b] text-zinc-50 antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <AICompanion />
        </AuthProvider>
      </body>
    </html>
  );
}
