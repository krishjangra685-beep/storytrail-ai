import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware.js';
import { generatePassportJournal } from '../services/gemini.service.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { savePassportEntry, getPassportEntries } from '../services/firebase.service.js';

const router = Router();

const passportEntrySchema = z.object({
  type: z.enum(['place', 'event', 'experience', 'food', 'story']),
  name: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  date: z.string(),
  notes: z.string().max(1000).optional(),
  photoUrl: z.string().url().optional(),
});

const journalSchema = z.object({
  destination: z.string().min(2).max(200).trim(),
  entries: z.array(passportEntrySchema).min(1).max(50),
  userName: z.string().max(100).optional(),
});

// Generate AI travel journal from passport entries
router.post('/journal', validateBody(journalSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await generatePassportJournal(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// Save a passport entry (requires auth)
router.post('/entry', requireAuth, validateBody(passportEntrySchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = await savePassportEntry(req.userId!, req.body as Record<string, unknown>);
    res.json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
});

// Get all passport entries for a user
router.get('/entries', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const entries = await getPassportEntries(req.userId!);
    res.json({ success: true, data: entries });
  } catch (err) {
    next(err);
  }
});

export default router;
