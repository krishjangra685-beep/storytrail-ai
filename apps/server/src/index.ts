import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { initializeFirebase } from './services/firebase.service.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

// Routes
import discoverRouter from './routes/discover.route.js';
import storyRouter from './routes/story.route.js';
import visionRouter from './routes/vision.route.js';
import itineraryRouter from './routes/itinerary.route.js';
import eventsRouter from './routes/events.route.js';
import experiencesRouter from './routes/experiences.route.js';
import chatRouter from './routes/chat.route.js';
import passportRouter from './routes/passport.route.js';
import favoritesRouter from './routes/favorites.route.js';

// Initialize Firebase
initializeFirebase();

const app = express();

// Security
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map(o => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, error: { code: 'AI_RATE_LIMITED', message: 'AI rate limit exceeded. Please wait a moment.' } },
});

// Logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'StoryTrail AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', apiLimiter);
app.use('/api/discover', aiLimiter, discoverRouter);
app.use('/api/story', aiLimiter, storyRouter);
app.use('/api/vision', aiLimiter, visionRouter);
app.use('/api/itinerary', aiLimiter, itineraryRouter);
app.use('/api/events', aiLimiter, eventsRouter);
app.use('/api/experiences', aiLimiter, experiencesRouter);
app.use('/api/chat', aiLimiter, chatRouter);
app.use('/api/passport', passportRouter);
app.use('/api/favorites', favoritesRouter);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`\n🌍 StoryTrail AI Backend running on port ${PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API: http://localhost:${PORT}/api\n`);
});

export default app;
