import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, Part } from '@google/generative-ai';
import { env } from '../config/env.js';
import type {
  DiscoverRequest,
  DiscoverResponse,
  StoryRequest,
  StoryResponse,
  VisionRequest,
  VisionResponse,
  ItineraryRequest,
  ItineraryResponse,
  EventsRequest,
  EventsResponse,
  ExperiencesRequest,
  ExperiencesResponse,
  ChatRequest,
  ChatResponse,
  ChatMessage,
  PassportJournalRequest,
  PassportJournalResponse,
} from '../types/index.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

function getFlashModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    safetySettings,
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  });
}

function getProModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });
}

function getVisionModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  });
}

async function parseJsonResponse<T>(text: string): Promise<T> {
  const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`Failed to parse Gemini JSON response: ${cleaned.slice(0, 200)}`);
  }
}

export async function discoverDestination(request: DiscoverRequest): Promise<DiscoverResponse> {
  const model = getFlashModel();
  const prompt = `You are StoryTrail AI, an expert travel guide. Generate a comprehensive travel discovery response for:

Destination: ${request.destination}
Budget: ${request.budget}
Travel Style: ${request.travelStyle}
Mood: ${request.mood}
Trip Duration: ${request.duration} days

Respond with a JSON object (no markdown, pure JSON) matching this exact structure:
{
  "destination": "full destination name with country",
  "overview": "compelling 2-3 sentence overview",
  "bestTimeToVisit": "best months/season to visit",
  "localTips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "attractions": [
    {
      "name": "attraction name",
      "description": "vivid 2-3 sentence description",
      "category": "museum|temple|park|market|restaurant|landmark|art|nature|other",
      "address": "specific address or area",
      "rating": 4.5,
      "priceRange": "free|budget|moderate|expensive",
      "bestTime": "morning|afternoon|evening or specific time",
      "tags": ["tag1", "tag2"],
      "isHiddenGem": false
    }
  ],
  "hiddenGems": [
    {
      "name": "place name",
      "description": "why this place is magical and unique",
      "category": "other",
      "address": "location description",
      "priceRange": "free|budget",
      "bestTime": "when to visit",
      "tags": ["hidden", "local"],
      "isHiddenGem": true,
      "whySpecial": "detailed reason why tourists miss this and why it's worth visiting"
    }
  ],
  "restaurants": [
    {
      "name": "restaurant name",
      "description": "what makes this restaurant special, signature dishes",
      "category": "restaurant",
      "address": "specific address or area",
      "priceRange": "budget|moderate|expensive",
      "bestTime": "lunch|dinner|breakfast",
      "tags": ["cuisine type", "must try"],
      "isHiddenGem": false
    }
  ],
  "photoSpots": [
    {
      "name": "photography location",
      "description": "what makes this a great photo spot, what shots to get",
      "category": "landmark",
      "address": "specific location",
      "bestTime": "golden hour|sunrise|sunset|night",
      "tags": ["photography", "viewpoint"],
      "isHiddenGem": false
    }
  ],
  "culturalPlaces": [
    {
      "name": "cultural venue",
      "description": "cultural significance and what visitors experience",
      "category": "temple|museum|art|other",
      "address": "specific location",
      "priceRange": "free|budget|moderate",
      "bestTime": "specific time recommendation",
      "tags": ["culture", "heritage"],
      "isHiddenGem": false
    }
  ]
}

Include 5 attractions, 3 hidden gems, 4 restaurants, 3 photo spots, and 4 cultural places. Make all descriptions vivid, specific, and travel-inspiring. Adapt recommendations to the budget and travel style.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJsonResponse<DiscoverResponse>(text);
}

export async function generateStory(request: StoryRequest): Promise<StoryResponse> {
  const model = getProModel();

  const modeInstructions = {
    historian: `You are a passionate historian who has dedicated your life to studying ${request.place}. Tell the story with academic depth but engaging storytelling. Reference specific historical events, rulers, battles, and architectural periods. Use phrases like "Records from the 14th century show..." and "Historians believe..."`,
    elder: `You are an elderly local elder who has lived near ${request.place} your entire life, as did your parents and grandparents. Tell the story as personal oral history passed down through generations. Use warm, personal language. Share local legends, childhood memories, and community stories. Use phrases like "My grandmother always told me..." and "The old ones say..."`,
    traveler: `You are a passionate solo traveler who just experienced ${request.place} for the first time and was deeply moved. Tell the story with wonder and discovery. Share the sensory experience - sounds, smells, textures, light. Use vivid present-tense descriptions and personal reactions. Use phrases like "Nothing prepares you for..." and "The moment you step inside..."`,
  };

  const prompt = `${modeInstructions[request.mode]}

Generate an immersive, cinematic story about: ${request.place}${request.city ? `, ${request.city}` : ''}${request.country ? `, ${request.country}` : ''}

Respond with a JSON object (no markdown, pure JSON):
{
  "place": "${request.place}",
  "mode": "${request.mode}",
  "title": "compelling title for this story",
  "narrative": "immersive 300-400 word cinematic narrative in the chosen voice/mode",
  "history": "150-200 word historical background",
  "architecture": "100-150 word description of architectural features (if applicable, otherwise omit)",
  "culturalSignificance": "150-200 word explanation of cultural and spiritual significance",
  "interestingFacts": ["fact1", "fact2", "fact3", "fact4", "fact5"],
  "nearbyRecommendations": ["place1 - why visit", "place2 - why visit", "place3 - why visit"],
  "bestTimeToVisit": "specific recommendation with reasoning",
  "localLegend": "a local legend or myth associated with this place (if applicable)"
}

Make the narrative deeply immersive and authentic to the chosen mode. Each mode should feel distinctly different.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJsonResponse<StoryResponse>(text);
}

