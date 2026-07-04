import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware.js';
import { getLocalEvents } from '../services/gemini.service.js';

const router = Router();

const eventsSchema = z.object({
  destination: z.string().min(2).max(200).trim(),
  month: z.string().optional(),
  year: z.string().optional(),
});

router.post('/', validateBody(eventsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getLocalEvents(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
