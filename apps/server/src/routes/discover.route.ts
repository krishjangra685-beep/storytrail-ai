import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware.js';
import { discoverDestination } from '../services/gemini.service.js';

const router = Router();

const discoverSchema = z.object({
  destination: z.string().min(2).max(200).trim(),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  travelStyle: z.enum(['adventure', 'cultural', 'relaxed', 'foodie', 'photography', 'spiritual']),
  mood: z.string().min(2).max(100).trim(),
  duration: z.number().int().min(1).max(30),
});

router.post('/', validateBody(discoverSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await discoverDestination(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
