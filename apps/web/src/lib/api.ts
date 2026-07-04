import { firebaseAuth } from './firebase';
import type {
  ApiResponse,
  DiscoverResponse,
  StoryResponse,
  StoryMode,
  VisionResponse,
  ItineraryResponse,
  EventsResponse,
  ExperiencesResponse,
  ChatMessage,
  PassportEntry,
  PassportJournalResponse,
  FavoriteItem,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = firebaseAuth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  return { 'Content-Type': 'application/json' };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || `Request failed: ${res.statusText}`);
  }

  return data;
}

async function authRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders();
  return request<T>(path, { ...options, headers });
}

// =============================================
// Discover
// =============================================
export async function discoverDestination(params: {
  destination: string;
  budget: string;
  travelStyle: string;
  mood: string;
  duration: number;
}): Promise<DiscoverResponse> {
  const res = await request<DiscoverResponse>('/api/discover', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data!;
}

// =============================================
// Story
// =============================================
export async function generateStory(params: {
  place: string;
  city?: string;
  country?: string;
  mode: StoryMode;
}): Promise<StoryResponse> {
  const res = await request<StoryResponse>('/api/story', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data!;
}

// =============================================
// Vision Scanner
// =============================================
export async function analyzeImageBase64(params: {
  imageBase64: string;
  mimeType: string;
  userContext?: string;
}): Promise<VisionResponse> {
  const res = await request<VisionResponse>('/api/vision/analyze', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data!;
}

export async function analyzeImageFile(file: File, userContext?: string): Promise<VisionResponse> {
  const formData = new FormData();
  formData.append('image', file);
  if (userContext) formData.append('userContext', userContext);

  const res = await fetch(`${API_BASE}/api/vision/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = (await res.json()) as ApiResponse<VisionResponse>;
  if (!data.success) throw new Error(data.error?.message || 'Vision analysis failed');
  return data.data!;
}

// =============================================
// Itinerary
// =============================================
export async function generateItinerary(params: {
  destination: string;
  days: number;
  budget: string;
  travelStyle: string;
  interests: string[];
  startDate?: string;
}): Promise<ItineraryResponse> {
  const res = await request<ItineraryResponse>('/api/itinerary', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data!;
}

// =============================================
// Events
// =============================================
export async function getLocalEvents(params: {
  destination: string;
  month?: string;
  year?: string;
}): Promise<EventsResponse> {
  const res = await request<EventsResponse>('/api/events', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data!;
}

// =============================================
// Experiences
// =============================================
export async function getCulturalExperiences(params: {
  destination: string;
  interests: string[];
  budget: string;
  duration?: string;
}): Promise<ExperiencesResponse> {
  const res = await request<ExperiencesResponse>('/api/experiences', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data!;
}

// =============================================
// Chat
// =============================================
export async function sendChatMessage(params: {
  message: string;
  history: ChatMessage[];
  currentDestination?: string;
  userContext?: { budget?: string; travelStyle?: string; interests?: string[] };
}): Promise<{ reply: string; suggestions?: string[]; relatedPlaces?: string[] }> {
  const res = await request<{ reply: string; suggestions?: string[]; relatedPlaces?: string[] }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data!;
}

// =============================================
// Passport
// =============================================
export async function generateTravelJournal(params: {
  destination: string;
  entries: PassportEntry[];
  userName?: string;
}): Promise<PassportJournalResponse> {
  const res = await request<PassportJournalResponse>('/api/passport/journal', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.data!;
}

export async function savePassportEntry(entry: Omit<PassportEntry, 'id'>): Promise<string> {
  const res = await authRequest<{ id: string }>('/api/passport/entry', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
  return res.data!.id;
}

export async function getPassportEntries(): Promise<PassportEntry[]> {
  const res = await authRequest<PassportEntry[]>('/api/passport/entries');
  return res.data!;
}

// =============================================
// Favorites
// =============================================
export async function saveFavorite(item: Omit<FavoriteItem, 'id'>): Promise<string> {
  const res = await authRequest<{ id: string }>('/api/favorites', {
    method: 'POST',
    body: JSON.stringify(item),
  });
  return res.data!.id;
}

export async function getFavorites(): Promise<FavoriteItem[]> {
  const res = await authRequest<FavoriteItem[]>('/api/favorites');
  return res.data!;
}

export async function deleteFavorite(id: string): Promise<void> {
  await authRequest(`/api/favorites/${id}`, { method: 'DELETE' });
}