export async function analyzeImage(request: VisionRequest): Promise<VisionResponse> {
  const model = getVisionModel();

  const imagePart: Part = {
    inlineData: {
      data: request.imageBase64,
      mimeType: request.mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
    },
  };

  const prompt = `You are StoryTrail AI's Vision Scanner. Analyze this image and identify what it shows (could be a temple, monument, food dish, painting, statue, street art, festival, or any cultural/travel element).

${request.userContext ? `User context: ${request.userContext}` : ''}

Respond with a JSON object (no markdown, pure JSON):
{
  "identified": "specific name of what is in the image",
  "category": "food|temple|painting|statue|street_art|festival|monument|landscape|cultural|architecture|other",
  "history": "150-200 word historical background of this subject",
  "story": "150-200 word engaging story about this subject and its significance",
  "culturalContext": "100-150 word cultural context and significance",
  "architecture": "architectural description if applicable (omit if not relevant)",
  "nearbyAttractions": ["nearby place 1", "nearby place 2", "nearby place 3"],
  "interestingFacts": ["fact1", "fact2", "fact3", "fact4"],
  "bestTimeToVisit": "if applicable, when to visit",
  "localTips": ["tip1", "tip2", "tip3"]
}

Be specific and accurate. If you cannot identify the subject with confidence, describe what you can see and provide general cultural/travel context.`;

  const result = await model.generateContent([imagePart, prompt]);
  const text = result.response.text();
  return parseJsonResponse<VisionResponse>(text);
}

export async function generateItinerary(request: ItineraryRequest): Promise<ItineraryResponse> {
  const model = getProModel();

  const prompt = `You are StoryTrail AI's expert trip planner. Create a detailed ${request.days}-day itinerary for:

Destination: ${request.destination}
Budget: ${request.budget}
Travel Style: ${request.travelStyle}
Interests: ${request.interests.join(', ')}
${request.startDate ? `Start Date: ${request.startDate}` : ''}

Respond with a JSON object (no markdown, pure JSON):
{
  "destination": "${request.destination}",
  "totalDays": ${request.days},
  "budget": "estimated total budget range",
  "overview": "2-3 sentence trip overview",
  "packingTips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "days": [
    {
      "day": 1,
      "theme": "day theme/title",
      "morning": {
        "activity": "activity name",
        "location": "specific location",
        "duration": "2 hours",
        "description": "what to do and see",
        "travelTime": "travel time from accommodation"
      },
      "afternoon": {
        "activity": "activity name",
        "location": "specific location",
        "duration": "3 hours",
        "description": "what to do and see",
        "travelTime": "travel time from morning activity"
      },
      "evening": {
        "activity": "activity name",
        "location": "specific location",
        "duration": "2 hours",
        "description": "what to do and experience",
        "travelTime": "travel time from afternoon"
      },
      "meals": {
        "breakfast": "restaurant name and what to order",
        "lunch": "restaurant/area name and must-try dishes",
        "dinner": "restaurant recommendation and ambiance"
      },
      "travelTips": ["tip for this day"],
      "photoSpots": ["best photo spot for this day"],
      "rainAlternatives": ["indoor alternative if it rains"],
      "estimatedCost": "estimated cost for the day"
    }
  ]
}

Generate all ${request.days} days with varied activities. Avoid repetition. Include authentic local experiences, hidden gems alongside famous spots, and practical logistics.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJsonResponse<ItineraryResponse>(text);
}

export async function getLocalEvents(request: EventsRequest): Promise<EventsResponse> {
  const model = getFlashModel();
  const currentMonth = request.month || new Date().toLocaleString('default', { month: 'long' });
  const currentYear = request.year || new Date().getFullYear().toString();

  const prompt = `You are StoryTrail AI's local culture expert. List authentic local events, festivals, and cultural happenings in ${request.destination} during ${currentMonth} ${currentYear}.

Respond with a JSON object (no markdown, pure JSON):
{
  "destination": "${request.destination}",
  "month": "${currentMonth} ${currentYear}",
  "events": [
    {
      "name": "event name",
      "type": "festival|market|music|dance|food|heritage|art|spiritual|other",
      "description": "150 word vivid description of the event",
      "location": "specific venue or area",
      "timing": "dates or recurring schedule",
      "duration": "event duration",
      "ticketInfo": "free|price range and how to get tickets",
      "significance": "cultural or historical significance",
      "whatToExpect": ["experience 1", "experience 2", "experience 3"],
      "tips": ["practical tip 1", "practical tip 2"],
      "bestFor": ["who this is best for"]
    }
  ],
  "generalTips": ["general tip about attending events in this destination"]
}

Include 6-8 diverse events (festivals, markets, cultural shows, food events, heritage walks). Focus on authentic local events that connect visitors with the culture, not just tourist-facing events.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJsonResponse<EventsResponse>(text);
}

