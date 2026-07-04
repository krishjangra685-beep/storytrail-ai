import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

export function getPriceIcon(priceRange?: string): string {
  switch (priceRange) {
    case 'free': return 'FREE';
    case 'budget': return '₹';
    case 'moderate': return '₹₹';
    case 'expensive': return '₹₹₹';
    default: return '';
  }
}

export function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    museum: '🏛️',
    temple: '⛩️',
    park: '🌿',
    market: '🛒',
    restaurant: '🍽️',
    landmark: '🗿',
    art: '🎨',
    nature: '🌄',
    festival: '🎭',
    music: '🎵',
    dance: '💃',
    food: '🍜',
    heritage: '🏰',
    spiritual: '🕯️',
    cooking: '👨‍🍳',
    craft: '🧵',
    village: '🏘️',
    textile: '🧶',
    other: '✨',
  };
  return map[category] || '📍';
}

export function getEventTypeColor(type: string): string {
  const map: Record<string, string> = {
    festival: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    market: 'text-green-400 bg-green-400/10 border-green-400/20',
    music: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    dance: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    food: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    heritage: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    art: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    spiritual: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    other: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  };
  return map[type] || map.other!;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-green-400';
    case 'moderate': return 'text-yellow-400';
    case 'challenging': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (base64) resolve(base64);
      else reject(new Error('Failed to convert file to base64'));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getModeDescription(mode: string): string {
  const map: Record<string, string> = {
    historian: 'A passionate historian sharing centuries of documented history',
    elder: 'An elderly local elder sharing oral traditions and personal memories',
    traveler: 'A wonder-struck traveler sharing their first-hand discovery',
  };
  return map[mode] || '';
}

export function getModeColor(mode: string): string {
  const map: Record<string, string> = {
    historian: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
    elder: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
    traveler: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300',
  };
  return map[mode] || '';
}

export function getPassportTypeColor(type: string): string {
  const map: Record<string, string> = {
    place: 'border-purple-500 text-purple-400',
    event: 'border-orange-500 text-orange-400',
    experience: 'border-green-500 text-green-400',
    food: 'border-yellow-500 text-yellow-400',
    story: 'border-blue-500 text-blue-400',
  };
  return map[type] || 'border-gray-500 text-gray-400';
}

export function getPassportTypeEmoji(type: string): string {
  const map: Record<string, string> = {
    place: '📍',
    event: '🎭',
    experience: '✨',
    food: '🍜',
    story: '📖',
  };
  return map[type] || '🌟';
}
