// =============================================
// Shared TypeScript types for StoryTrail AI
// =============================================

export interface Attraction {
  name: string;
  description: string;
  category: 'museum' | 'temple' | 'park' | 'market' | 'restaurant' | 'landmark' | 'art' | 'nature' | 'other';
  address: string;
  coordinates?: { lat: number; lng: number };
  rating?: number;
  priceRange?: 'free' | 'budget' | 'moderate' | 'expensive';
  bestTime?: string;
  imagePrompt?: string;
  tags: string[];
  isHiddenGem?: boolean;
  whySpecial?: string;
}

export interface DiscoverRequest {
  destination: string;
  budget: 'budget' | 'moderate' | 'luxury';
  travelStyle: 'adventure' | 'cultural' | 'relaxed' | 'foodie' | 'photography' | 'spiritual';
  mood: string;
  duration: number;
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

export interface StoryRequest {
  place: string;
  city?: string;
  country?: string;
  mode: StoryMode;
}

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

export interface VisionRequest {
  imageBase64: string;
  mimeType: string;
  userContext?: string;
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

export interface ItineraryRequest {
  destination: string;
  days: number;
  budget: 'budget' | 'moderate' | 'luxury';
  travelStyle: string;
  interests: string[];
  startDate?: string;
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

export interface EventsRequest {
  destination: string;
  month?: string;
  year?: string;
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

export interface ExperiencesRequest {
  destination: string;
  interests: string[];
  budget: 'budget' | 'moderate' | 'luxury';
  duration?: string;
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
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
  currentDestination?: string;
  userContext?: {
    budget?: string;
    travelStyle?: string;
    interests?: string[];
  };
}

export interface ChatResponse {
  reply: string;
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

export interface PassportJournalRequest {
  destination: string;
  entries: PassportEntry[];
  userName?: string;
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

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
