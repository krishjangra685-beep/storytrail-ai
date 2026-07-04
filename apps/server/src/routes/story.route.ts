import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware.js';
import { generateStory } from '../services/gemini.service.js';

const router = Router();

const storySchema = z.object({
  place: z.string().min(2).max(200).trim(),
  city: z.string().max(100).trim().optional(),
  country: z.string().max(100).trim().optional(),
  mode: z.enum(['historian', 'elder', 'traveler']),
});

router.post('/', validateBody(storySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await generateStory(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
