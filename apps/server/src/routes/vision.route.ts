import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { analyzeImage } from '../services/gemini.service.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
    }
  },
});

const base64Schema = z.object({
  imageBase64: z.string().min(10),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  userContext: z.string().max(500).optional(),
});

// Route for file upload
router.post('/upload', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: { code: 'NO_IMAGE', message: 'No image file provided' } });
      return;
    }

    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const userContext = req.body.userContext as string | undefined;

    const result = await analyzeImage({ imageBase64, mimeType, userContext });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// Route for base64 image from camera/URL
router.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = base64Schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid image data' } });
      return;
    }
    const result = await analyzeImage(parsed.data);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
