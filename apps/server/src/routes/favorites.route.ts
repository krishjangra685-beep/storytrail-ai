import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { saveFavorite, getFavorites, deleteFavorite } from '../services/firebase.service.js';

const router = Router();

const favoriteSchema = z.object({
  type: z.enum(['destination', 'story', 'attraction', 'experience', 'itinerary']),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  location: z.string().max(200).optional(),
  metadata: z.record(z.unknown()).optional(),
});

router.post('/', requireAuth, validateBody(favoriteSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = await saveFavorite(req.userId!, req.body.type as string, req.body as Record<string, unknown>);
    res.status(201).json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const favorites = await getFavorites(req.userId!);
    res.json({ success: true, data: favorites });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await deleteFavorite(req.userId!, req.params['id'] as string);
    res.json({ success: true, data: { message: 'Favorite removed' } });
  } catch (err) {
    next(err);
  }
});

export default router;
