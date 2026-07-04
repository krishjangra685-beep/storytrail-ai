import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware.js';
import { getCulturalExperiences } from '../services/gemini.service.js';

const router = Router();

const experiencesSchema = z.object({
  destination: z.string().min(2).max(200).trim(),
  interests: z.array(z.string().max(50)).min(1).max(10),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  duration: z.string().optional(),
});

router.post('/', validateBody(experiencesSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getCulturalExperiences(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
