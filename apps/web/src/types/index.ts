// Shared TypeScript types for StoryTrail AI frontend

export interface Attraction {
  name: string;
  description: string;
  category: 'museum' | 'temple' | 'park' | 'market' | 'restaurant' | 'landmark' | 'art' | 'nature' | 'other';
  address: string;
  coordinates?: { lat: number; lng: number };
  rating?: number;
  priceRange?: 'free' | 'budget' | 'moderate' | 'expensive';
  bestTime?: string;
  tags: string[];
  isHiddenGem?: boolean;
  whySpecial?: string;
}

export interface DiscoverResponse {
  destination: string;
  overview: string;
  bestTimeToVisit: string;
  localTips: string[];
  attractions: Attraction[];
  hiddenGems: Attraction[];
  restaurants: Attraction[];
  photoSpots: Attraction[];
  culturalPlaces: Attraction[];
}

export type StoryMode = 'historian' | 'elder' | 'traveler';

export interface StoryResponse {
  place: string;
  mode: StoryMode;
  title: string;
  narrative: string;
  history: string;
  architecture?: string;
  culturalSignificance: string;
  interestingFacts: string[];
  nearbyRecommendations: string[];
  bestTimeToVisit: string;
  localLegend?: string;
}

export interface VisionResponse {
  identified: string;
  category: string;
  history: string;
  story: string;
  culturalContext: string;
  architecture?: string;
  nearbyAttractions: string[];
  interestingFacts: string[];
  bestTimeToVisit?: string;
  localTips: string[];
}

export interface ItineraryDay {
  day: number;
  date?: string;
  theme: string;
  morning: ItinerarySlot;
  afternoon: ItinerarySlot;
  evening: ItinerarySlot;
  meals: { breakfast?: string; lunch: string; dinner: string };
  travelTips: string[];
  photoSpots: string[];
  rainAlternatives: string[];
  estimatedCost: string;
}

export interface ItinerarySlot {
  activity: string;
  location: string;
  duration: string;
  description: string;
  travelTime?: string;
}

export interface ItineraryResponse {
  destination: string;
  totalDays: number;
  budget: string;
  overview: string;
  packingTips: string[];
  days: ItineraryDay[];
}

export interface LocalEvent {
  name: string;
  type: 'festival' | 'market' | 'music' | 'dance' | 'food' | 'heritage' | 'art' | 'spiritual' | 'other';
  description: string;
  location: string;
  timing: string;
  duration: string;
  ticketInfo: string;
  significance: string;
  whatToExpect: string[];
  tips: string[];
  bestFor: string[];
}

export interface EventsResponse {
  destination: string;
  month: string;
  events: LocalEvent[];
  generalTips: string[];
}

export interface CulturalExperience {
  name: string;
  type: 'cooking' | 'art' | 'temple' | 'village' | 'craft' | 'heritage' | 'music' | 'dance' | 'textile' | 'other';
  description: string;
  location: string;
  duration: string;
  priceRange: string;
  whatYouLearn: string[];
  whatToExpect: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  groupSize: string;
  bookingTips: string[];
  whyAuthentic: string;
}

export interface ExperiencesResponse {
  destination: string;
  experiences: CulturalExperience[];
  generalAdvice: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  suggestions?: string[];
  relatedPlaces?: string[];
}

export interface PassportEntry {
  id: string;
  type: 'place' | 'event' | 'experience' | 'food' | 'story';
  name: string;
  location: string;
  date: string;
  notes?: string;
  photoUrl?: string;
}

export interface PassportJournalResponse {
  title: string;
  coverStory: string;
  chapters: {
    title: string;
    content: string;
    type: string;
  }[];
  reflections: string;
  memorableQuote: string;
  nextDestinationSuggestions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface FavoriteItem {
  id: string;
  type: 'destination' | 'story' | 'attraction' | 'experience' | 'itinerary';
  name: string;
  description?: string;
  location?: string;
  metadata?: Record<string, unknown>;
  savedAt?: unknown;
}
