import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware.js';
import { chatWithCompanion } from '../services/gemini.service.js';

const router = Router();

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(2000),
});

const chatSchema = z.object({
  message: z.string().min(1).max(1000).trim(),
  history: z.array(chatMessageSchema).max(20).default([]),
  currentDestination: z.string().max(200).optional(),
  userContext: z.object({
    budget: z.string().optional(),
    travelStyle: z.string().optional(),
    interests: z.array(z.string()).optional(),
  }).optional(),
});

router.post('/', validateBody(chatSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await chatWithCompanion(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
