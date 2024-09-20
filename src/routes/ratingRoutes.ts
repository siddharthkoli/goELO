import { Router } from 'express';
import { updateRatings } from '../controllers/ratingController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/rating-update', authenticateJWT, updateRatings);

export default router;
