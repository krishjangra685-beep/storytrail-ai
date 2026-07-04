import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware.js';
import { generateItinerary } from '../services/gemini.service.js';

const router = Router();

const itinerarySchema = z.object({
  destination: z.string().min(2).max(200).trim(),
  days: z.number().int().min(1).max(30),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  travelStyle: z.string().min(2).max(100).trim(),
  interests: z.array(z.string().max(50)).min(1).max(10),
  startDate: z.string().optional(),
});

router.post('/', validateBody(itinerarySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await generateItinerary(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