export async function getCulturalExperiences(request: ExperiencesRequest): Promise<ExperiencesResponse> {
  const model = getFlashModel();

  const prompt = `You are StoryTrail AI's authentic experiences curator. Recommend genuine cultural experiences in ${request.destination} for:

Budget: ${request.budget}
Interests: ${request.interests.join(', ')}
${request.duration ? `Duration preference: ${request.duration}` : ''}

Respond with a JSON object (no markdown, pure JSON):
{
  "destination": "${request.destination}",
  "experiences": [
    {
      "name": "experience name",
      "type": "cooking|art|temple|village|craft|heritage|music|dance|textile|other",
      "description": "150 word vivid description of what this experience involves",
      "location": "specific venue or neighborhood",
      "duration": "2-3 hours",
      "priceRange": "per person price range",
      "whatYouLearn": ["skill 1", "skill 2", "skill 3"],
      "whatToExpect": "100 word description of the actual experience",
      "difficulty": "easy|moderate|challenging",
      "groupSize": "individual|small group|any",
      "bookingTips": ["how to book", "best time to book"],
      "whyAuthentic": "why this experience is genuinely authentic vs touristy"
    }
  ],
  "generalAdvice": ["advice 1", "advice 2", "advice 3"]
}

Include 6 diverse experiences (cooking class, craft workshop, temple tour, village walk, art class, heritage walk). Prioritize genuine local interactions over commercial tourist activities.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJsonResponse<ExperiencesResponse>(text);
}

export async function chatWithCompanion(request: ChatRequest): Promise<ChatResponse> {
  const model = getFlashModel();

  const systemPrompt = `You are Aria, StoryTrail AI's knowledgeable and warm AI Travel Companion. You are:
- An expert in global travel, culture, history, and hidden gems
- Passionate about authentic cultural experiences and connections
- Able to suggest specific places, restaurants, experiences, and events
- Conversational, warm, and encouraging
${request.currentDestination ? `- Currently helping the user explore: ${request.currentDestination}` : ''}
${request.userContext?.budget ? `- User's budget: ${request.userContext.budget}` : ''}
${request.userContext?.travelStyle ? `- User's travel style: ${request.userContext.travelStyle}` : ''}
${request.userContext?.interests?.length ? `- User's interests: ${request.userContext.interests.join(', ')}` : ''}

Keep responses helpful, specific, and under 200 words. End with a natural follow-up question or suggestion.`;

  const historyFormatted = request.history
    .map((msg: ChatMessage) => `${msg.role === 'user' ? 'User' : 'Aria'}: ${msg.content}`)
    .join('\n');

  const fullPrompt = `${systemPrompt}

Conversation so far:
${historyFormatted}

User: ${request.message}

Respond with a JSON object (no markdown, pure JSON):
{
  "reply": "your helpful, warm response as Aria",
  "suggestions": ["quick suggestion 1", "quick suggestion 2", "quick suggestion 3"],
  "relatedPlaces": ["place name 1", "place name 2"]
}

suggestions should be 3 short follow-up questions or action prompts the user might want to explore next. relatedPlaces are 1-2 specific places mentioned or relevant to your reply.`;

  const result = await model.generateContent(fullPrompt);
  const text = result.response.text();
  return parseJsonResponse<ChatResponse>(text);
}

export async function generatePassportJournal(request: PassportJournalRequest): Promise<PassportJournalResponse> {
  const model = getProModel();

  const entriesText = request.entries
    .map((e) => `- ${e.type.toUpperCase()}: ${e.name} at ${e.location} on ${e.date}${e.notes ? ` (Notes: ${e.notes})` : ''}`)
    .join('\n');

  const prompt = `You are StoryTrail AI's travel journal writer. Create a beautiful, literary travel journal for ${request.userName || 'a traveler'}'s journey to ${request.destination}.

Their cultural passport entries:
${entriesText}

Respond with a JSON object (no markdown, pure JSON):
{
  "title": "poetic title for this travel journal",
  "coverStory": "200 word opening narrative that captures the essence of this journey in a literary, evocative style",
  "chapters": [
    {
      "title": "chapter title",
      "content": "150-200 word narrative chapter based on the specific entries",
      "type": "place|event|experience|food|reflection"
    }
  ],
  "reflections": "150 word thoughtful closing reflection on what this journey meant",
  "memorableQuote": "a beautiful, original quote that captures this journey (in the style of the entries)",
  "nextDestinationSuggestions": ["destination 1 - why it would appeal to this traveler", "destination 2 - connection to experiences had", "destination 3 - natural next step in their journey"]
}

Create ${Math.min(request.entries.length, 5)} chapters, each weaving together the actual experiences into narrative prose. Make it feel like a real travel memoir, not a list. The tone should be literary, warm, and inspiring.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJsonResponse<PassportJournalResponse>(text);
}
